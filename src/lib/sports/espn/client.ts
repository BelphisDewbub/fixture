import type { Game, BroadcastInfo } from "@/types";

const BASE = "https://site.api.espn.com/apis/site/v2/sports";

export interface ESPNCompetitor {
  homeAway: "home" | "away";
  team: { id: string; displayName: string };
}

export interface ESPNEvent {
  id: string;
  date: string; // UTC ISO e.g. "2026-05-28T22:40Z"
  name: string;
  season: { year: number; displayName: string };
  competitions: Array<{
    venue?: { fullName: string; address?: { city?: string; state?: string } };
    competitors: ESPNCompetitor[];
    broadcasts?: Array<{
      type: { shortName: string }; // "TV" | "Streaming"
      media: { shortName: string };
    }>;
    status: { type: { name: string; completed: boolean } };
    links?: Array<{ rel: string[]; href: string }>;
  }>;
}

interface ESPNScheduleResponse {
  events: ESPNEvent[];
}

const SKIP_STATUSES = new Set([
  "STATUS_CANCELED",
  "STATUS_POSTPONED",
  "STATUS_SUSPENDED",
]);

export async function fetchTeamSchedule(
  sport: string,
  league: string,
  teamId: string | number
): Promise<ESPNEvent[]> {
  const res = await fetch(
    `${BASE}/${sport}/${league}/teams/${teamId}/schedule`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) throw new Error(`ESPN error: ${res.status} — ${sport}/${league}/teams/${teamId}`);

  const data: ESPNScheduleResponse = await res.json();
  return (data.events ?? []).filter(
    (e) => !SKIP_STATUSES.has(e.competitions[0]?.status.type.name)
  );
}

export function espnToGame(event: ESPNEvent, competitionLabel: string, leagueUrl?: string): Game {
  const comp = event.competitions[0];
  const home = comp.competitors.find((c) => c.homeAway === "home");
  const away = comp.competitors.find((c) => c.homeAway === "away");

  const networks: string[] = [];
  const streaming: string[] = [];
  for (const b of comp.broadcasts ?? []) {
    if (b.type.shortName === "TV") networks.push(b.media.shortName);
    else streaming.push(b.media.shortName);
  }

  const broadcastInfo: BroadcastInfo = { networks, streamingServices: streaming };

  if (leagueUrl) broadcastInfo.leagueUrl = leagueUrl;

  return {
    id: event.id,
    homeTeam: home?.team.displayName ?? "TBD",
    awayTeam: away?.team.displayName ?? "TBD",
    kickoff: new Date(event.date),
    venue: comp.venue?.fullName,
    competition: competitionLabel,
    broadcastInfo,
  };
}
