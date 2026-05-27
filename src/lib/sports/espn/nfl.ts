import { fetchTeamSchedule, espnToGame } from "./client";
import type { Game } from "@/types";

export const NFL_TEAMS: Record<string, { id: number; name: string; logoUrl: string }> = {
  "arizona-cardinals":      { id: 22, name: "Arizona Cardinals",      logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/22.png" },
  "atlanta-falcons":        { id: 1,  name: "Atlanta Falcons",         logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/1.png" },
  "baltimore-ravens":       { id: 33, name: "Baltimore Ravens",        logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/33.png" },
  "buffalo-bills":          { id: 2,  name: "Buffalo Bills",           logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/2.png" },
  "carolina-panthers":      { id: 29, name: "Carolina Panthers",       logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/29.png" },
  "chicago-bears":          { id: 3,  name: "Chicago Bears",           logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/3.png" },
  "cincinnati-bengals":     { id: 4,  name: "Cincinnati Bengals",      logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/4.png" },
  "cleveland-browns":       { id: 5,  name: "Cleveland Browns",        logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/5.png" },
  "dallas-cowboys":         { id: 6,  name: "Dallas Cowboys",          logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/6.png" },
  "denver-broncos":         { id: 7,  name: "Denver Broncos",          logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/7.png" },
  "detroit-lions":          { id: 8,  name: "Detroit Lions",           logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/8.png" },
  "green-bay-packers":      { id: 9,  name: "Green Bay Packers",       logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/9.png" },
  "houston-texans":         { id: 34, name: "Houston Texans",          logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/34.png" },
  "indianapolis-colts":     { id: 11, name: "Indianapolis Colts",      logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/11.png" },
  "jacksonville-jaguars":   { id: 30, name: "Jacksonville Jaguars",    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/30.png" },
  "kansas-city-chiefs":     { id: 12, name: "Kansas City Chiefs",      logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/12.png" },
  "las-vegas-raiders":      { id: 13, name: "Las Vegas Raiders",       logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/13.png" },
  "los-angeles-chargers":   { id: 24, name: "Los Angeles Chargers",    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/24.png" },
  "los-angeles-rams":       { id: 14, name: "Los Angeles Rams",        logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/14.png" },
  "miami-dolphins":         { id: 15, name: "Miami Dolphins",          logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/15.png" },
  "minnesota-vikings":      { id: 16, name: "Minnesota Vikings",       logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/16.png" },
  "new-england-patriots":   { id: 17, name: "New England Patriots",    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/17.png" },
  "new-orleans-saints":     { id: 18, name: "New Orleans Saints",      logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/18.png" },
  "new-york-giants":        { id: 19, name: "New York Giants",         logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/19.png" },
  "new-york-jets":          { id: 20, name: "New York Jets",           logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/20.png" },
  "philadelphia-eagles":    { id: 21, name: "Philadelphia Eagles",     logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/21.png" },
  "pittsburgh-steelers":    { id: 23, name: "Pittsburgh Steelers",     logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/23.png" },
  "san-francisco-49ers":    { id: 25, name: "San Francisco 49ers",     logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/25.png" },
  "seattle-seahawks":       { id: 26, name: "Seattle Seahawks",        logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/26.png" },
  "tampa-bay-buccaneers":   { id: 27, name: "Tampa Bay Buccaneers",    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/27.png" },
  "tennessee-titans":       { id: 10, name: "Tennessee Titans",        logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/10.png" },
  "washington-commanders":  { id: 28, name: "Washington Commanders",   logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/28.png" },
};

export async function getNflTeamGames(teamSlug: string): Promise<Game[]> {
  const team = NFL_TEAMS[teamSlug];
  if (!team) return [];
  const events = await fetchTeamSchedule("football", "nfl", team.id);
  return events.map((e) => espnToGame(e, `NFL ${e.season.year}`, "https://www.nfl.com/schedules"));
}
