"use client";

import { useState, useMemo, useCallback } from "react";
import { saveBracketPicks } from "@/lib/actions/picks";
import type { BracketPicksData } from "@/lib/actions/picks";
import type { BracketRound } from "@/lib/tournament/structure";
import type { SerializedGame } from "@/components/ScheduleTable";

interface Props {
  bracketRounds: BracketRound[];
  initialPicks: BracketPicksData;
  entryId: string;
  unlocked: boolean;
  locked: boolean;
}

const CARD_H = 56;
const SLOT_H = 64;
const CONNECTOR_W = 20;
const HEADER_H = 28; // px reserved for round label above each column

function isTbd(team: string) {
  // Catches "TBD", "Place…", and ESPN placeholders like "Round of 32 3 Winner"
  // or "Semifinal 1 Loser" which contain Winner/Loser anywhere in the string.
  return !team || /^(TBD|Place)/i.test(team) || /\b(Winner|Loser)\b/i.test(team);
}

// Extracts the 1-based bracket position from ESPN placeholder names like
// "Round of 32 3 Winner" → 3, "Quarterfinal 2 Winner" → 2.
function parseFeederIndex(name: string): number | null {
  const m = name.match(/\b(\d+)\s+(?:Winner|Loser)\s*$/i);
  return m ? parseInt(m[1], 10) : null;
}

