import { fetchCompetitionScoreboard } from "./client";
import type { Game, BroadcastInfo } from "@/types";

const STAGE_LABELS: Record<string, string> = {
  "group-stage":   "Group Stage",
  "round-of-32":   "Round of 32",
  "round-of-16":   "Round of 16",
  "quarterfinals": "Quarter-Finals",
  "semifinals":    "Semi-Finals",
  "third-place":   "3rd Place",
  "final":         "Final",
};

export async function getWorldCupGames(): Promise<Game[]> {
  const events = await fetchCompetitionScoreboard("soccer", "fifa.world", "20260611-20260719");

  return events.map((e) => {
    const comp = e.competitions[0];
    const home = comp.competitors.find((c) => c.homeAway === "home");
    const away = comp.competitors.find((c) => c.homeAway === "away");
    const stage = STAGE_LABELS[e.season.slug ?? ""] ?? "FIFA World Cup 2026";

    const networks: string[] = [];
    for (const b of comp.broadcasts ?? []) {
      if (b.names) {
        networks.push(...b.names);
      } else if (b.media?.shortName) {
        networks.push(b.media.shortName);
      }
    }
    const broadcastInfo: BroadcastInfo = {
      networks,
      streamingServices: [],
      leagueUrl: "https://www.foxsports.com/soccer/fifa-world-cup",
    };

    return {
      id: e.id,
      homeTeam: home?.team.displayName ?? "TBD",
      awayTeam: away?.team.displayName ?? "TBD",
      kickoff: new Date(e.date),
      venue: comp.venue?.fullName,
      competition: `FIFA World Cup 2026 — ${stage}`,
      broadcastInfo,
    };
  });
}
