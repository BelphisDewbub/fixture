import type { SerializedGame } from "@/components/ScheduleTable";

// Stages that belong to the group/round-robin phase
const GROUP_STAGES = new Set(["group-stage"]);

// Ordered knockout round slugs, earliest to latest
export const KNOCKOUT_ROUND_ORDER = [
  "round-of-32",
  "round-of-16",
  "quarterfinals",
  "semifinals",
  "3rd-place-match",
  "final",
] as const;

export type KnockoutRoundSlug = (typeof KNOCKOUT_ROUND_ORDER)[number];

export const KNOCKOUT_ROUND_LABELS: Record<string, string> = {
  "round-of-32":     "Round of 32",
  "round-of-16":     "Round of 16",
  "quarterfinals":   "Quarter-Finals",
  "semifinals":      "Semi-Finals",
  "3rd-place-match": "3rd Place",
  "final":           "Final",
};

export interface StandingsRow {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
}

export interface GroupData {
  letter: string;
  games: SerializedGame[];
  standings: StandingsRow[];
}

export interface BracketRound {
  slug: string;
  label: string;
  games: SerializedGame[];
}

export interface TournamentStructure {
  hasGroups: boolean;
  hasBracket: boolean;
  groups: GroupData[];
  bracketRounds: BracketRound[];
}

function computeStandings(games: SerializedGame[]): StandingsRow[] {
  const rows = new Map<string, StandingsRow>();

  const ensureRow = (team: string) => {
    if (!rows.has(team)) {
      rows.set(team, { team, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 });
    }
    return rows.get(team)!;
  };

  for (const g of games) {
    if (!g.completed || g.homeScore == null || g.awayScore == null) continue;
    const hg = parseInt(g.homeScore, 10);
    const ag = parseInt(g.awayScore, 10);
    if (isNaN(hg) || isNaN(ag)) continue;

    const home = ensureRow(g.homeTeam);
    const away = ensureRow(g.awayTeam);

    home.played++; home.gf += hg; home.ga += ag;
    away.played++; away.gf += ag; away.ga += hg;

    if (hg > ag) {
      home.won++; home.pts += 3;
      away.lost++;
    } else if (hg < ag) {
      away.won++; away.pts += 3;
      home.lost++;
    } else {
      home.drawn++; home.pts++;
      away.drawn++; away.pts++;
    }
  }

  // Ensure all teams appear in standings even with no results yet
  for (const g of games) {
    ensureRow(g.homeTeam);
    ensureRow(g.awayTeam);
  }

  return Array.from(rows.values())
    .filter((r) => !/^(TBD|Winner|Loser|Place)/i.test(r.team))
    .sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      const gdDiff = (b.gf - b.ga) - (a.gf - a.ga);
      if (gdDiff !== 0) return gdDiff;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return a.team.localeCompare(b.team);
    })
    .map((r) => ({ ...r, gd: r.gf - r.ga }));
}

export function buildTournamentStructure(games: SerializedGame[]): TournamentStructure {
  const groupGames = games.filter((g) => g.stage && GROUP_STAGES.has(g.stage));
  const knockoutGames = games.filter((g) => g.stage && KNOCKOUT_ROUND_ORDER.includes(g.stage as KnockoutRoundSlug));

  // Build group data
  const groupMap = new Map<string, SerializedGame[]>();
  for (const g of groupGames) {
    const letter = g.group ?? "?";
    const existing = groupMap.get(letter) ?? [];
    existing.push(g);
    groupMap.set(letter, existing);
  }

  const groups: GroupData[] = Array.from(groupMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, gs]) => ({
      letter,
      games: gs.sort((a, b) => a.kickoff.localeCompare(b.kickoff)),
      standings: computeStandings(gs),
    }));

  // Build bracket rounds in canonical order
  const roundMap = new Map<string, SerializedGame[]>();
  for (const g of knockoutGames) {
    const slug = g.stage!;
    const existing = roundMap.get(slug) ?? [];
    existing.push(g);
    roundMap.set(slug, existing);
  }

  const bracketRounds: BracketRound[] = KNOCKOUT_ROUND_ORDER
    .filter((slug) => roundMap.has(slug))
    .map((slug) => ({
      slug,
      label: KNOCKOUT_ROUND_LABELS[slug],
      games: (roundMap.get(slug) ?? []).sort((a, b) => {
        // ESPN's "Round of 32 N Winner" labels use ID-ascending order, not kickoff order.
        // Fall back to kickoff sort for simulation data (non-numeric IDs).
        const aNum = parseInt(a.id);
        const bNum = parseInt(b.id);
        if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
        return a.kickoff.localeCompare(b.kickoff);
      }),
    }));

  return {
    hasGroups: groups.length > 0,
    hasBracket: bracketRounds.length > 0,
    groups,
    bracketRounds,
  };
}
