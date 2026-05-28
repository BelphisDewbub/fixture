import type { Game } from "@/types";
import { getWorldCupGames } from "./espn/world-cup";
import { INTL_SOCCER_TEAMS, getIntlSoccerGames } from "./espn/intl-soccer";
import { getMlbTeamGames, MLB_TEAMS } from "./espn/mlb";
import { getNflTeamGames, NFL_TEAMS } from "./espn/nfl";
import { getNbaTeamGames, NBA_TEAMS } from "./espn/nba";
import { getNhlTeamGames, NHL_TEAMS } from "./espn/nhl";
import { getMlsTeamGames, MLS_TEAMS } from "./espn/mls";
import { getEplTeamGames, EPL_TEAMS } from "./espn/premier-league";
import { getWnbaTeamGames, WNBA_TEAMS } from "./espn/wnba";
import { getNcaafTeamGames, NCAAF_TEAMS } from "./espn/ncaa-football";
import { getNcaabTeamGames, NCAAB_TEAMS } from "./espn/ncaa-basketball";

const INTL_SOCCER_SLUGS = Object.fromEntries(
  Object.keys(INTL_SOCCER_TEAMS).map((slug) => [
    `intl-soccer-${slug}`,
    () => getIntlSoccerGames(slug),
  ])
);

const STATIC_SLUGS: Record<string, () => Promise<Game[]>> = {
  "world-cup-2026": getWorldCupGames,
  ...INTL_SOCCER_SLUGS,
};

function makeTeamSlugs<T extends { id: number; name: string; logoUrl: string }>(
  teams: Record<string, T>,
  prefix: string,
  fetcher: (slug: string) => Promise<Game[]>
): Record<string, () => Promise<Game[]>> {
  return Object.fromEntries(
    Object.keys(teams).map((slug) => [`${prefix}-${slug}`, () => fetcher(slug)])
  );
}

const SLUG_MAP: Record<string, () => Promise<Game[]>> = {
  ...STATIC_SLUGS,
  ...makeTeamSlugs(MLB_TEAMS, "mlb", getMlbTeamGames),
  ...makeTeamSlugs(NFL_TEAMS, "nfl", getNflTeamGames),
  ...makeTeamSlugs(NBA_TEAMS, "nba", getNbaTeamGames),
  ...makeTeamSlugs(NHL_TEAMS, "nhl", getNhlTeamGames),
  ...makeTeamSlugs(MLS_TEAMS, "mls", getMlsTeamGames),
  ...makeTeamSlugs(EPL_TEAMS, "epl", getEplTeamGames),
  ...makeTeamSlugs(WNBA_TEAMS, "wnba", getWnbaTeamGames),
  ...makeTeamSlugs(NCAAF_TEAMS, "ncaaf", getNcaafTeamGames),
  ...makeTeamSlugs(NCAAB_TEAMS, "ncaab", getNcaabTeamGames),
};

export function slugifyTeamName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getGamesBySlug(slug: string): Promise<Game[]> {
  // tournament-scoped team slug, e.g. "world-cup-2026--brazil"
  const teamIdx = slug.indexOf("--");
  if (teamIdx !== -1) {
    const tournamentSlug = slug.slice(0, teamIdx);
    const teamSlug = slug.slice(teamIdx + 2);
    const tournamentFetcher = STATIC_SLUGS[tournamentSlug];
    if (!tournamentFetcher) return [];
    const allGames = await tournamentFetcher();
    return allGames.filter(
      (g) => slugifyTeamName(g.homeTeam) === teamSlug || slugifyTeamName(g.awayTeam) === teamSlug
    );
  }

  const fetcher = SLUG_MAP[slug];
  if (!fetcher) return [];
  return fetcher();
}

export async function searchTeams(_query: string) {
  return [];
}
