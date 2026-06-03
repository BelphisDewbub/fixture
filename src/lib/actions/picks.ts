"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type GroupPicksData = Record<string, string[]>;
export type BracketPicksData = Record<string, string>;

export async function saveGroupPicks(entryId: string, picks: GroupPicksData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const entry = await prisma.challengeEntry.findUnique({ where: { id: entryId } });
  if (!entry || entry.userId !== session.user.id) throw new Error("Forbidden");

  await prisma.pick.upsert({
    where: { entryId_phase: { entryId, phase: "groups" } },
    create: { entryId, phase: "groups", data: picks },
    update: { data: picks },
  });
}

export async function saveBracketPicks(entryId: string, picks: BracketPicksData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const entry = await prisma.challengeEntry.findUnique({ where: { id: entryId } });
  if (!entry || entry.userId !== session.user.id) throw new Error("Forbidden");

  await prisma.pick.upsert({
    where: { entryId_phase: { entryId, phase: "bracket" } },
    create: { entryId, phase: "bracket", data: picks },
    update: { data: picks },
  });
}
