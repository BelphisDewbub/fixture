"use client";

import { useState } from "react";
import type { BroadcastInfo } from "@/types";

export interface SerializedGame {
  id: string;
  homeTeam: string;
  awayTeam: string;
  kickoff: string; // ISO 8601
  venue?: string;
  competition: string;
  broadcastInfo?: BroadcastInfo;
}

interface Props {
  games: SerializedGame[];
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function GameRow({ game, muted }: { game: SerializedGame; muted?: boolean }) {
  const broadcasts = [
    ...(game.broadcastInfo?.networks ?? []),
    ...(game.broadcastInfo?.streamingServices ?? []),
  ].join(", ");

  return (
    <tr
      className={`border-b border-zinc-100 last:border-0 transition-opacity ${
        muted ? "opacity-40" : ""
      }`}
    >
      <td className="py-3 px-4">
        <p className="text-sm font-medium text-zinc-800">
          {game.awayTeam}{" "}
          <span className="text-zinc-400 font-normal text-xs">at</span>{" "}
          {game.homeTeam}
        </p>
        {game.venue && (
          <p className="text-xs text-zinc-400 mt-0.5">{game.venue}</p>
        )}
      </td>
      <td className="py-3 px-4 text-right whitespace-nowrap">
        <p className="text-sm text-zinc-700">{fmtDate(game.kickoff)}</p>
        <p className="text-xs text-zinc-400">{fmtTime(game.kickoff)}</p>
      </td>
      <td className="py-3 px-4 hidden sm:table-cell text-right">
        {broadcasts && (
          <span className="text-xs text-zinc-400">{broadcasts}</span>
        )}
      </td>
    </tr>
  );
}

export function ScheduleTable({ games }: Props) {
  const [showAllPast, setShowAllPast] = useState(false);

  const now = new Date().toISOString();
  const upcoming = [...games]
    .filter((g) => g.kickoff >= now)
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff));
  const past = [...games]
    .filter((g) => g.kickoff < now)
    .sort((a, b) => b.kickoff.localeCompare(a.kickoff));

  const visiblePast = showAllPast ? past : past.slice(0, 5);

  if (upcoming.length === 0 && past.length === 0) {
    return (
      <p className="text-sm text-zinc-400 text-center py-12">
        No games scheduled.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {upcoming.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
            Upcoming
          </h3>
          <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <tbody>
                {upcoming.map((g) => (
                  <GameRow key={g.id} game={g} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
            Past
          </h3>
          <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <tbody>
                {visiblePast.map((g) => (
                  <GameRow key={g.id} game={g} muted />
                ))}
              </tbody>
            </table>
          </div>
          {past.length > 5 && !showAllPast && (
            <button
              onClick={() => setShowAllPast(true)}
              className="mt-3 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              Show {past.length - 5} more past{" "}
              {past.length - 5 === 1 ? "game" : "games"}
            </button>
          )}
        </section>
      )}
    </div>
  );
}
