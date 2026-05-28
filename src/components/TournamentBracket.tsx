"use client";

import type { BracketRound } from "@/lib/tournament/structure";
import type { SerializedGame } from "./ScheduleTable";

interface Props {
  rounds: BracketRound[];
}

// Must match the actual rendered card height (see MatchupCard below)
const CARD_H = 92;
const BASE_GAP = 8;
const PITCH = CARD_H + BASE_GAP; // vertical distance between card tops in round 0

// Rounds that form the linear bracket tree; consolation matches are shown separately
const MAIN_BRACKET_SLUGS = new Set([
  "round-of-32", "round-of-16", "quarterfinals", "semifinals", "final",
]);

// Y-coordinate of the center of card `i` in round `n` (0-indexed)
function cardCenter(n: number, i: number): number {
  const scale = Math.pow(2, n);
  return (scale - 1) * PITCH / 2 + i * scale * PITCH + CARD_H / 2;
}

function fmtShortDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ESPN uses structured placeholder names for unresolved bracket slots
function isTbd(name: string) {
  return /Winner|Loser|\bPlace\b|^TBD$|^Group\s+[A-Z]|^Round of|^Quarterfinal|^Semifinal/i.test(name.trim());
}

function MatchupCard({ game }: { game: SerializedGame }) {
  const homeGoals = game.homeScore != null ? parseInt(game.homeScore, 10) : null;
  const awayGoals = game.awayScore != null ? parseInt(game.awayScore, 10) : null;
  const homeWon = homeGoals != null && awayGoals != null && homeGoals > awayGoals;
  const awayWon = homeGoals != null && awayGoals != null && awayGoals > homeGoals;

  const nameClass = (tbd: boolean, won: boolean, lost: boolean) =>
    `font-medium leading-tight truncate min-w-0 ${
      tbd  ? "text-zinc-400 italic" :
      won  ? "text-zinc-900 font-semibold" :
      lost ? "text-zinc-400" :
             "text-zinc-700"
    }`;

  return (
    // h-[92px] MUST match CARD_H above
    <div className="h-[92px] rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden text-xs">
      {/* Home team — row height: py-2 (8+8) + text-xs lh 16 + border-b 1 = 33px */}
      <div className={`flex items-center justify-between gap-2 px-3 py-2 border-b border-zinc-100 ${homeWon ? "bg-green-50" : ""}`}>
        <span className={nameClass(isTbd(game.homeTeam), homeWon, awayWon)}>{game.homeTeam}</span>
        {homeGoals != null && (
          <span className={`font-bold tabular-nums shrink-0 ${homeWon ? "text-zinc-900" : "text-zinc-400"}`}>{homeGoals}</span>
        )}
      </div>
      {/* Away team — 33px */}
      <div className={`flex items-center justify-between gap-2 px-3 py-2 border-b border-zinc-100 ${awayWon ? "bg-green-50" : ""}`}>
        <span className={nameClass(isTbd(game.awayTeam), awayWon, homeWon)}>{game.awayTeam}</span>
        {awayGoals != null && (
          <span className={`font-bold tabular-nums shrink-0 ${awayWon ? "text-zinc-900" : "text-zinc-400"}`}>{awayGoals}</span>
        )}
      </div>
      {/* Date — py-1 (4+4) + text 16 = 24px → total 33+33+24+2border = 92px */}
      <div className="px-3 py-1 bg-zinc-50">
        <span className="text-zinc-400">{fmtShortDate(game.kickoff)}</span>
      </div>
    </div>
  );
}

// SVG connector column between rounds N and N+1
// Draws the classic bracket ─┐ shape for each pair of source games
function RoundConnector({ n, gamesInNextRound, columnHeight }: {
  n: number;
  gamesInNextRound: number;
  columnHeight: number;
}) {
  const W = 20; // connector width in px
  const midX = W / 2;

  return (
    <svg
      width={W}
      height={columnHeight}
      className="shrink-0"
      style={{ overflow: "visible" }}
    >
      {Array.from({ length: gamesInNextRound }, (_, j) => {
        const yTop = cardCenter(n, 2 * j);
        const yBot = cardCenter(n, 2 * j + 1);
        const yMid = (yTop + yBot) / 2;
        return (
          <g key={j} stroke="#d4d4d8" strokeWidth="1.5" fill="none">
            <line x1={0}    y1={yTop} x2={midX} y2={yTop} />
            <line x1={midX} y1={yTop} x2={midX} y2={yBot} />
            <line x1={0}    y1={yBot} x2={midX} y2={yBot} />
            <line x1={midX} y1={yMid} x2={W}    y2={yMid} />
          </g>
        );
      })}
    </svg>
  );
}

function MobileBracket({ rounds }: { rounds: BracketRound[] }) {
  return (
    <div className="space-y-8">
      {rounds.map((round) => (
        <section key={round.slug}>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
            {round.label}
          </h3>
          <div className="space-y-2">
            {round.games.map((g) => (
              <MatchupCard key={g.id} game={g} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function DesktopBracket({ mainRounds, sideRounds }: {
  mainRounds: BracketRound[];
  sideRounds: BracketRound[];
}) {
  if (mainRounds.length === 0) return null;

  const firstCount = mainRounds[0].games.length;
  // Total pixel height of the round-0 column
  const columnHeight = firstCount * CARD_H + (firstCount - 1) * BASE_GAP;

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto pb-2">
        <div className="flex items-start" style={{ height: columnHeight }}>
          {mainRounds.map((round, n) => {
            const scale = Math.pow(2, n);
            const gap = scale * PITCH - CARD_H;
            const paddingTop = (scale - 1) * PITCH / 2;
            const isLast = n === mainRounds.length - 1;

            return (
              <div key={round.slug} className="flex items-start shrink-0">
                {/* Round column */}
                <div className="flex flex-col shrink-0" style={{ width: 144 }}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2 text-center">
                    {round.label}
                  </p>
                  <div className="flex flex-col" style={{ gap, paddingTop }}>
                    {round.games.map((g) => (
                      <MatchupCard key={g.id} game={g} />
                    ))}
                  </div>
                </div>

                {/* Connector to next round */}
                {!isLast && (
                  <div className="flex flex-col shrink-0" style={{ paddingTop: 24 /* label height */ }}>
                    <RoundConnector
                      n={n}
                      gamesInNextRound={mainRounds[n + 1].games.length}
                      columnHeight={columnHeight}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Consolation matches (3rd place, etc.) below the main bracket */}
      {sideRounds.length > 0 && (
        <div className="border-t border-zinc-100 pt-5 space-y-4">
          {sideRounds.map((round) => (
            <div key={round.slug}>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
                {round.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {round.games.map((g) => (
                  <div key={g.id} style={{ width: 144 }}>
                    <MatchupCard game={g} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TournamentBracket({ rounds }: Props) {
  if (rounds.length === 0) {
    return (
      <p className="text-sm text-zinc-400 text-center py-12">
        Bracket not yet available.
      </p>
    );
  }

  const mainRounds = rounds.filter((r) => MAIN_BRACKET_SLUGS.has(r.slug));
  const sideRounds = rounds.filter((r) => !MAIN_BRACKET_SLUGS.has(r.slug));

  return (
    <>
      <div className="md:hidden">
        <MobileBracket rounds={rounds} />
      </div>
      <div className="hidden md:block">
        <DesktopBracket mainRounds={mainRounds} sideRounds={sideRounds} />
      </div>
    </>
  );
}
