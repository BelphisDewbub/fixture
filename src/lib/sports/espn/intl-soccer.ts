import { fetchTeamSchedule, fetchLiveForTeam, espnToGame, type ESPNEvent } from "./client";
import { getWorldCupGames } from "./world-cup";
import type { Game } from "@/types";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface NationalTeamDef {
  id: number;
  name: string;
  logoUrl: string;
  /** ESPN league codes to query for this team's schedule */
  competitions: string[];
  /** Slug as it appears when ESPN renders the team name in World Cup data */
  worldCupSlug: string;
}

const LOGO = (id: number) => `https://a.espncdn.com/i/teamlogos/soccer/500/${id}.png`;

// Competition buckets
const CONCACAF = ["concacaf.gold", "concacaf.nations.league"];
const UEFA     = ["uefa.nations", "uefa.euro"];
const CONMEBOL = ["conmebol.america"];

export const INTL_SOCCER_TEAMS: Record<string, NationalTeamDef> = {
  // ── CONCACAF ──────────────────────────────────────────────────────────────
  "usmnt":       { id: 660,  name: "USMNT",       logoUrl: LOGO(660),  competitions: CONCACAF, worldCupSlug: "united-states" },
  "mexico":      { id: 203,  name: "Mexico",      logoUrl: LOGO(203),  competitions: CONCACAF, worldCupSlug: "mexico" },
  "canada":      { id: 206,  name: "Canada",      logoUrl: LOGO(206),  competitions: CONCACAF, worldCupSlug: "canada" },
  "costa-rica":  { id: 214,  name: "Costa Rica",  logoUrl: LOGO(214),  competitions: CONCACAF, worldCupSlug: "costa-rica" },
  "jamaica":     { id: 1038, name: "Jamaica",     logoUrl: LOGO(1038), competitions: CONCACAF, worldCupSlug: "jamaica" },
  "panama":      { id: 2659, name: "Panama",      logoUrl: LOGO(2659), competitions: CONCACAF, worldCupSlug: "panama" },
  "honduras":    { id: 215,  name: "Honduras",    logoUrl: LOGO(215),  competitions: CONCACAF, worldCupSlug: "honduras" },
  // ── UEFA ──────────────────────────────────────────────────────────────────
  "england":     { id: 448,  name: "England",     logoUrl: LOGO(448),  competitions: UEFA, worldCupSlug: "england" },
  "france":      { id: 478,  name: "France",      logoUrl: LOGO(478),  competitions: UEFA, worldCupSlug: "france" },
  "germany":     { id: 481,  name: "Germany",     logoUrl: LOGO(481),  competitions: UEFA, worldCupSlug: "germany" },
  "spain":       { id: 164,  name: "Spain",       logoUrl: LOGO(164),  competitions: UEFA, worldCupSlug: "spain" },
  "portugal":    { id: 482,  name: "Portugal",    logoUrl: LOGO(482),  competitions: UEFA, worldCupSlug: "portugal" },
  "italy":       { id: 162,  name: "Italy",       logoUrl: LOGO(162),  competitions: UEFA, worldCupSlug: "italy" },
  "netherlands": { id: 449,  name: "Netherlands", logoUrl: LOGO(449),  competitions: UEFA, worldCupSlug: "netherlands" },
  // ── CONMEBOL ──────────────────────────────────────────────────────────────
  "brazil":      { id: 205,  name: "Brazil",      logoUrl: LOGO(205),  competitions: CONMEBOL, worldCupSlug: "brazil" },
  "argentina":   { id: 202,  name: "Argentina",   logoUrl: LOGO(202),  competitions: CONMEBOL, worldCupSlug: "argentina" },
  "colombia":    { id: 208,  name: "Colombia",    logoUrl: LOGO(208),  competitions: CONMEBOL, worldCupSlug: "colombia" },
  "uruguay":     { id: 212,  name: "Uruguay",     logoUrl: LOGO(212),  competitions: CONMEBOL, worldCupSlug: "uruguay" },
};

export async function getIntlSoccerGames(teamSlug: string): Promise<Game[]> {
  const team = INTL_SOCCER_TEAMS[teamSlug];
  if (!team) return [];

  const settled = await Promise.allSettled([
    ...team.competitions.map(async (league) => {
      const events = await fetchTeamSchedule("soccer", league, team.id);
      return events.map((e) => espnToGame(e, e.season.displayName ?? league));
    }),
    getWorldCupGames().then((games) =>
      games.filter(
        (g) =>
          slugify(g.homeTeam) === team.worldCupSlug ||
          slugify(g.awayTeam) === team.worldCupSlug
      )
    ),
  ]);

  const seen = new Set<string>();
  const games: Game[] = [];

  for (const result of settled) {
    if (result.status === "fulfilled") {
      for (const game of result.value) {
        if (!seen.has(game.id)) {
          seen.add(game.id);
          games.push(game);
        }
      }
    }
  }

  return games.sort((a, b) => a.kickoff.getTime() - b.kickoff.getTime());
}

export async function getLiveIntlSoccerGame(teamSlug: string): Promise<ESPNEvent | null> {
  const team = INTL_SOCCER_TEAMS[teamSlug];
  if (!team) return null;

  const checks = await Promise.allSettled(
    team.competitions.map((league) => fetchLiveForTeam("soccer", league, team.id))
  );

  for (const result of checks) {
    if (result.status === "fulfilled" && result.value) return result.value;
  }
  return null;
}
