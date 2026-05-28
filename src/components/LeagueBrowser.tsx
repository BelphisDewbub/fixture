"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SubscribeCard } from "./SubscribeCard";
import { TeamList } from "./TeamList";

interface TeamEntry {
  slug: string;
  name: string;
  logoUrl: string;
}

interface TournamentSection {
  type: "tournament";
  id: string;
  label: string;
  logoUrl: string;
  slug: string;
  name: string;
  sport: string;
  dates: string;
  description: string;
  matchCount?: number;
}

interface TeamSection {
  type: "teams";
  id: string;
  label: string;
  logoUrl: string;
  prefix: string;
  teams: TeamEntry[];
  sport: string;
}

type Section = TournamentSection | TeamSection;

interface Props {
  sections: Section[];
}

export function LeagueBrowser({ sections }: Props) {
  const [activeSport, setActiveSport] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sports = Array.from(new Set(sections.map((s) => s.sport))).sort();
  const sportFiltered = activeSport ? sections.filter((s) => s.sport === activeSport) : sections;
  const visible = activeId ? sportFiltered.filter((s) => s.id === activeId) : sportFiltered;

  function selectSport(sport: string | null) {
    setActiveSport(sport);
    setActiveId(null);
  }

  function toggle(id: string) {
    setActiveId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="space-y-6">
      {/* Sport filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => selectSport(null)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            activeSport === null
              ? "bg-zinc-900 text-white"
              : "bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
          }`}
        >
          All Sports
        </button>
        {sports.map((sport) => (
          <button
            key={sport}
            onClick={() => selectSport(sport)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeSport === sport
                ? "bg-zinc-900 text-white"
                : "bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
            }`}
          >
            {sport}
          </button>
        ))}
      </div>

      {/* Horizontal league picker */}
      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-3 pb-1 min-w-max">
          <button
            onClick={() => setActiveId(null)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              activeId === null
                ? "bg-zinc-900 text-white"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            All
          </button>

          {sportFiltered.map((s) => (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className={`flex items-center gap-2.5 shrink-0 rounded-full pl-2 pr-4 py-2 text-sm font-semibold transition-colors ${
                activeId === s.id
                  ? "bg-zinc-900 text-white"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              <span className="flex w-7 h-7 items-center justify-center rounded-full bg-white overflow-hidden shrink-0">
                <Image
                  src={s.logoUrl}
                  alt={s.label}
                  width={28}
                  height={28}
                  className="object-contain"
                  unoptimized
                />
              </span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content sections */}
      <div className="space-y-12 mt-4">
        {visible.map((s) => {
          if (s.type === "tournament") {
            return (
              <section key={s.id}>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-4">
                  Tournaments
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <SubscribeCard
                      slug={s.slug}
                      name={s.name}
                      sport={s.sport}
                      dates={s.dates}
                      description={s.description}
                      matchCount={s.matchCount}
                      logoUrl={s.logoUrl}
                    />
                    <Link
                      href={`/tournament/${s.slug}`}
                      className="block text-center text-sm text-zinc-500 hover:text-zinc-700 transition-colors py-1"
                    >
                      View full schedule →
                    </Link>
                  </div>
                </div>
              </section>
            );
          }

          return (
            <section key={s.id}>
              <div className="flex items-baseline gap-3 mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
                  {s.label}
                </h2>
                <span className="text-xs text-zinc-300">{s.teams.length} teams</span>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
                <TeamList prefix={s.prefix} teams={s.teams} />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
