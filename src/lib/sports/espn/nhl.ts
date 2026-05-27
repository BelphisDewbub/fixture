import { fetchTeamSchedule, espnToGame } from "./client";
import type { Game } from "@/types";

export const NHL_TEAMS: Record<string, { id: number; name: string; logoUrl: string }> = {
  "anaheim-ducks":         { id: 25,     name: "Anaheim Ducks",         logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/25.png" },
  "boston-bruins":         { id: 1,      name: "Boston Bruins",         logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/1.png" },
  "buffalo-sabres":        { id: 2,      name: "Buffalo Sabres",        logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/2.png" },
  "calgary-flames":        { id: 3,      name: "Calgary Flames",        logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/3.png" },
  "carolina-hurricanes":   { id: 7,      name: "Carolina Hurricanes",   logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/7.png" },
  "chicago-blackhawks":    { id: 4,      name: "Chicago Blackhawks",    logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/4.png" },
  "colorado-avalanche":    { id: 17,     name: "Colorado Avalanche",    logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/17.png" },
  "columbus-blue-jackets": { id: 29,     name: "Columbus Blue Jackets", logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/29.png" },
  "dallas-stars":          { id: 9,      name: "Dallas Stars",          logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/9.png" },
  "detroit-red-wings":     { id: 5,      name: "Detroit Red Wings",     logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/5.png" },
  "edmonton-oilers":       { id: 6,      name: "Edmonton Oilers",       logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/6.png" },
  "florida-panthers":      { id: 26,     name: "Florida Panthers",      logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/26.png" },
  "los-angeles-kings":     { id: 8,      name: "Los Angeles Kings",     logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/8.png" },
  "minnesota-wild":        { id: 30,     name: "Minnesota Wild",        logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/30.png" },
  "montreal-canadiens":    { id: 10,     name: "Montreal Canadiens",    logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/10.png" },
  "nashville-predators":   { id: 27,     name: "Nashville Predators",   logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/27.png" },
  "new-jersey-devils":     { id: 11,     name: "New Jersey Devils",     logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/11.png" },
  "new-york-islanders":    { id: 12,     name: "New York Islanders",    logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/12.png" },
  "new-york-rangers":      { id: 13,     name: "New York Rangers",      logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/13.png" },
  "ottawa-senators":       { id: 14,     name: "Ottawa Senators",       logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/14.png" },
  "philadelphia-flyers":   { id: 15,     name: "Philadelphia Flyers",   logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/15.png" },
  "pittsburgh-penguins":   { id: 16,     name: "Pittsburgh Penguins",   logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/16.png" },
  "san-jose-sharks":       { id: 18,     name: "San Jose Sharks",       logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/18.png" },
  "seattle-kraken":        { id: 124292, name: "Seattle Kraken",        logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/124292.png" },
  "st-louis-blues":        { id: 19,     name: "St. Louis Blues",       logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/19.png" },
  "tampa-bay-lightning":   { id: 20,     name: "Tampa Bay Lightning",   logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/20.png" },
  "toronto-maple-leafs":   { id: 21,     name: "Toronto Maple Leafs",   logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/21.png" },
  "utah-mammoth":          { id: 129764, name: "Utah Mammoth",          logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/129764.png" },
  "vancouver-canucks":     { id: 22,     name: "Vancouver Canucks",     logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/22.png" },
  "vegas-golden-knights":  { id: 37,     name: "Vegas Golden Knights",  logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/37.png" },
  "washington-capitals":   { id: 23,     name: "Washington Capitals",   logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/23.png" },
  "winnipeg-jets":         { id: 28,     name: "Winnipeg Jets",         logoUrl: "https://a.espncdn.com/i/teamlogos/nhl/500/28.png" },
};

export async function getNhlTeamGames(teamSlug: string): Promise<Game[]> {
  const team = NHL_TEAMS[teamSlug];
  if (!team) return [];
  const events = await fetchTeamSchedule("hockey", "nhl", team.id);
  return events.map((e) => espnToGame(e, `NHL ${e.season.year}`, "https://www.nhl.com/schedule"));
}
