import { NextResponse } from "next/server";
import { resolveTeamSlug, ACTIVE_STATUSES } from "@/lib/sports/resolve";
import { fetchLiveForTeam, type ESPNEvent } from "@/lib/sports/espn/client";
import { getLiveUsmntGame } from "@/lib/sports/espn/usmnt";

export const dynamic = "force-dynamic";

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (slug === "intl-soccer-usmnt") {
    try {
      const event = await getLiveUsmntGame();
      if (!event) return NextResponse.json({ hasLive: false });
      if (!ACTIVE_STATUSES.has(event.competitions[0]?.status?.type?.name ?? "")) {
        return NextResponse.json({ hasLive: false });
      }
      return NextResponse.json({ hasLive: true, game: extractGame(event) });
    } catch {
      return NextResponse.json({ hasLive: false });
    }
  }

  if (slug === "world-cup-2026") {
    try {
      const res = await fetch(`${ESPN_BASE}/soccer/fifa.world/scoreboard`, {
        cache: "no-store",
      });
      if (!res.ok) return NextResponse.json({ hasLive: false });
      const data = await res.json();
      const liveEvent = (data.events ?? [] as ESPNEvent[]).find((e: ESPNEvent) =>
        ACTIVE_STATUSES.has(e.competitions[0]?.status?.type?.name ?? "")
      );
      if (!liveEvent) return NextResponse.json({ hasLive: false });
      return NextResponse.json({ hasLive: true, game: extractGame(liveEvent) });
    } catch {
      return NextResponse.json({ hasLive: false });
    }
  }

  const team = resolveTeamSlug(slug);
  if (!team) return NextResponse.json({ hasLive: false });

  try {
    const event = await fetchLiveForTeam(team.espnSport, team.espnLeague, team.id);
    if (!event) return NextResponse.json({ hasLive: false });

    const comp = event.competitions[0];
    if (!ACTIVE_STATUSES.has(comp.status.type.name)) {
      return NextResponse.json({ hasLive: false });
    }

    return NextResponse.json({ hasLive: true, game: extractGame(event) });
  } catch {
    return NextResponse.json({ hasLive: false });
  }
}

function extractGame(event: ESPNEvent) {
  const comp = event.competitions[0];
  const home = comp.competitors.find((c) => c.homeAway === "home");
  const away = comp.competitors.find((c) => c.homeAway === "away");

  return {
    homeTeam: home?.team.displayName ?? "Home",
    awayTeam: away?.team.displayName ?? "Away",
    homeScore: home?.score ?? "0",
    awayScore: away?.score ?? "0",
    statusText:
      comp.status.type.shortDetail ?? comp.status.type.description ?? "Live",
    venue: comp.venue?.fullName,
  };
}
