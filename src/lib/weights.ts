export type ChallengeWeights = {
  groupStage: number;
  "round-of-32": number;
  "round-of-16": number;
  quarterfinals: number;
  semifinals: number;
  "3rd-place-match": number;
  final: number;
};

export const DEFAULT_WEIGHTS: ChallengeWeights = {
  groupStage: 1,
  "round-of-32": 1,
  "round-of-16": 2,
  quarterfinals: 4,
  semifinals: 8,
  "3rd-place-match": 4,
  final: 16,
};

export const WEIGHT_LABELS: Record<keyof ChallengeWeights, string> = {
  groupStage: "Group Stage (per correct position)",
  "round-of-32": "Round of 32",
  "round-of-16": "Round of 16",
  quarterfinals: "Quarter-Finals",
  semifinals: "Semi-Finals",
  "3rd-place-match": "3rd Place",
  final: "Final",
};

export function resolveWeights(raw: unknown): ChallengeWeights {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return DEFAULT_WEIGHTS;
  return { ...DEFAULT_WEIGHTS, ...(raw as Partial<ChallengeWeights>) };
}
