"use client";

import { useState, useEffect } from "react";

interface Props {
  slug: string;
}

export function SubscribeStrip({ slug }: Props) {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const feedUrl = origin ? `${origin}/api/cal/${slug}` : "";
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
    <>
      <button
        onClick={() => setOpen(true)}
        className="shrink-0 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
      >
        Subscribe
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Calendar feed URL
              </p>
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 text-sm transition-colors"
              >
                Close
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                readOnly
                value={webcalUrl}
                className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-mono text-zinc-700 focus:outline-none"
                onFocus={(e) => e.target.select()}
              />
              <button
                onClick={copy}
                className="shrink-0 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

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
              Paste the URL into any app that supports calendar subscriptions.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
