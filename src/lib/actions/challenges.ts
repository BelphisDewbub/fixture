"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { type ChallengeWeights } from "@/lib/weights";

export async function createChallenge(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin?callbackUrl=/challenges/new");

  const name = (formData.get("name") as string)?.trim();
  const tournamentSlug = formData.get("tournamentSlug") as string;
  if (!name || !tournamentSlug) return;

  const challenge = await prisma.challenge.create({
    data: { name, tournamentSlug, createdById: session.user.id },
  });

  await prisma.challengeEntry.create({
    data: { challengeId: challenge.id, userId: session.user.id },
  });

  redirect(`/challenges/${challenge.id}`);
}

export async function saveWeights(
  challengeId: string,
  weights: ChallengeWeights,
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    select: { createdById: true },
  });
  if (!challenge || challenge.createdById !== session.user.id) return { error: "Unauthorized" };

  await prisma.challenge.update({ where: { id: challengeId }, data: { weights } });
  revalidatePath(`/challenges/${challengeId}`);
  return {};
}

export async function removeMember(
  challengeId: string,
  targetUserId: string,
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: { entries: { select: { userId: true, isAdmin: true } } },
  });
  if (!challenge) return { error: "Not found" };

  const myEntry = challenge.entries.find((e) => e.userId === session.user.id);
  const isOwner = challenge.createdById === session.user.id;
  const isAdmin = myEntry?.isAdmin ?? false;

  if (!isOwner && !isAdmin) return { error: "Unauthorized" };
  if (targetUserId === challenge.createdById) return { error: "Cannot remove the owner" };
  if (targetUserId === session.user.id) return { error: "Cannot remove yourself" };

  await prisma.challengeEntry.delete({
    where: { challengeId_userId: { challengeId, userId: targetUserId } },
  });
  revalidatePath(`/challenges/${challengeId}`);
  return {};
}

export async function setAdmin(
  challengeId: string,
  targetUserId: string,
  isAdmin: boolean,
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    select: { createdById: true },
  });
  if (!challenge || challenge.createdById !== session.user.id) return { error: "Unauthorized" };
  if (targetUserId === challenge.createdById) return { error: "Cannot change owner's admin status" };

  await prisma.challengeEntry.update({
    where: { challengeId_userId: { challengeId, userId: targetUserId } },
    data: { isAdmin },
  });
  return {};
}

export async function deleteChallenge(challengeId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!challenge || challenge.createdById !== session.user.id) return;

  await prisma.challenge.delete({ where: { id: challengeId } });
  redirect("/challenges");
}

export async function joinChallenge(formData: FormData) {
  const code = formData.get("code") as string;
  const session = await auth();
  if (!session?.user?.id) redirect(`/api/auth/signin?callbackUrl=/challenges/join/${code}`);

  const challenge = await prisma.challenge.findUnique({ where: { inviteCode: code } });
  if (!challenge) redirect("/challenges");

  await prisma.challengeEntry.upsert({
    where: { challengeId_userId: { challengeId: challenge.id, userId: session.user.id } },
    create: { challengeId: challenge.id, userId: session.user.id },
    update: {},
  });

  redirect(`/challenges/${challenge.id}`);
}
