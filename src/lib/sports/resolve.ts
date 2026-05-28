import { INTL_SOCCER_TEAMS } from "./espn/intl-soccer";
import { MLB_TEAMS } from "./espn/mlb";
import { NFL_TEAMS } from "./espn/nfl";
import { NBA_TEAMS } from "./espn/nba";
import { NHL_TEAMS } from "./espn/nhl";
import { MLS_TEAMS } from "./espn/mls";
import { EPL_TEAMS } from "./espn/premier-league";
import { WNBA_TEAMS } from "./espn/wnba";
import { NCAAF_TEAMS } from "./espn/ncaa-football";
import { NCAAB_TEAMS } from "./espn/ncaa-basketball";

export const ACTIVE_STATUSES = new Set([
  "STATUS_IN_PROGRESS",
  "STATUS_HALFTIME",
  "STATUS_END_PERIOD",
  "STATUS_OVERTIME",
]);

export interface ResolvedTeam {
  id: number;
  name: string;
  logoUrl: string;
  prefix: string;
  teamSlug: string;
  espnSport: string;
  /** Empty string signals a multi-competition team — skip single-league live detection */
  espnLeague: string;
}

const STATIC_TEAM_MAP: Record<string, ResolvedTeam> = Object.fromEntries(
  Object.entries(INTL_SOCCER_TEAMS).map(([slug, t]) => [
    `intl-soccer-${slug}`,
    {
      id: t.id,
      name: t.name,
      logoUrl: t.logoUrl,
      prefix: "intl-soccer",
      teamSlug: slug,
      espnSport: "soccer",
      espnLeague: "",
    },
  ])
);

const PREFIX_MAP: Record<
  string,
  {
    teams: Record<string, { id: number; name: string; logoUrl: string }>;
    espnSport: string;
    espnLeague: string;
  }
> = {
  mlb:   { teams: MLB_TEAMS,   espnSport: "baseball",    espnLeague: "mlb" },
  nfl:   { teams: NFL_TEAMS,   espnSport: "football",    espnLeague: "nfl" },
  nba:   { teams: NBA_TEAMS,   espnSport: "basketball",  espnLeague: "nba" },
  nhl:   { teams: NHL_TEAMS,   espnSport: "hockey",      espnLeague: "nhl" },
  mls:   { teams: MLS_TEAMS,   espnSport: "soccer",      espnLeague: "usa.1" },
  epl:   { teams: EPL_TEAMS,   espnSport: "soccer",      espnLeague: "eng.1" },
  wnba:  { teams: WNBA_TEAMS,  espnSport: "basketball",  espnLeague: "wnba" },
  ncaaf: { teams: NCAAF_TEAMS, espnSport: "football",    espnLeague: "college-football" },
  ncaab: { teams: NCAAB_TEAMS, espnSport: "basketball",  espnLeague: "mens-college-basketball" },
};

export function resolveTeamSlug(fullSlug: string): ResolvedTeam | null {
  if (STATIC_TEAM_MAP[fullSlug]) return STATIC_TEAM_MAP[fullSlug];

  const dashIdx = fullSlug.indexOf("-");
  if (dashIdx === -1) return null;

  const prefix = fullSlug.slice(0, dashIdx);
  const teamSlug = fullSlug.slice(dashIdx + 1);
  const entry = PREFIX_MAP[prefix];
  if (!entry) return null;

  const team = entry.teams[teamSlug];
  if (!team) return null;

  return {
    id: team.id,
    name: team.name,
    logoUrl: team.logoUrl,
    prefix,
    teamSlug,
    espnSport: entry.espnSport,
    espnLeague: entry.espnLeague,
  };
}
