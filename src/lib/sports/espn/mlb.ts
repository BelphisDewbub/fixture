import { fetchTeamSchedule, espnToGame } from "./client";
import type { Game } from "@/types";

export const MLB_TEAMS: Record<string, { id: number; name: string; logoUrl: string }> = {
  "arizona-diamondbacks":  { id: 29, name: "Arizona Diamondbacks",  logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/29.png" },
  "athletics":             { id: 11, name: "Athletics",              logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/11.png" },
  "atlanta-braves":        { id: 15, name: "Atlanta Braves",         logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/15.png" },
  "baltimore-orioles":     { id: 1,  name: "Baltimore Orioles",      logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/1.png" },
  "boston-red-sox":        { id: 2,  name: "Boston Red Sox",         logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/2.png" },
  "chicago-cubs":          { id: 16, name: "Chicago Cubs",           logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/16.png" },
  "chicago-white-sox":     { id: 4,  name: "Chicago White Sox",      logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/4.png" },
  "cincinnati-reds":       { id: 17, name: "Cincinnati Reds",        logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/17.png" },
  "cleveland-guardians":   { id: 5,  name: "Cleveland Guardians",    logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/5.png" },
  "colorado-rockies":      { id: 27, name: "Colorado Rockies",       logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/27.png" },
  "detroit-tigers":        { id: 6,  name: "Detroit Tigers",         logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/6.png" },
  "houston-astros":        { id: 18, name: "Houston Astros",         logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/18.png" },
  "kansas-city-royals":    { id: 7,  name: "Kansas City Royals",     logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/7.png" },
  "los-angeles-angels":    { id: 3,  name: "Los Angeles Angels",     logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/3.png" },
  "los-angeles-dodgers":   { id: 19, name: "Los Angeles Dodgers",    logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/19.png" },
  "miami-marlins":         { id: 28, name: "Miami Marlins",          logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/28.png" },
  "milwaukee-brewers":     { id: 8,  name: "Milwaukee Brewers",      logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/8.png" },
  "minnesota-twins":       { id: 9,  name: "Minnesota Twins",        logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/9.png" },
  "new-york-mets":         { id: 21, name: "New York Mets",          logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/21.png" },
  "new-york-yankees":      { id: 10, name: "New York Yankees",       logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/10.png" },
  "philadelphia-phillies": { id: 22, name: "Philadelphia Phillies",  logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/22.png" },
  "pittsburgh-pirates":    { id: 23, name: "Pittsburgh Pirates",     logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/23.png" },
  "san-diego-padres":      { id: 25, name: "San Diego Padres",       logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/25.png" },
  "san-francisco-giants":  { id: 26, name: "San Francisco Giants",   logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/26.png" },
  "seattle-mariners":      { id: 12, name: "Seattle Mariners",       logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/12.png" },
  "st-louis-cardinals":    { id: 24, name: "St. Louis Cardinals",    logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/24.png" },
  "tampa-bay-rays":        { id: 30, name: "Tampa Bay Rays",         logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/30.png" },
  "texas-rangers":         { id: 13, name: "Texas Rangers",          logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/13.png" },
  "toronto-blue-jays":     { id: 14, name: "Toronto Blue Jays",      logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/14.png" },
  "washington-nationals":  { id: 20, name: "Washington Nationals",   logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/20.png" },
};

export async function getMlbTeamGames(teamSlug: string): Promise<Game[]> {
  const team = MLB_TEAMS[teamSlug];
  if (!team) return [];
  const events = await fetchTeamSchedule("baseball", "mlb", team.id);
  return events.map((e) => espnToGame(e, `MLB ${e.season.year}`, "https://www.mlb.com/schedule"));
}
