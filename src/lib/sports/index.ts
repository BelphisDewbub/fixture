import type { Game } from "@/types";
import { getWorldCupGames } from "./football-data/world-cup";

const SLUG_MAP: Record<string, () => Promise<Game[]>> = {
  "world-cup-2026": getWorldCupGames,
};

export async function getGamesBySlug(slug: string): Promise<Game[]> {
  const fetcher = SLUG_MAP[slug];
  if (!fetcher) return [];
  return fetcher();
}

export async function searchTeams(_query: string) {
  return [];
}
