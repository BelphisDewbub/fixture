import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getWorldCupGames } from "@/lib/sports/espn/world-cup";
import { ACTIVE_STATUSES } from "@/lib/sports/resolve";
import { LiveGameBanner } from "@/components/LiveGameBanner";
import { ScheduleTable, type SerializedGame } from "@/components/ScheduleTable";
import { SubscribeStrip } from "@/components/SubscribeStrip";
import type { Game } from "@/types";

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports";

interface TournamentConfig {
  name: string;
  sport: string;
  logoUrl: string;
  dates: string;
  fetchGames: () => Promise<Game[]>;
  scoreboardUrl: string;
}

const TOURNAMENTS: Record<string, TournamentConfig> = {
  "world-cup-2026": {
    name: "FIFA World Cup 2026",
    sport: "Soccer",
    logoUrl: "https://a.espncdn.com/i/leaguelogos/soccer/500/4.png",
    dates: "Jun 11 – Jul 19, 2026",
    fetchGames: getWorldCupGames,
    scoreboardUrl: `${ESPN_BASE}/soccer/fifa.world/scoreboard`,
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function TournamentPage({ params }: Props) {
  const { slug } = await params;
  const config = TOURNAMENTS[slug];
  if (!config) notFound();

  const [games, scoreboardData] = await Promise.all([
    config.fetchGames().catch(() => [] as Game[]),
    fetch(config.scoreboardUrl, { cache: "no-store" })
      .then((r) => r.json())
      .catch(() => ({ events: [] })),
  ]);

  type ESPNEventRaw = {
    competitions: Array<{
      competitors: Array<{ homeAway: string; team: { displayName: string }; score?: string }>;
      status: { type: { name: string; shortDetail?: string; description?: string } };
      venue?: { fullName: string };
    }>;
  };

  const liveEvent = ((scoreboardData.events ?? []) as ESPNEventRaw[]).find((e) =>
    ACTIVE_STATUSES.has(e.competitions[0]?.status?.type?.name ?? "")
  );

  const isLive = !!liveEvent;
  const liveComp = liveEvent?.competitions[0];
  const liveGame = liveComp
    ? {
        homeTeam: liveComp.competitors.find((c) => c.homeAway === "home")?.team.displayName ?? "Home",
        awayTeam: liveComp.competitors.find((c) => c.homeAway === "away")?.team.displayName ?? "Away",
        homeScore: liveComp.competitors.find((c) => c.homeAway === "home")?.score ?? "0",
        awayScore: liveComp.competitors.find((c) => c.homeAway === "away")?.score ?? "0",
        statusText: liveComp.status.type.shortDetail ?? liveComp.status.type.description ?? "Live",
        venue: liveComp.venue?.fullName,
      }
    : undefined;

  const serialized: SerializedGame[] = (games as Game[]).map((g) => ({
    id: g.id,
    homeTeam: g.homeTeam,
    awayTeam: g.awayTeam,
    kickoff: g.kickoff.toISOString(),
    venue: g.venue,
    competition: g.competition,
    broadcastInfo: g.broadcastInfo,
  }));

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            ← Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center gap-5 mb-8">
          <div className="shrink-0 w-16 h-16 relative">
            <Image
              src={config.logoUrl}
              alt={config.name}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-1">
              {config.sport} · {config.dates}
            </p>
            <h1 className="text-2xl font-bold text-zinc-900 leading-tight">
              {config.name}
            </h1>
          </div>
          <SubscribeStrip slug={slug} />
        </div>

        <LiveGameBanner
          slug={slug}
          initial={{ hasLive: isLive, game: liveGame }}
        />

        <ScheduleTable games={serialized} />
      </main>
    </div>
  );
}
