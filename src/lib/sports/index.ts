import type { Game } from "@/types";
import { getWorldCupGames } from "./espn/world-cup";
import { getMlbTeamGames, MLB_TEAMS } from "./espn/mlb";
import { getNflTeamGames, NFL_TEAMS } from "./espn/nfl";
import { getNbaTeamGames, NBA_TEAMS } from "./espn/nba";
import { getNhlTeamGames, NHL_TEAMS } from "./espn/nhl";

const STATIC_SLUGS: Record<string, () => Promise<Game[]>> = {
  "world-cup-2026": getWorldCupGames,
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
};

export async function getGamesBySlug(slug: string): Promise<Game[]> {
  const fetcher = SLUG_MAP[slug];
  if (!fetcher) return [];
  return fetcher();
}

export async function searchTeams(_query: string) {
  return [];
}
