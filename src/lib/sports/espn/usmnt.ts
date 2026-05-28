import { fetchTeamSchedule, fetchLiveForTeam, espnToGame, type ESPNEvent } from "./client";
import { getWorldCupGames } from "./world-cup";
import type { Game } from "@/types";

const TEAM_ID = 660;

// Competitions the USMNT participates in, with human-readable fallback labels
const COMPETITIONS: Array<{ espnLeague: string; fallbackLabel: string }> = [
  { espnLeague: "concacaf.gold",          fallbackLabel: "CONCACAF Gold Cup" },
  { espnLeague: "concacaf.nations.league", fallbackLabel: "CONCACAF Nations League" },
];

export async function getUsmntGames(): Promise<Game[]> {
  const settled = await Promise.allSettled([
    ...COMPETITIONS.map(async ({ espnLeague, fallbackLabel }) => {
      const events = await fetchTeamSchedule("soccer", espnLeague, TEAM_ID);
      return events.map((e) =>
        espnToGame(e, e.season.displayName ?? fallbackLabel)
      );
    }),
    // World Cup 2026: reuse the competition scoreboard, filter for US
    getWorldCupGames().then((games) =>
      games.filter(
        (g) => g.homeTeam === "United States" || g.awayTeam === "United States"
      )
    ),
  ]);

  const seen = new Set<string>();
  const games: Game[] = [];

  for (const result of settled) {
    if (result.status === "fulfilled") {
      for (const game of result.value) {
        if (!seen.has(game.id)) {
          seen.add(game.id);
          games.push(game);
        }
      }
    }
  }

  return games.sort((a, b) => a.kickoff.getTime() - b.kickoff.getTime());
}

export async function getLiveUsmntGame(): Promise<ESPNEvent | null> {
  const checks = await Promise.allSettled(
    COMPETITIONS.map(({ espnLeague }) =>
      fetchLiveForTeam("soccer", espnLeague, TEAM_ID)
    )
  );

  for (const result of checks) {
    if (result.status === "fulfilled" && result.value) return result.value;
  }
  return null;
}
