"use client";

import { useState } from "react";
import { ScheduleTable, type SerializedGame } from "./ScheduleTable";
import { TournamentTeamList } from "./TournamentTeamList";

interface Props {
  games: SerializedGame[];
  tournamentSlug: string;
  teams: string[];
}

type Tab = "schedule" | "teams";

export function TournamentTabs({ games, tournamentSlug, teams }: Props) {
  const [tab, setTab] = useState<Tab>("schedule");

  return (
    <div>
      <div className="flex gap-1 mb-6 border-b border-zinc-200">
        <button
          onClick={() => setTab("schedule")}
          className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px ${
            tab === "schedule"
              ? "border-zinc-900 text-zinc-900"
              : "border-transparent text-zinc-400 hover:text-zinc-600"
          }`}
        >
          Full Schedule
        </button>
        {teams.length > 0 && (
          <button
            onClick={() => setTab("teams")}
            className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              tab === "teams"
                ? "border-zinc-900 text-zinc-900"
                : "border-transparent text-zinc-400 hover:text-zinc-600"
            }`}
          >
            Teams
          </button>
        )}
      </div>

      {tab === "schedule" && <ScheduleTable games={games} />}
      {tab === "teams" && (
        <TournamentTeamList tournamentSlug={tournamentSlug} teams={teams} />
      )}
    </div>
  );
}
