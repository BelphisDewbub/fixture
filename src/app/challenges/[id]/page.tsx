import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { ChallengeTabs } from "@/components/challenges/ChallengeTabs";
import { getWorldCupGames } from "@/lib/sports/espn/world-cup";
import { buildTournamentStructure } from "@/lib/tournament/structure";
import type { SerializedGame } from "@/components/ScheduleTable";
import type { Game } from "@/types";
import { scoreGroupPicks, scoreBracketPicks } from "@/lib/scoring";
import { simulateGroupStage, simulateAllBracketRounds } from "@/lib/simulate";
import type { GroupPicksData, BracketPicksData } from "@/lib/actions/picks";
import { resolveWeights } from "@/lib/weights";

const TEST_SIMULATE_RESULTS = false;

interface Props {
  params: Promise<{ id: string }>;
}

const TOURNAMENT_FETCHERS: Record<string, () => Promise<Game[]>> = {
  "world-cup-2026": getWorldCupGames,
};

export default async function ChallengePage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/api/auth/signin?callbackUrl=/challenges/${id}`);

  const [challenge, headersList] = await Promise.all([
    prisma.challenge.findUnique({
      where: { id },
      include: {
        entries: {
          include: { user: { select: { id: true, name: true, image: true } } },
          orderBy: { joinedAt: "asc" },
        },
      },
    }),
    headers(),
  ]);

  if (!challenge) notFound();

  const isMember = challenge.entries.some((e) => e.userId === session.user.id);
  if (!isMember) redirect(`/challenges/join/${challenge.inviteCode}`);

  const myEntry = challenge.entries.find((e) => e.userId === session.user.id)!;
  const weights = resolveWeights(challenge.weights);

  const fetcher = TOURNAMENT_FETCHERS[challenge.tournamentSlug];
  const [games, allPicks] = await Promise.all([
    fetcher ? fetcher().catch(() => [] as Game[]) : Promise.resolve([] as Game[]),
    prisma.pick.findMany({ where: { entryId: { in: challenge.entries.map((e) => e.id) } } }),
  ]);

  const serializedGames: SerializedGame[] = games.map((g) => ({
    id: g.id,
    homeTeam: g.homeTeam,
    awayTeam: g.awayTeam,
    homeScore: g.homeScore,
    awayScore: g.awayScore,
    completed: g.completed,
    kickoff: g.kickoff.toISOString(),
    venue: g.venue,
    competition: g.competition,
    stage: g.stage,
    group: g.group,
    broadcastInfo: g.broadcastInfo,
  }));

  const processedGames = TEST_SIMULATE_RESULTS
    ? simulateGroupStage(serializedGames)
    : serializedGames;
  const { groups, bracketRounds: rawRounds } = buildTournamentStructure(processedGames);
  const bracketRounds = TEST_SIMULATE_RESULTS
    ? simulateAllBracketRounds(groups)
    : rawRounds;

  // Simulation: July 3 = after group stage ends, safely before any bracket games
  const now = TEST_SIMULATE_RESULTS ? new Date("2026-07-03T12:00:00Z") : new Date();

  const groupGames = processedGames.filter((g) => g.stage === "group-stage");
  const firstGroupGame = [...groupGames].sort(
    (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
  )[0];
  const groupPicksLockedAuto = firstGroupGame
    ? new Date(firstGroupGame.kickoff) <= now
    : false;
  const groupPicksLocked = challenge.groupPicksOpen ? false : groupPicksLockedAuto;

  // When simulating, only the injected games determine lock state (ESPN bracket data has past kickoffs)
  const bracketGamesForLock = TEST_SIMULATE_RESULTS
    ? bracketRounds[0]?.games ?? []
    : bracketRounds.flatMap((r) => r.games);
  const firstBracketGame = [...bracketGamesForLock].sort(
    (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
  )[0];
  const bracketPicksUnlockedAuto = groupGames.length > 0 && groupGames.every((g) => g.completed);
  const bracketPicksUnlocked = challenge.bracketPicksOpen ? true : bracketPicksUnlockedAuto;
  const bracketPicksLockedAuto = firstBracketGame
    ? new Date(firstBracketGame.kickoff) <= now
    : false;
  const bracketPicksLocked = challenge.bracketPicksOpen ? false : bracketPicksLockedAuto;

  const myPicks = allPicks.filter((p) => p.entryId === myEntry.id);
  const groupPicksData = (myPicks.find((p) => p.phase === "groups")?.data ?? {}) as GroupPicksData;
  const bracketPicksData = (myPicks.find((p) => p.phase === "bracket")?.data ?? {}) as BracketPicksData;

  const allPicksData = challenge.entries.map((entry) => {
    const entryPicks = allPicks.filter((p) => p.entryId === entry.id);
    const gPicks = (entryPicks.find((p) => p.phase === "groups")?.data ?? {}) as GroupPicksData;
    const bPicks = (entryPicks.find((p) => p.phase === "bracket")?.data ?? {}) as BracketPicksData;
    return {
      userId: entry.userId,
      name: entry.user.name,
      image: entry.user.image,
      groupPicks: gPicks,
      bracketPicks: bPicks,
    };
  });

  const leaderboard = challenge.entries.map((entry) => {
    const entryPicks = allPicks.filter((p) => p.entryId === entry.id);
    const gPicks = (entryPicks.find((p) => p.phase === "groups")?.data ?? {}) as GroupPicksData;
    const bPicks = (entryPicks.find((p) => p.phase === "bracket")?.data ?? {}) as BracketPicksData;
    const groupScore = scoreGroupPicks(gPicks, groups, weights);
    const bracketScore = scoreBracketPicks(bPicks, bracketRounds, weights);
    return {
      userId: entry.userId,
      name: entry.user.name,
      image: entry.user.image,
      groupScore,
      bracketScore,
      total: groupScore + bracketScore,
    };
  });

  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const inviteUrl = `${protocol}://${host}/challenges/join/${challenge.inviteCode}`;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 font-sans">
      <main className="mx-auto max-w-4xl px-6 py-10 space-y-6">
        <div>
          <Link
            href="/challenges"
            className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            ← My challenges
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            {challenge.name}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{challenge.tournamentSlug}</p>
        </div>

        <ChallengeTabs
          challenge={{
            id: challenge.id,
            createdById: challenge.createdById,
            entries: challenge.entries,
            groupPicksOpen: challenge.groupPicksOpen,
            bracketPicksOpen: challenge.bracketPicksOpen,
          }}
          myUserId={session.user.id}
          myEntryId={myEntry.id}
          myIsAdmin={myEntry.isAdmin}
          weights={weights}
          inviteUrl={inviteUrl}
          groups={groups}
          bracketRounds={bracketRounds}
          groupPicks={groupPicksData}
          bracketPicks={bracketPicksData}
          groupPicksLocked={groupPicksLocked}
          bracketPicksUnlocked={bracketPicksUnlocked}
          bracketPicksLocked={bracketPicksLocked}
          leaderboard={leaderboard}
          allPicksData={allPicksData}
        />
      </main>
      <Footer />
    </div>
  );
}
