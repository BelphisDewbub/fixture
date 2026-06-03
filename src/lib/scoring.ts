import type { GroupData, BracketRound } from "@/lib/tournament/structure";
import type { GroupPicksData, BracketPicksData } from "@/lib/actions/picks";
import { type ChallengeWeights, DEFAULT_WEIGHTS } from "@/lib/weights";

export function scoreGroupPicks(
  picks: GroupPicksData,
  groups: GroupData[],
  weights: ChallengeWeights = DEFAULT_WEIGHTS,
): number {
  let score = 0;
  for (const group of groups) {
    const actual = group.standings.map((s) => s.team);
    const predicted = picks[group.letter] ?? [];
    for (let i = 0; i < Math.min(predicted.length, actual.length); i++) {
      if (predicted[i] === actual[i]) score += weights.groupStage;
    }
  }
  return score;
}

export function scoreBracketPicks(
  picks: BracketPicksData,
  bracketRounds: BracketRound[],
  weights: ChallengeWeights = DEFAULT_WEIGHTS,
): number {
  let score = 0;
  for (const round of bracketRounds) {
    const pts = weights[round.slug as keyof ChallengeWeights] ?? 0;
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
