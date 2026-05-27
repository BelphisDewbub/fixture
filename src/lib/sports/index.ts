import type { Game } from "@/types";

// Placeholder — wire up real API clients here (football-data.org, TheSportsDB, etc.)
export async function getGamesBySlug(_slug: string): Promise<Game[]> {
  return [];
}

export async function searchTeams(_query: string) {
  return [];
}
