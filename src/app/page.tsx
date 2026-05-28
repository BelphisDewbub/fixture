import Link from "next/link";
import { Footer } from "@/components/Footer";
import { LeagueBrowser } from "@/components/LeagueBrowser";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { MLB_TEAMS } from "@/lib/sports/espn/mlb";
import { NFL_TEAMS } from "@/lib/sports/espn/nfl";
import { NBA_TEAMS } from "@/lib/sports/espn/nba";
import { NHL_TEAMS } from "@/lib/sports/espn/nhl";
import { MLS_TEAMS } from "@/lib/sports/espn/mls";
import { EPL_TEAMS } from "@/lib/sports/espn/premier-league";
import { WNBA_TEAMS } from "@/lib/sports/espn/wnba";
import { NCAAF_TEAMS } from "@/lib/sports/espn/ncaa-football";
import { NCAAB_TEAMS } from "@/lib/sports/espn/ncaa-basketball";
import { INTL_SOCCER_TEAMS } from "@/lib/sports/espn/intl-soccer";

function sortedTeams(teams: Record<string, { id: number; name: string; logoUrl: string }>) {
  return Object.entries(teams)
    .map(([slug, t]) => ({ slug, name: t.name, logoUrl: t.logoUrl }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

const SECTIONS = [
  {
    type: "teams" as const,
    id: "intl-soccer",
    label: "International Soccer",
    sport: "Soccer",
    logoUrl: "https://a.espncdn.com/i/leaguelogos/soccer/500/4.png",
    prefix: "intl-soccer",
    teams: Object.entries(INTL_SOCCER_TEAMS)
      .map(([slug, t]) => ({ slug, name: t.name, logoUrl: t.logoUrl }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  },
  {
    type: "tournament" as const,
    id: "world-cup-2026",
    label: "World Cup 2026",
    logoUrl: "https://a.espncdn.com/i/leaguelogos/soccer/500/4.png",
    slug: "world-cup-2026",
    name: "FIFA World Cup 2026",
    sport: "Soccer",
    dates: "Jun 11 – Jul 19, 2026",
    description: "All group stage and knockout matches across the US, Canada, and Mexico",
    matchCount: 104,
  },
  {
    type: "teams" as const,
    id: "mlb",
    label: "MLB",
    sport: "Baseball",
    logoUrl: "https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png",
    prefix: "mlb",
    teams: sortedTeams(MLB_TEAMS),
  },
  {
    type: "teams" as const,
    id: "nfl",
    label: "NFL",
    sport: "Football",
    logoUrl: "https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png",
    prefix: "nfl",
    teams: sortedTeams(NFL_TEAMS),
  },
  {
    type: "teams" as const,
    id: "nba",
    label: "NBA",
    sport: "Basketball",
    logoUrl: "https://a.espncdn.com/i/teamlogos/leagues/500/nba.png",
    prefix: "nba",
    teams: sortedTeams(NBA_TEAMS),
  },
  {
    type: "teams" as const,
    id: "nhl",
    label: "NHL",
    sport: "Hockey",
    logoUrl: "https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png",
    prefix: "nhl",
    teams: sortedTeams(NHL_TEAMS),
  },
  {
    type: "teams" as const,
    id: "mls",
    label: "MLS",
    sport: "Soccer",
    logoUrl: "https://a.espncdn.com/i/leaguelogos/soccer/500/19.png",
    prefix: "mls",
    teams: sortedTeams(MLS_TEAMS),
  },
  {
    type: "teams" as const,
    id: "epl",
    label: "Premier League",
    sport: "Soccer",
    logoUrl: "https://a.espncdn.com/i/leaguelogos/soccer/500/23.png",
    prefix: "epl",
    teams: sortedTeams(EPL_TEAMS),
  },
  {
    type: "teams" as const,
    id: "wnba",
    label: "WNBA",
    sport: "Basketball",
    logoUrl: "https://a.espncdn.com/i/teamlogos/leagues/500/wnba.png",
    prefix: "wnba",
    teams: sortedTeams(WNBA_TEAMS),
  },
  {
    type: "teams" as const,
    id: "ncaaf",
    label: "NCAA Football",
    sport: "Football",
    logoUrl: "https://a.espncdn.com/i/teamlogos/leagues/500/college-football.png",
    prefix: "ncaaf",
    teams: sortedTeams(NCAAF_TEAMS),
  },
  {
    type: "teams" as const,
    id: "ncaab",
    label: "NCAA Basketball",
    sport: "Basketball",
    logoUrl: "https://a.espncdn.com/i/teamlogos/leagues/500/mens-college-basketball.png",
    prefix: "ncaab",
    teams: sortedTeams(NCAAB_TEAMS),
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 font-sans">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Fixture</span>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-400 dark:text-zinc-500 hidden sm:block">
              Sports schedules, straight to your calendar
            </span>
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
          Never miss a game.
        </h1>
        <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Subscribe to any team or tournament. Every match lands in your calendar
          automatically — with kickoff times, venues, and where to stream.
        </p>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { step: "1", label: "Find your team or tournament" },
            { step: "2", label: "Click Subscribe to get your feed URL" },
            { step: "3", label: "Paste it once — games sync automatically" },
          ].map(({ step, label }) => (
            <div key={step} className="flex items-center gap-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-5 py-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40 text-sm font-bold text-green-700 dark:text-green-400">
                {step}
              </span>
              <span className="text-sm text-zinc-700 dark:text-zinc-300">{label}</span>
            </div>
          ))}
          <Link
            href="/how-to-add"
            className="flex items-center gap-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-5 py-4 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors group"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-700 text-sm font-bold text-zinc-500 dark:text-zinc-400">
              ?
            </span>
            <span className="text-sm text-zinc-700 dark:text-zinc-300 flex-1">Not sure how to add it? Step-by-step guides</span>
            <span className="text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors text-sm">→</span>
          </Link>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-6 pb-24">
        <LeagueBrowser sections={SECTIONS} />
      </main>

      <Footer />
    </div>
  );
}
