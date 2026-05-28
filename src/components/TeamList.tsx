"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

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
  const [openProvider, setOpenProvider] = useState<Provider | null>(null);
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  function toggle(slug: string) {
    if (openSlug === slug) {
      setOpenSlug(null);
    } else {
      setOpenSlug(slug);
    }
    setOpenProvider(null);
    setCopied(false);
  }

  function feedUrl(slug: string) {
    return `${origin}/api/cal/${prefix}-${slug}`;
  }

  async function copy(slug: string, provider: Provider) {
    const cfg = providerConfig(provider, feedUrl(slug));
    await navigator.clipboard.writeText(cfg.copyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
      {teams.map(({ slug, name, logoUrl }) => {
        const isOpen = openSlug === slug;
        const cfg = isOpen && openProvider && origin ? providerConfig(openProvider, feedUrl(slug)) : null;

        return (
          <li key={slug}>
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="shrink-0 w-8 h-8 relative">
                <Image src={logoUrl} alt={name} fill className="object-contain" unoptimized />
              </div>
              <Link
                href={`/team/${prefix}-${slug}`}
                className="flex-1 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-green-700 dark:hover:text-green-400 transition-colors"
              >
                {name}
              </Link>
              <button
                onClick={() => toggle(slug)}
                className="shrink-0 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition-colors"
              >
                {isOpen ? "Close" : "Subscribe"}
              </button>
            </div>

            {isOpen && origin && (
              <div className="mx-4 mb-3 space-y-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    {openProvider ? PROVIDERS.find((p) => p.id === openProvider)?.label : "Add to calendar"}
                  </p>
                  {openProvider && (
                    <button
                      onClick={() => { setOpenProvider(null); setCopied(false); }}
                      className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    >
                      Back
                    </button>
                  )}
                </div>

                {!openProvider ? (
                  <div className="flex flex-col gap-2">
                    {PROVIDERS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setOpenProvider(p.id)}
                        className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition-colors text-left"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                ) : cfg ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        readOnly
                        value={cfg.copyUrl}
                        className="min-w-0 flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-700 px-3 py-2 text-xs font-mono text-zinc-700 dark:text-zinc-300 focus:outline-none"
                        onFocus={(e) => e.target.select()}
                      />
                      <button
                        onClick={() => copy(slug, openProvider)}
                        className="shrink-0 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition-colors"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      Paste this URL into {PROVIDERS.find((p) => p.id === openProvider)?.label}&apos;s &ldquo;subscribe from web&rdquo; option.
                    </p>
                    {cfg.actionUrl && cfg.actionLabel && (
                      <a
                        href={cfg.actionUrl}
                        target={openProvider === "apple" ? undefined : "_blank"}
                        rel={openProvider === "apple" ? undefined : "noopener noreferrer"}
                        className="block w-full rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors text-center"
                      >
                        {cfg.actionLabel}
                      </a>
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
