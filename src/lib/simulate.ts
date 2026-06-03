import type { SerializedGame } from "@/components/ScheduleTable";
import type { GroupData, BracketRound } from "@/lib/tournament/structure";

const FAKE_SCORES: [string, string][] = [
  ["2", "1"], ["1", "0"], ["3", "1"], ["0", "0"],
  ["2", "0"], ["1", "1"], ["4", "2"], ["0", "1"],
  ["3", "0"], ["1", "2"], ["2", "2"], ["0", "1"],
];

// Mark all incomplete group-stage games as finished with deterministic fake scores.
export function simulateGroupStage(games: SerializedGame[]): SerializedGame[] {
  let i = 0;
  return games.map((game) => {
    if (game.stage !== "group-stage" || game.completed) return game;
    const [h, a] = FAKE_SCORES[i++ % FAKE_SCORES.length];
    return { ...game, completed: true, homeScore: h, awayScore: a };
  });
}

// Build a complete simulated bracket: R32 (real teams) → R16 → QF → SF → 3rd/Final (all TBD).
export function simulateAllBracketRounds(groups: GroupData[]): BracketRound[] {
  const baseMs = new Date("2026-07-04T14:00:00Z").getTime();
  const DAY = 24 * 60 * 60 * 1000;
  const THREE_H = 3 * 60 * 60 * 1000;

  // Collect 32 qualified teams: top 2 from each group + 8 best 3rd-place finishers.
  const top2: string[] = [];
  const thirds: GroupData["standings"][number][] = [];
  for (const g of groups) {
    if (g.standings[0]) top2.push(g.standings[0].team);
    if (g.standings[1]) top2.push(g.standings[1].team);
    if (g.standings[2]) thirds.push(g.standings[2]);
  }
  thirds.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.team.localeCompare(b.team);
  });
  const qualified = [...top2, ...thirds.slice(0, 8).map((s) => s.team)];
  while (qualified.length < 32) qualified.push("TBD");

  // Round of 32: 16 games with real teams.
  const r32: SerializedGame[] = Array.from({ length: 16 }, (_, i) => ({
    id: `sim-r32-${i}`,
    homeTeam: qualified[i * 2],
    awayTeam: qualified[i * 2 + 1],
    competition: "FIFA World Cup 2026",
    stage: "round-of-32",
    kickoff: new Date(baseMs + i * THREE_H).toISOString(),
  }));

  // Round of 16: 8 games — teams fed by R32 picks.
  const r16: SerializedGame[] = Array.from({ length: 8 }, (_, i) => ({
    id: `sim-r16-${i}`,
    homeTeam: "TBD",
    awayTeam: "TBD",
    competition: "FIFA World Cup 2026",
    stage: "round-of-16",
    kickoff: new Date(baseMs + DAY * 5 + i * THREE_H).toISOString(),
  }));

  // Quarterfinals: 4 games.
  const qf: SerializedGame[] = Array.from({ length: 4 }, (_, i) => ({
    id: `sim-qf-${i}`,
    homeTeam: "TBD",
    awayTeam: "TBD",
    competition: "FIFA World Cup 2026",
    stage: "quarterfinals",
    kickoff: new Date(baseMs + DAY * 10 + i * THREE_H).toISOString(),
  }));

  // Semifinals: 2 games.
  const sf: SerializedGame[] = Array.from({ length: 2 }, (_, i) => ({
    id: `sim-sf-${i}`,
    homeTeam: "TBD",
    awayTeam: "TBD",
    competition: "FIFA World Cup 2026",
    stage: "semifinals",
    kickoff: new Date(baseMs + DAY * 14 + i * THREE_H).toISOString(),
  }));

  // 3rd-place match and Final.
  const thirdPlace: SerializedGame = {
    id: "sim-3rd",
    homeTeam: "TBD",
    awayTeam: "TBD",
    competition: "FIFA World Cup 2026",
    stage: "3rd-place-match",
    kickoff: new Date(baseMs + DAY * 18).toISOString(),
  };

  const final: SerializedGame = {
    id: "sim-final",
    homeTeam: "TBD",
    awayTeam: "TBD",
    competition: "FIFA World Cup 2026",
    stage: "final",
    kickoff: new Date(baseMs + DAY * 19).toISOString(),
  };

  return [
    { slug: "round-of-32", label: "Round of 32", games: r32 },
    { slug: "round-of-16", label: "Round of 16", games: r16 },
    { slug: "quarterfinals", label: "Quarter-Finals", games: qf },
    { slug: "semifinals", label: "Semi-Finals", games: sf },
    { slug: "3rd-place-match", label: "3rd Place", games: [thirdPlace] },
    { slug: "final", label: "Final", games: [final] },
  ];
}
