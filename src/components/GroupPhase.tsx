"use client";

import type { GroupData } from "@/lib/tournament/structure";

interface Props {
  groups: GroupData[];
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZoneName: "short" });
}

function ScoreBadge({ home, away }: { home: string; away: string }) {
  const hg = parseInt(home, 10);
  const ag = parseInt(away, 10);
  const homeWon = hg > ag;
  const awayWon = ag > hg;
  return (
    <span className="inline-flex items-center gap-1 font-mono text-sm font-semibold">
      <span className={homeWon ? "text-zinc-900 dark:text-zinc-100" : awayWon ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-600 dark:text-zinc-400"}>{home}</span>
      <span className="text-zinc-300 dark:text-zinc-600">–</span>
      <span className={awayWon ? "text-zinc-900 dark:text-zinc-100" : homeWon ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-600 dark:text-zinc-400"}>{away}</span>
    </span>
  );
}

function GroupCard({ group }: { group: GroupData }) {
  const now = new Date().toISOString();
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
          Group {group.letter}
        </h3>
      </div>

      {/* Standings table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <th className="text-left px-4 py-2 text-zinc-400 dark:text-zinc-500 font-medium w-full">Team</th>
              <th className="text-center px-2 py-2 text-zinc-400 dark:text-zinc-500 font-medium">P</th>
              <th className="text-center px-2 py-2 text-zinc-400 dark:text-zinc-500 font-medium">W</th>
              <th className="text-center px-2 py-2 text-zinc-400 dark:text-zinc-500 font-medium">D</th>
              <th className="text-center px-2 py-2 text-zinc-400 dark:text-zinc-500 font-medium">L</th>
              <th className="text-center px-2 py-2 text-zinc-400 dark:text-zinc-500 font-medium">GD</th>
              <th className="text-center px-2 py-2 text-zinc-400 dark:text-zinc-500 font-medium font-bold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {group.standings.map((row, i) => (
              <tr
                key={row.team}
                className={`border-b border-zinc-50 dark:border-zinc-800 last:border-0 ${i < 2 ? "bg-green-50/50 dark:bg-green-900/20" : ""}`}
              >
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    {i < 2 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                    )}
                    <span className={`font-medium ${i < 2 ? "text-zinc-800 dark:text-zinc-200" : "text-zinc-600 dark:text-zinc-400"}`}>
                      {row.team}
                    </span>
                  </div>
                </td>
                <td className="text-center px-2 py-2 text-zinc-500 dark:text-zinc-400">{row.played}</td>
                <td className="text-center px-2 py-2 text-zinc-500 dark:text-zinc-400">{row.won}</td>
                <td className="text-center px-2 py-2 text-zinc-500 dark:text-zinc-400">{row.drawn}</td>
                <td className="text-center px-2 py-2 text-zinc-500 dark:text-zinc-400">{row.lost}</td>
                <td className="text-center px-2 py-2 text-zinc-500 dark:text-zinc-400">
                  {row.gd > 0 ? `+${row.gd}` : row.gd}
                </td>
                <td className="text-center px-2 py-2 font-bold text-zinc-800 dark:text-zinc-200">{row.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fixtures */}
      <div className="border-t border-zinc-100 dark:border-zinc-800">
        {group.games.map((g) => {
          const isPast = g.kickoff < now;
          return (
            <div
              key={g.id}
              className={`flex items-center px-4 py-2.5 border-b border-zinc-50 dark:border-zinc-800 last:border-0 gap-3 ${
                isPast && !g.completed ? "opacity-50" : ""
              }`}
            >
              <div className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0 w-16">
                <div>{fmtDate(g.kickoff)}</div>
                <div>{fmtTime(g.kickoff)}</div>
              </div>
              <div className="flex-1 min-w-0 text-sm text-zinc-700 dark:text-zinc-300">
                <span className={g.completed && parseInt(g.homeScore ?? "0") > parseInt(g.awayScore ?? "0") ? "font-semibold text-zinc-900 dark:text-zinc-100" : ""}>
                  {g.homeTeam}
                </span>
                <span className="text-zinc-300 dark:text-zinc-600 mx-1.5">vs</span>
                <span className={g.completed && parseInt(g.awayScore ?? "0") > parseInt(g.homeScore ?? "0") ? "font-semibold text-zinc-900 dark:text-zinc-100" : ""}>
                  {g.awayTeam}
                </span>
              </div>
              {g.completed && g.homeScore != null && g.awayScore != null ? (
                <ScoreBadge home={g.homeScore} away={g.awayScore} />
              ) : (
                <span className="text-xs text-zinc-300 dark:text-zinc-600 shrink-0">vs</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function GroupPhase({ groups }: Props) {
  if (groups.length === 0) {
    return (
      <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-12">
        Group stage data not yet available.
      </p>
    );
  }

  return (
    <div>
      <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-4">
        <span className="inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
          Advancing to knockout stage
        </span>
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {groups.map((g) => (
          <GroupCard key={g.letter} group={g} />
        ))}
      </div>
    </div>
  );
}
