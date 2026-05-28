"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Provider = "google" | "apple" | "outlook" | "other";

const PROVIDERS: { id: Provider; label: string }[] = [
  { id: "google", label: "Google Calendar" },
  { id: "apple", label: "Apple Calendar" },
  { id: "outlook", label: "Outlook" },
  { id: "other", label: "Other app" },
];

function providerConfig(
  provider: Provider,
  feedUrl: string
): { copyUrl: string; actionUrl: string | null; actionLabel: string | null } {
  const webcalUrl = feedUrl.replace(/^https?/, "webcal");
  switch (provider) {
    case "google":
      return {
        copyUrl: feedUrl,
        actionUrl: `https://www.google.com/calendar/render?cid=${encodeURIComponent(webcalUrl)}`,
        actionLabel: "Open Google Calendar",
      };
    case "apple":
      return { copyUrl: webcalUrl, actionUrl: webcalUrl, actionLabel: "Open Apple Calendar" };
    case "outlook":
      return {
        copyUrl: feedUrl,
        actionUrl: `https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(feedUrl)}`,
        actionLabel: "Open Outlook",
      };
    case "other":
      return { copyUrl: feedUrl, actionUrl: null, actionLabel: null };
  }
}

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
  const [provider, setProvider] = useState<Provider | null>(null);
  const [copied, setCopied] = useState(false);
  const [feedUrl, setFeedUrl] = useState("");

  useEffect(() => {
    setFeedUrl(`${window.location.origin}/api/cal/${slug}`);
  }, [slug]);

  const config = provider && feedUrl ? providerConfig(provider, feedUrl) : null;

  async function copy() {
    if (!config) return;
    await navigator.clipboard.writeText(config.copyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function closePanel() {
    setOpen(false);
    setProvider(null);
    setCopied(false);
  }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden shadow-sm">
      {/* Card header */}
      <div className="flex items-center gap-4 p-6">
        {logoUrl && (
          <div className="shrink-0 w-14 h-14 relative">
            <Image src={logoUrl} alt={name} fill className="object-contain" unoptimized />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-green-600 dark:text-green-400">
              {sport}
            </span>
          </div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">{name}</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{dates}</p>
        </div>
      </div>

      {/* Card body */}
      <div className="px-6 pb-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {description}
          {matchCount && (
            <span className="ml-1 text-zinc-400 dark:text-zinc-500">· {matchCount} matches</span>
          )}
        </p>
      </div>

      {/* Subscribe panel */}
      <div className="px-6 pb-6">
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="w-full rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
          >
            Subscribe
          </button>
        ) : (
          <div className="space-y-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {provider ? PROVIDERS.find((p) => p.id === provider)?.label : "Add to calendar"}
              </p>
              <div className="flex items-center gap-3">
                {provider && (
                  <button
                    onClick={() => { setProvider(null); setCopied(false); }}
                    className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={closePanel}
                  className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            {!provider ? (
              <div className="flex flex-col gap-2">
                {PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProvider(p.id)}
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition-colors text-left"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            ) : config ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={config.copyUrl}
                    className="min-w-0 flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-700 px-3 py-2 text-xs font-mono text-zinc-700 dark:text-zinc-300 focus:outline-none"
                    onFocus={(e) => e.target.select()}
                  />
                  <button
                    onClick={copy}
                    className="shrink-0 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition-colors"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  Paste this URL into {PROVIDERS.find((p) => p.id === provider)?.label}&apos;s &ldquo;subscribe from web&rdquo; option.
                </p>
                {config.actionUrl && config.actionLabel && (
                  <a
                    href={config.actionUrl}
                    target={provider === "apple" ? undefined : "_blank"}
                    rel={provider === "apple" ? undefined : "noopener noreferrer"}
                    className="block w-full rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors text-center"
                  >
                    {config.actionLabel}
                  </a>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