export function BracketPicksForm({ bracketRounds, initialPicks, entryId, unlocked, locked }: Props) {
  const [picks, setPicks] = useState<BracketPicksData>(initialPicks);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mainRounds = useMemo(
    () => bracketRounds.filter((r) => r.slug !== "3rd-place-match"),
    [bracketRounds]
  );
  const thirdPlaceRound = useMemo(
    () => bracketRounds.find((r) => r.slug === "3rd-place-match"),
    [bracketRounds]
  );

  // feeders[gameId] = [homeFeederGameId, awayFeederGameId]
  // For real ESPN data, team names like "Round of 32 3 Winner" encode the
  // 1-based kickoff-sorted index of the feeder game. For simulation data
  // (plain "TBD" names) we fall back to the positional gi*2 / gi*2+1 pairing.
  const feeders = useMemo(() => {
    const map = new Map<string, [string, string]>();
    for (let ri = 1; ri < mainRounds.length; ri++) {
      const prevGames = mainRounds[ri - 1].games;
      for (let gi = 0; gi < mainRounds[ri].games.length; gi++) {
        const game = mainRounds[ri].games[gi];
        const homeIdx = parseFeederIndex(game.homeTeam);
        const awayIdx = parseFeederIndex(game.awayTeam);
        const hf =
          homeIdx !== null ? prevGames[homeIdx - 1]?.id : prevGames[gi * 2]?.id;
        const af =
          awayIdx !== null ? prevGames[awayIdx - 1]?.id : prevGames[gi * 2 + 1]?.id;
        if (hf && af) map.set(game.id, [hf, af]);
      }
    }
    return map;
  }, [mainRounds]);

  // reverseMap[gameId] = IDs of games in the next round that depend on this game's pick.
  const reverseMap = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const [gid, [hf, af]] of feeders) {
      map.set(hf, [...(map.get(hf) ?? []), gid]);
      map.set(af, [...(map.get(af) ?? []), gid]);
    }
    return map;
  }, [feeders]);

  function getTeam(game: SerializedGame, side: "home" | "away"): string {
    const raw = side === "home" ? game.homeTeam : game.awayTeam;
    if (raw && !isTbd(raw)) return raw;
    const pair = feeders.get(game.id);
    if (!pair) return "TBD";
    const feederId = side === "home" ? pair[0] : pair[1];
    return picks[feederId] ?? "TBD";
  }

  const handlePick = useCallback(
    (gameId: string, team: string) => {
      if (locked || isTbd(team)) return;
      setSaved(false);
      setPicks((prev) => {
        const next = { ...prev, [gameId]: team };
        // BFS to clear all downstream picks that depended on this game.
        const queue = [gameId];
        const seen = new Set<string>();
        while (queue.length) {
          const id = queue.shift()!;
          for (const dep of reverseMap.get(id) ?? []) {
            if (!seen.has(dep)) {
              seen.add(dep);
              delete next[dep];
              queue.push(dep);
            }
          }
        }
        return next;
      });
    },
    [locked, reverseMap]
  );

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await saveBracketPicks(entryId, picks);
      setSaved(true);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!unlocked) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400 py-4">
        Bracket picks unlock after the group stage concludes.
      </p>
    );
  }

  const totalHeight = (mainRounds[0]?.games.length ?? 0) * SLOT_H;

  function renderTeamSlot(game: SerializedGame, side: "home" | "away") {
    const team = getTeam(game, side);
    const tbd = isTbd(team);
    const selected = picks[game.id] === team && !tbd;
    return (
      <button
        key={side}
        type="button"
        onClick={() => handlePick(game.id, team)}
        disabled={locked || tbd}
        style={{ height: CARD_H / 2 }}
        className={`w-full flex items-center px-2.5 text-xs transition-colors ${
          side === "home" ? "border-b border-zinc-100 dark:border-zinc-700/50" : ""
        } ${
          selected
            ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 font-semibold"
            : tbd
            ? "text-zinc-400 dark:text-zinc-600 cursor-default"
            : locked
            ? "text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
            : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 cursor-pointer"
        }`}
      >
        <span className="truncate">{team}</span>
      </button>
    );
  }

  // Build flat list of [connector?, column] elements for each round.
  const columns = mainRounds.flatMap((round, ri) => {
    const slotSize = SLOT_H * Math.pow(2, ri);
    const topOffset = (slotSize - CARD_H) / 2;
    const items = [];

    // SVG connector to the left of this round (except the first).
    if (ri > 0) {
      const prevSlotSize = SLOT_H * Math.pow(2, ri - 1);
      const W = CONNECTOR_W;
      const W2 = W / 2;

      const paths = round.games.map((_, gi) => {
        const y1 = gi * 2 * prevSlotSize + prevSlotSize / 2;
        const y2 = (gi * 2 + 1) * prevSlotSize + prevSlotSize / 2;
        const yMid = gi * slotSize + slotSize / 2;
        return `M 0 ${y1} H ${W2} V ${y2} H 0 M ${W2} ${yMid} H ${W}`;
      });

      items.push(
        <div
          key={`conn-${ri}`}
          className="shrink-0"
          style={{ width: W, marginTop: HEADER_H, height: totalHeight }}
        >
          <svg
            width={W}
            height={totalHeight}
            className="text-zinc-300 dark:text-zinc-600"
          >
            <path
              d={paths.join(" ")}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </svg>
        </div>
      );
    }

    // Round column.
    items.push(
      <div key={round.slug} className="shrink-0 w-44">
        <span className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
          {round.label}
        </span>
        <div className="relative" style={{ height: totalHeight }}>
          {round.games.map((game, gi) => (
            <div
              key={game.id}
              className="absolute left-0 right-0 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden"
              style={{ top: gi * slotSize + topOffset, height: CARD_H }}
            >
              {renderTeamSlot(game, "home")}
              {renderTeamSlot(game, "away")}
            </div>
          ))}
        </div>
      </div>
    );

    return items;
  });

  return (
    <div className="space-y-6">
      <div className="bracket-scroll overflow-x-auto pb-3">
        <div className="flex" style={{ height: totalHeight + HEADER_H + "px" }}>
          {columns}
        </div>
      </div>

      {thirdPlaceRound && thirdPlaceRound.games.length > 0 && (
        <div>
          <span className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
            {thirdPlaceRound.label}
          </span>
          <div
            className="w-44 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden"
            style={{ height: CARD_H }}
          >
            {renderTeamSlot(thirdPlaceRound.games[0], "home")}
            {renderTeamSlot(thirdPlaceRound.games[0], "away")}
          </div>
        </div>
      )}

      {locked ? (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Bracket picks are locked — the knockout stage has started.
        </p>
      ) : (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2.5 text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : "Save picks"}
          </button>
          {saved && <span className="text-sm text-green-600 dark:text-green-400">Saved!</span>}
          {error && <span className="text-sm text-red-600 dark:text-red-400">{error}</span>}
        </div>
      )}
    </div>
  );
}
