import { fetchTeamSchedule, espnToGame } from "./client";
import type { Game } from "@/types";

export const MLS_TEAMS: Record<string, { id: number; name: string; logoUrl: string }> = {
  "atlanta-united":         { id: 18418, name: "Atlanta United FC",      logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/18418.png" },
  "austin-fc":              { id: 20906, name: "Austin FC",               logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/20906.png" },
  "cf-montreal":            { id: 9720,  name: "CF Montréal",             logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/9720.png" },
  "charlotte-fc":           { id: 21300, name: "Charlotte FC",            logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/21300.png" },
  "chicago-fire":           { id: 182,   name: "Chicago Fire FC",         logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/182.png" },
  "colorado-rapids":        { id: 184,   name: "Colorado Rapids",         logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/184.png" },
  "columbus-crew":          { id: 183,   name: "Columbus Crew",           logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/183.png" },
  "dc-united":              { id: 193,   name: "D.C. United",             logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/193.png" },
  "fc-cincinnati":          { id: 18267, name: "FC Cincinnati",           logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/18267.png" },
  "fc-dallas":              { id: 185,   name: "FC Dallas",               logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/185.png" },
  "houston-dynamo":         { id: 6077,  name: "Houston Dynamo FC",       logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/6077.png" },
  "inter-miami":            { id: 20232, name: "Inter Miami CF",          logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/20232.png" },
  "la-galaxy":              { id: 187,   name: "LA Galaxy",               logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/187.png" },
  "lafc":                   { id: 18966, name: "LAFC",                    logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/18966.png" },
  "minnesota-united":       { id: 17362, name: "Minnesota United FC",     logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/17362.png" },
  "nashville-sc":           { id: 18986, name: "Nashville SC",            logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/18986.png" },
  "new-england-revolution": { id: 189,   name: "New England Revolution",  logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/189.png" },
  "new-york-city":          { id: 17606, name: "New York City FC",        logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/17606.png" },
  "new-york-red-bulls":     { id: 190,   name: "New York Red Bulls",      logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/190.png" },
  "orlando-city":           { id: 12011, name: "Orlando City SC",         logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/12011.png" },
  "philadelphia-union":     { id: 10739, name: "Philadelphia Union",      logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/10739.png" },
  "portland-timbers":       { id: 9723,  name: "Portland Timbers",        logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/9723.png" },
  "real-salt-lake":         { id: 4771,  name: "Real Salt Lake",          logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/4771.png" },
  "san-diego-fc":           { id: 22529, name: "San Diego FC",            logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/22529.png" },
  "san-jose-earthquakes":   { id: 191,   name: "San Jose Earthquakes",    logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/191.png" },
  "seattle-sounders":       { id: 9726,  name: "Seattle Sounders FC",     logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/9726.png" },
  "sporting-kansas-city":   { id: 186,   name: "Sporting Kansas City",    logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/186.png" },
  "st-louis-city":          { id: 21812, name: "St. Louis CITY SC",       logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/21812.png" },
  "toronto-fc":             { id: 7318,  name: "Toronto FC",              logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/7318.png" },
  "vancouver-whitecaps":    { id: 9727,  name: "Vancouver Whitecaps FC",  logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/9727.png" },
};

export async function getMlsTeamGames(teamSlug: string): Promise<Game[]> {
  const team = MLS_TEAMS[teamSlug];
  if (!team) return [];
  const events = await fetchTeamSchedule("soccer", "usa.1", team.id);
  return events.map((e) => espnToGame(e, `MLS ${e.season.year}`, "https://www.mlssoccer.com/schedule"));
}
