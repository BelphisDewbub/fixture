"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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
