"use client";

import { useState, useTransition } from "react";
import { deleteChallenge } from "@/lib/actions/challenges";

export function DeleteChallengeButton({ challengeId }: { challengeId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(() => {
      deleteChallenge(challengeId);
    });
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-sm text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
      >
        Delete challenge
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Delete this challenge and all picks? This cannot be undone.
      </p>
      <button
        onClick={() => setConfirming(false)}
        disabled={isPending}
        className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 px-3 py-1 rounded-lg transition-colors"
      >
        {isPending ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
}
