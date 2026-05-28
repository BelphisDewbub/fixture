import { fetchCompetitionScoreboard, type ESPNCompetitor } from "./client";
import type { Game, BroadcastInfo } from "@/types";

const scoreStr = (s: ESPNCompetitor["score"]) =>
  typeof s === "object" && s !== null ? s.displayValue : s;

const STAGE_LABELS: Record<string, string> = {
  "group-stage":      "Group Stage",
  "round-of-32":      "Round of 32",
  "round-of-16":      "Round of 16",
  "quarterfinals":    "Quarter-Finals",
  "semifinals":       "Semi-Finals",
  "3rd-place-match":  "3rd Place",
  "final":            "Final",
};

async function fetchTeamGroupMap(): Promise<Map<string, string>> {
  try {
    const res = await fetch(
      "https://site.api.espn.com/apis/v2/sports/soccer/fifa.world/standings",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return new Map();
    const data = await res.json();
    const map = new Map<string, string>();
    for (const child of data.children ?? []) {
      const letter = (child.name as string).replace(/^Group\s+/i, "").trim();
      for (const entry of child.standings?.entries ?? []) {
        map.set(String(entry.team.id), letter);
      }
    }
    return map;
  } catch {
    return new Map();
  }
}

export async function getWorldCupGames(): Promise<Game[]> {
  const [{ events }, teamGroupMap] = await Promise.all([
    fetchCompetitionScoreboard("soccer", "fifa.world", "20260611-20260719"),
    fetchTeamGroupMap(),
  ]);

  return events.map((e) => {
    const comp = e.competitions[0];
    const home = comp.competitors.find((c) => c.homeAway === "home");
    const away = comp.competitors.find((c) => c.homeAway === "away");
    const stageSlug = e.season.slug ?? "";
    const stageLabel = STAGE_LABELS[stageSlug] ?? "FIFA World Cup 2026";

    // Group lookup: use home team ID (both teams are in the same group)
    const group = home?.team.id ? teamGroupMap.get(home.team.id) : undefined;

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

    const isCompleted = comp.status.type.completed;

    return {
      id: e.id,
      homeTeam: home?.team.displayName ?? "TBD",
      awayTeam: away?.team.displayName ?? "TBD",
      homeScore: isCompleted ? scoreStr(home?.score) : undefined,
      awayScore: isCompleted ? scoreStr(away?.score) : undefined,
      completed: isCompleted || undefined,
      kickoff: new Date(e.date),
      venue: comp.venue?.fullName,
      competition: group
        ? `FIFA World Cup 2026 — ${stageLabel} — Group ${group}`
        : `FIFA World Cup 2026 — ${stageLabel}`,
      stage: stageSlug || undefined,
      group: group || undefined,
      broadcastInfo,
    };
  });
}
