import { fetchTeamSchedule, espnToGame } from "./client";
import type { Game } from "@/types";

export const WNBA_TEAMS: Record<string, { id: number; name: string; logoUrl: string }> = {
  "atlanta-dream":          { id: 20,     name: "Atlanta Dream",          logoUrl: "https://a.espncdn.com/i/teamlogos/wnba/500/20.png" },
  "chicago-sky":            { id: 19,     name: "Chicago Sky",            logoUrl: "https://a.espncdn.com/i/teamlogos/wnba/500/19.png" },
  "connecticut-sun":        { id: 18,     name: "Connecticut Sun",        logoUrl: "https://a.espncdn.com/i/teamlogos/wnba/500/18.png" },
  "dallas-wings":           { id: 3,      name: "Dallas Wings",           logoUrl: "https://a.espncdn.com/i/teamlogos/wnba/500/3.png" },
  "golden-state-valkyries": { id: 129689, name: "Golden State Valkyries", logoUrl: "https://a.espncdn.com/i/teamlogos/wnba/500/129689.png" },
  "indiana-fever":          { id: 5,      name: "Indiana Fever",          logoUrl: "https://a.espncdn.com/i/teamlogos/wnba/500/5.png" },
  "las-vegas-aces":         { id: 17,     name: "Las Vegas Aces",         logoUrl: "https://a.espncdn.com/i/teamlogos/wnba/500/17.png" },
  "los-angeles-sparks":     { id: 6,      name: "Los Angeles Sparks",     logoUrl: "https://a.espncdn.com/i/teamlogos/wnba/500/6.png" },
  "minnesota-lynx":         { id: 8,      name: "Minnesota Lynx",         logoUrl: "https://a.espncdn.com/i/teamlogos/wnba/500/8.png" },
  "new-york-liberty":       { id: 9,      name: "New York Liberty",       logoUrl: "https://a.espncdn.com/i/teamlogos/wnba/500/9.png" },
  "phoenix-mercury":        { id: 11,     name: "Phoenix Mercury",        logoUrl: "https://a.espncdn.com/i/teamlogos/wnba/500/11.png" },
  "portland-fire":          { id: 132052, name: "Portland Fire",          logoUrl: "https://a.espncdn.com/i/teamlogos/wnba/500/132052.png" },
  "seattle-storm":          { id: 14,     name: "Seattle Storm",          logoUrl: "https://a.espncdn.com/i/teamlogos/wnba/500/14.png" },
  "toronto-tempo":          { id: 131935, name: "Toronto Tempo",          logoUrl: "https://a.espncdn.com/i/teamlogos/wnba/500/131935.png" },
  "washington-mystics":     { id: 16,     name: "Washington Mystics",     logoUrl: "https://a.espncdn.com/i/teamlogos/wnba/500/16.png" },
};

export async function getWnbaTeamGames(teamSlug: string): Promise<Game[]> {
  const team = WNBA_TEAMS[teamSlug];
  if (!team) return [];
  const events = await fetchTeamSchedule("basketball", "wnba", team.id);
  return events.map((e) => espnToGame(e, `WNBA ${e.season.year}`, "https://www.wnba.com/schedule"));
}
