"use client";

import { useState, useEffect } from "react";
import { slugifyTeamName } from "@/lib/sports";

interface Props {
  tournamentSlug: string;
  teams: string[];
}

export function TournamentTeamList({ tournamentSlug, teams }: Props) {
  const [openTeam, setOpenTeam] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  function feedSlug(team: string) {
    return `${tournamentSlug}--${slugifyTeamName(team)}`;
  }

  function webcalUrl(team: string) {
    return `${origin}/api/cal/${feedSlug(team)}`.replace(/^https?/, "webcal");
  }

  function googleCalUrl(team: string) {
    return `https://www.google.com/calendar/render?cid=${encodeURIComponent(webcalUrl(team))}`;
  }

  function outlookCalUrl(team: string) {
    const url = `${origin}/api/cal/${feedSlug(team)}`;
    return `https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(url)}`;
  }

  async function copy(team: string) {
    await navigator.clipboard.writeText(webcalUrl(team));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function toggle(team: string) {
    setOpenTeam((prev) => (prev === team ? null : team));
    setCopied(false);
  }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden shadow-sm">
      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {teams.map((team) => (
          <li key={team}>
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="flex-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">{team}</span>
              <button
                onClick={() => toggle(team)}
                className="shrink-0 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition-colors"
              >
                {openTeam === team ? "Close" : "Subscribe"}
              </button>
            </div>

            {openTeam === team && origin && (
              <div className="mx-4 mb-3 space-y-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Your calendar feed URL
                </p>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={webcalUrl(team)}
                    className="min-w-0 flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-700 px-3 py-2 text-xs font-mono text-zinc-700 dark:text-zinc-300 focus:outline-none"
                    onFocus={(e) => e.target.select()}
                  />
                  <button
                    onClick={() => copy(team)}
                    className="shrink-0 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition-colors"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={googleCalUrl(team)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition-colors"
                  >
                    Google Calendar
                  </a>
                  <a
                    href={webcalUrl(team)}
                    className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition-colors"
                  >
                    Apple Calendar
                  </a>
                  <a
                    href={outlookCalUrl(team)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition-colors"
                  >
                    Outlook
                  </a>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
