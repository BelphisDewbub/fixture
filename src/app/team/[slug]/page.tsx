import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { resolveTeamSlug, ACTIVE_STATUSES } from "@/lib/sports/resolve";
import { getGamesBySlug } from "@/lib/sports";
import { fetchLiveForTeam } from "@/lib/sports/espn/client";
import { LiveGameBanner } from "@/components/LiveGameBanner";
import { ScheduleTable, type SerializedGame } from "@/components/ScheduleTable";
import { SubscribeStrip } from "@/components/SubscribeStrip";
import { Footer } from "@/components/Footer";
import type { Game } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function TeamPage({ params }: Props) {
  const { slug } = await params;
  const team = resolveTeamSlug(slug);
  if (!team) notFound();

  const [games, liveEvent] = await Promise.all([
    getGamesBySlug(slug).catch(() => [] as Game[]),
    fetchLiveForTeam(team.espnSport, team.espnLeague, team.id).catch(() => null),
  ]);

  const comp = liveEvent?.competitions[0];
  const isLive =
    !!comp && ACTIVE_STATUSES.has(comp.status.type.name);

  const liveGame = isLive && comp
    ? {
        homeTeam: comp.competitors.find((c) => c.homeAway === "home")?.team.displayName ?? "Home",
        awayTeam: comp.competitors.find((c) => c.homeAway === "away")?.team.displayName ?? "Away",
        homeScore: comp.competitors.find((c) => c.homeAway === "home")?.score ?? "0",
        awayScore: comp.competitors.find((c) => c.homeAway === "away")?.score ?? "0",
        statusText: comp.status.type.shortDetail ?? comp.status.type.description ?? "Live",
        venue: comp.venue?.fullName,
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
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center gap-3">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            ← Back
          </Link>
          <span className="text-zinc-200">|</span>
          <span className="text-sm font-medium text-zinc-500">
            {team.prefix.toUpperCase()}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center gap-5 mb-8">
          <div className="shrink-0 w-16 h-16 relative">
            <Image
              src={team.logoUrl}
              alt={team.name}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-1">
              {team.prefix.toUpperCase()}
            </p>
            <h1 className="text-2xl font-bold text-zinc-900 leading-tight">
              {team.name}
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
      <Footer />
    </div>
  );
}
