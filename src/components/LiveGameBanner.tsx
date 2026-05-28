"use client";

import { useState, useEffect, useCallback } from "react";

export interface LiveGame {
  homeTeam: string;
  awayTeam: string;
  homeScore: string;
  awayScore: string;
  statusText: string;
  venue?: string;
}

interface LiveState {
  hasLive: boolean;
  game?: LiveGame;
}

interface Props {
  slug: string;
  initial: LiveState;
}

export function LiveGameBanner({ slug, initial }: Props) {
  const [state, setState] = useState<LiveState>(initial);

  const poll = useCallback(async () => {
    try {
      const res = await fetch(`/api/live/${slug}`);
      const data: LiveState = await res.json();
      setState(data);
    } catch {
      // ignore transient poll failures
    }
  }, [slug]);

  useEffect(() => {
    if (!state.hasLive) return;
    const id = setInterval(poll, 30_000);
    return () => clearInterval(id);
  }, [state.hasLive, poll]);

  if (!state.hasLive || !state.game) return null;

  const { game } = state;

  return (
    <div className="rounded-2xl bg-green-50 border border-green-200 p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-green-700">
          Live
        </span>
        <span className="ml-auto text-xs font-medium text-green-600">
          {game.statusText}
        </span>
      </div>

      <div className="flex items-center justify-center gap-8">
        <div className="flex-1 text-center">
          <p className="text-sm font-semibold text-zinc-700 mb-1">{game.awayTeam}</p>
          <p className="text-5xl font-bold tabular-nums text-zinc-900">{game.awayScore}</p>
        </div>
        <span className="text-zinc-300 font-light text-2xl">–</span>
        <div className="flex-1 text-center">
          <p className="text-sm font-semibold text-zinc-700 mb-1">{game.homeTeam}</p>
          <p className="text-5xl font-bold tabular-nums text-zinc-900">{game.homeScore}</p>
        </div>
      </div>

      {game.venue && (
        <p className="text-xs text-center text-zinc-400 mt-3">{game.venue}</p>
      )}
    </div>
  );
}
