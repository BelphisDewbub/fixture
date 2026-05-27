"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Props {
  slug: string;
  name: string;
  sport: string;
  dates: string;
  description: string;
  matchCount?: number;
  logoUrl?: string;
}

export function SubscribeCard({ slug, name, sport, dates, description, matchCount, logoUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedUrl, setFeedUrl] = useState("");

  useEffect(() => {
    setFeedUrl(`${window.location.origin}/api/cal/${slug}`);
  }, [slug]);

  const webcalUrl = feedUrl.replace(/^https?/, "webcal");
  const googleCalUrl = feedUrl
    ? `https://www.google.com/calendar/render?cid=${encodeURIComponent(webcalUrl)}`
    : "";

  async function copy() {
    await navigator.clipboard.writeText(webcalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
      {/* Card header */}
      <div className="flex items-center gap-4 p-6">
        {logoUrl && (
          <div className="shrink-0 w-14 h-14 relative">
            <Image src={logoUrl} alt={name} fill className="object-contain" unoptimized />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-green-600">
              {sport}
            </span>
          </div>
          <h2 className="text-lg font-semibold text-zinc-900 leading-snug">{name}</h2>
          <p className="text-sm text-zinc-500 mt-0.5">{dates}</p>
        </div>
      </div>

      {/* Card body */}
      <div className="px-6 pb-4">
        <p className="text-sm text-zinc-600">
          {description}
          {matchCount && (
            <span className="ml-1 text-zinc-400">· {matchCount} matches</span>
          )}
        </p>
      </div>

      {/* Subscribe toggle */}
      <div className="px-6 pb-6">
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="w-full rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
          >
            Subscribe
          </button>
        ) : (
          <div className="space-y-4 rounded-xl border border-zinc-100 bg-zinc-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Your calendar feed URL
            </p>

            {/* URL row */}
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={webcalUrl}
                className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-mono text-zinc-700 focus:outline-none"
                onFocus={(e) => e.target.select()}
              />
              <button
                onClick={copy}
                className="shrink-0 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Calendar app shortcuts */}
            <div className="space-y-2">
              <p className="text-xs text-zinc-400">Add to your calendar:</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={googleCalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  Google Calendar
                </a>
                <a
                  href={webcalUrl}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  Apple Calendar
                </a>
                <a
                  href={webcalUrl}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  Outlook
                </a>
              </div>
              <p className="text-xs text-zinc-400">
                Or paste the URL into any app that supports calendar subscriptions.
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
