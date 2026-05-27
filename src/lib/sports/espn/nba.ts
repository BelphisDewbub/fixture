import { fetchTeamSchedule, espnToGame } from "./client";
import type { Game } from "@/types";

export const NBA_TEAMS: Record<string, { id: number; name: string; logoUrl: string }> = {
  "atlanta-hawks":           { id: 1,  name: "Atlanta Hawks",           logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/1.png" },
  "boston-celtics":          { id: 2,  name: "Boston Celtics",          logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/2.png" },
  "brooklyn-nets":           { id: 17, name: "Brooklyn Nets",           logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/17.png" },
  "charlotte-hornets":       { id: 30, name: "Charlotte Hornets",       logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/30.png" },
  "chicago-bulls":           { id: 4,  name: "Chicago Bulls",           logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/4.png" },
  "cleveland-cavaliers":     { id: 5,  name: "Cleveland Cavaliers",     logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/5.png" },
  "dallas-mavericks":        { id: 6,  name: "Dallas Mavericks",        logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/6.png" },
  "denver-nuggets":          { id: 7,  name: "Denver Nuggets",          logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/7.png" },
  "detroit-pistons":         { id: 8,  name: "Detroit Pistons",         logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/8.png" },
  "golden-state-warriors":   { id: 9,  name: "Golden State Warriors",   logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/9.png" },
  "houston-rockets":         { id: 10, name: "Houston Rockets",         logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/10.png" },
  "indiana-pacers":          { id: 11, name: "Indiana Pacers",          logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/11.png" },
  "la-clippers":             { id: 12, name: "LA Clippers",             logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/12.png" },
  "los-angeles-lakers":      { id: 13, name: "Los Angeles Lakers",      logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/13.png" },
  "memphis-grizzlies":       { id: 29, name: "Memphis Grizzlies",       logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/29.png" },
  "miami-heat":              { id: 14, name: "Miami Heat",              logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/14.png" },
  "milwaukee-bucks":         { id: 15, name: "Milwaukee Bucks",         logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/15.png" },
  "minnesota-timberwolves":  { id: 16, name: "Minnesota Timberwolves",  logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/16.png" },
  "new-orleans-pelicans":    { id: 3,  name: "New Orleans Pelicans",    logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/3.png" },
  "new-york-knicks":         { id: 18, name: "New York Knicks",         logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/18.png" },
  "oklahoma-city-thunder":   { id: 25, name: "Oklahoma City Thunder",   logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/25.png" },
  "orlando-magic":           { id: 19, name: "Orlando Magic",           logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/19.png" },
  "philadelphia-76ers":      { id: 20, name: "Philadelphia 76ers",      logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/20.png" },
  "phoenix-suns":            { id: 21, name: "Phoenix Suns",            logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/21.png" },
  "portland-trail-blazers":  { id: 22, name: "Portland Trail Blazers",  logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/22.png" },
  "sacramento-kings":        { id: 23, name: "Sacramento Kings",        logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/23.png" },
  "san-antonio-spurs":       { id: 24, name: "San Antonio Spurs",       logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/24.png" },
  "toronto-raptors":         { id: 28, name: "Toronto Raptors",         logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/28.png" },
  "utah-jazz":               { id: 26, name: "Utah Jazz",               logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/26.png" },
  "washington-wizards":      { id: 27, name: "Washington Wizards",      logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/27.png" },
};

export async function getNbaTeamGames(teamSlug: string): Promise<Game[]> {
  const team = NBA_TEAMS[teamSlug];
  if (!team) return [];
  const events = await fetchTeamSchedule("basketball", "nba", team.id);
  return events.map((e) => espnToGame(e, `NBA ${e.season.year}`, "https://www.nba.com/schedule"));
}
