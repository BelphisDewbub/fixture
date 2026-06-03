"use client";

import { useState } from "react";

export function InviteLinkCopy({ inviteUrl }: { inviteUrl: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      <input
        readOnly
        value={inviteUrl}
        className="flex-1 min-w-0 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 font-mono"
      />
      <button
        onClick={handleCopy}
        className="shrink-0 rounded-lg border border-zinc-300 dark:border-zinc-600 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
