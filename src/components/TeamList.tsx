"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface TeamEntry {
  slug: string;
  name: string;
  logoUrl: string;
}

interface Props {
  prefix: string;
  teams: TeamEntry[];
}

export function TeamList({ prefix, teams }: Props) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  function toggle(slug: string) {
    setOpenSlug((prev) => (prev === slug ? null : slug));
    setCopied(false);
  }

  function feedUrl(slug: string) {
    return `${origin}/api/cal/${prefix}-${slug}`;
  }

  function webcalUrl(slug: string) {
    return feedUrl(slug).replace(/^https?/, "webcal");
  }

  function googleCalUrl(slug: string) {
    return `https://www.google.com/calendar/render?cid=${encodeURIComponent(webcalUrl(slug))}`;
  }

  function outlookCalUrl(slug: string) {
    return `https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(feedUrl(slug))}`;
  }

  async function copy(slug: string) {
    await navigator.clipboard.writeText(webcalUrl(slug));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <ul className="divide-y divide-zinc-100">
      {teams.map(({ slug, name, logoUrl }) => (
        <li key={slug}>
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="shrink-0 w-8 h-8 relative">
              <Image src={logoUrl} alt={name} fill className="object-contain" unoptimized />
            </div>
            <Link
              href={`/team/${prefix}-${slug}`}
              className="flex-1 text-sm font-medium text-zinc-800 hover:text-green-700 transition-colors"
            >
              {name}
            </Link>
            <button
              onClick={() => toggle(slug)}
              className="shrink-0 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition-colors"
            >
              {openSlug === slug ? "Close" : "Subscribe"}
            </button>
          </div>

          {openSlug === slug && origin && (
            <div className="mx-4 mb-3 space-y-3 rounded-xl border border-zinc-100 bg-zinc-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Your calendar feed URL
              </p>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={webcalUrl(slug)}
                  className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-mono text-zinc-700 focus:outline-none"
                  onFocus={(e) => e.target.select()}
                />
                <button
                  onClick={() => copy(slug)}
                  className="shrink-0 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={googleCalUrl(slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  Google Calendar
                </a>
                <a
                  href={webcalUrl(slug)}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  Apple Calendar
                </a>
                <a
                  href={outlookCalUrl(slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  Outlook
                </a>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
