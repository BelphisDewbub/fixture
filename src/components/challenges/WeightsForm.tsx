"use client";

import { useState, useTransition } from "react";
import { saveWeights } from "@/lib/actions/challenges";
import { type ChallengeWeights, DEFAULT_WEIGHTS, WEIGHT_LABELS } from "@/lib/weights";

export function WeightsForm({
  challengeId,
  initialWeights,
}: {
  challengeId: string;
  initialWeights: ChallengeWeights;
}) {
  const [weights, setWeights] = useState(initialWeights);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleChange(key: keyof ChallengeWeights, value: string) {
    const n = parseInt(value, 10);
    if (!isNaN(n) && n >= 0) setWeights((w) => ({ ...w, [key]: n }));
  }

  function handleSave() {
    startTransition(async () => {
      const result = await saveWeights(challengeId, weights);
      if (!result.error) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  }

  return (
    <div className="rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-5 space-y-4">
      <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Point weightings</h2>
      <div className="space-y-3">
        {(Object.keys(DEFAULT_WEIGHTS) as (keyof ChallengeWeights)[]).map((key) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">{WEIGHT_LABELS[key]}</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={weights[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-16 text-center rounded-lg border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-500"
              />
              <span className="text-xs text-zinc-400 dark:text-zinc-500 w-5">pts</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-3 pt-1 border-t border-zinc-100 dark:border-zinc-700">
        {saved && (
          <span className="text-xs text-green-600 dark:text-green-400">Saved!</span>
        )}
        <button
          onClick={handleSave}
          disabled={isPending}
          className="text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-3 py-1.5 rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Saving…" : "Save weightings"}
        </button>
      </div>
    </div>
  );
}
