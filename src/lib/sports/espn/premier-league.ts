import { fetchTeamSchedule, espnToGame } from "./client";
import type { Game } from "@/types";

export const EPL_TEAMS: Record<string, { id: number; name: string; logoUrl: string }> = {
  "afc-bournemouth":    { id: 349, name: "AFC Bournemouth",        logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/349.png" },
  "arsenal":            { id: 359, name: "Arsenal",                logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/359.png" },
  "aston-villa":        { id: 362, name: "Aston Villa",            logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/362.png" },
  "brentford":          { id: 337, name: "Brentford",              logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/337.png" },
  "brighton":           { id: 331, name: "Brighton & Hove Albion", logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/331.png" },
  "burnley":            { id: 379, name: "Burnley",                logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/379.png" },
  "chelsea":            { id: 363, name: "Chelsea",                logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/363.png" },
  "crystal-palace":     { id: 384, name: "Crystal Palace",         logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/384.png" },
  "everton":            { id: 368, name: "Everton",                logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/368.png" },
  "fulham":             { id: 370, name: "Fulham",                 logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/370.png" },
  "leeds-united":       { id: 357, name: "Leeds United",           logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/357.png" },
  "liverpool":          { id: 364, name: "Liverpool",              logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/364.png" },
  "manchester-city":    { id: 382, name: "Manchester City",        logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/382.png" },
  "manchester-united":  { id: 360, name: "Manchester United",      logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/360.png" },
  "newcastle-united":   { id: 361, name: "Newcastle United",       logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/361.png" },
  "nottingham-forest":  { id: 393, name: "Nottingham Forest",      logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/393.png" },
  "sunderland":         { id: 366, name: "Sunderland",             logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/366.png" },
  "tottenham-hotspur":  { id: 367, name: "Tottenham Hotspur",      logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/367.png" },
  "west-ham-united":    { id: 371, name: "West Ham United",        logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/371.png" },
  "wolverhampton":      { id: 380, name: "Wolverhampton Wanderers",logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/380.png" },
};

export async function getEplTeamGames(teamSlug: string): Promise<Game[]> {
  const team = EPL_TEAMS[teamSlug];
  if (!team) return [];
  const events = await fetchTeamSchedule("soccer", "eng.1", team.id);
  return events.map((e) => espnToGame(e, `Premier League ${e.season.year}`, "https://www.premierleague.com/fixtures"));
}
