import type { GroupData, BracketRound } from "@/lib/tournament/structure";
import type { GroupPicksData, BracketPicksData } from "@/lib/actions/picks";

const BRACKET_POINTS: Record<string, number> = {
  "round-of-32": 1,
  "round-of-16": 2,
  "quarterfinals": 4,
  "semifinals": 8,
  "3rd-place-match": 4,
  "final": 16,
};

export function scoreGroupPicks(picks: GroupPicksData, groups: GroupData[]): number {
  let score = 0;
  for (const group of groups) {
    const actual = group.standings.map((s) => s.team);
    const predicted = picks[group.letter] ?? [];
    for (let i = 0; i < Math.min(predicted.length, actual.length); i++) {
      if (predicted[i] === actual[i]) score += 1;
    }
  }
  return score;
}

export function scoreBracketPicks(picks: BracketPicksData, bracketRounds: BracketRound[]): number {
  let score = 0;
  for (const round of bracketRounds) {
    const pts = BRACKET_POINTS[round.slug] ?? 0;
    for (const game of round.games) {
      if (!game.completed || game.homeScore == null || game.awayScore == null) continue;
      const h = parseInt(game.homeScore, 10);
      const a = parseInt(game.awayScore, 10);
      if (isNaN(h) || isNaN(a) || h === a) continue;
      const winner = h > a ? game.homeTeam : game.awayTeam;
      if (picks[game.id] === winner) score += pts;
    }
  }
  return score;
}
