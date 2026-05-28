"use client";

import { useState } from "react";
import { ScheduleTable, type SerializedGame } from "./ScheduleTable";
import { TournamentTeamList } from "./TournamentTeamList";
import { GroupPhase } from "./GroupPhase";
import { TournamentBracket } from "./TournamentBracket";
import type { GroupData, BracketRound } from "@/lib/tournament/structure";

interface Props {
  games: SerializedGame[];
  tournamentSlug: string;
  teams: string[];
  groups: GroupData[];
  bracketRounds: BracketRound[];
}

type Tab = "schedule" | "groups" | "bracket" | "teams";

export function TournamentTabs({ games, tournamentSlug, teams, groups, bracketRounds }: Props) {
  const hasGroups = groups.length > 0;
  const hasBracket = bracketRounds.length > 0;

  const defaultTab: Tab = hasGroups ? "groups" : hasBracket ? "bracket" : "schedule";
  const [tab, setTab] = useState<Tab>(defaultTab);

  const tabs: Array<{ id: Tab; label: string; visible: boolean }> = [
    { id: "groups",   label: "Groups",        visible: hasGroups },
    { id: "bracket",  label: "Bracket",       visible: hasBracket },
    { id: "schedule", label: "Full Schedule", visible: true },
    { id: "teams",    label: "Teams",         visible: teams.length > 0 },
  ];

  return (
    <div>
      <div className="flex gap-1 mb-6 border-b border-zinc-200 dark:border-zinc-700 overflow-x-auto">
        {tabs
          .filter((t) => t.visible)
          .map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${
                tab === t.id
                  ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100"
                  : "border-transparent text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              {t.label}
            </button>
          ))}
      </div>

      {tab === "groups"   && <GroupPhase groups={groups} />}
      {tab === "bracket"  && <TournamentBracket rounds={bracketRounds} />}
      {tab === "schedule" && <ScheduleTable games={games} />}
      {tab === "teams"    && <TournamentTeamList tournamentSlug={tournamentSlug} teams={teams} />}
    </div>
  );
}
