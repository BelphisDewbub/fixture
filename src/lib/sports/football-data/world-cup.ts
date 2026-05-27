import { fetchCompetitionMatches } from "./client";
import type { Game, BroadcastInfo } from "@/types";

// US broadcast rights for World Cup 2026
const WORLD_CUP_BROADCAST: BroadcastInfo = {
  networks: ["FOX", "FS1", "Telemundo", "Universo"],
  streamingServices: ["Fubo", "DirecTV Stream", "Peacock", "Fox Sports app"],
  leagueUrl: "https://www.foxsports.com/soccer/fifa-world-cup",
};

function stageLabel(stage: string, group: string | null): string {
  const labels: Record<string, string> = {
    GROUP_STAGE: group ? `Group Stage — ${group.replace("GROUP_", "Group ")}` : "Group Stage",
    ROUND_OF_32: "Round of 32",
    ROUND_OF_16: "Round of 16",
    QUARTER_FINALS: "Quarter-Finals",
    SEMI_FINALS: "Semi-Finals",
    THIRD_PLACE: "3rd Place",
    FINAL: "Final",
  };
  return labels[stage] ?? stage;
}

export async function getWorldCupGames(): Promise<Game[]> {
  const matches = await fetchCompetitionMatches("WC");

  return matches
    .filter((m) => m.status !== "CANCELLED" && m.status !== "POSTPONED")
    .map((m) => ({
      id: String(m.id),
      homeTeam: m.homeTeam.name,
      awayTeam: m.awayTeam.name,
      kickoff: new Date(m.utcDate),
      venue: m.venue ?? undefined,
      competition: `FIFA World Cup 2026 — ${stageLabel(m.stage, m.group)}`,
      broadcastInfo: WORLD_CUP_BROADCAST,
    }));
}
