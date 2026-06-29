"use client";

import { useState, useTransition } from "react";
import { saveLockOverrides } from "@/lib/actions/challenges";

interface Props {
  challengeId: string;
  initialGroupPicksOpen: boolean;
  initialBracketPicksOpen: boolean;
}

export function LockOverridesForm({
  challengeId,
  initialGroupPicksOpen,
  initialBracketPicksOpen,
}: Props) {
  const [groupPicksOpen, setGroupPicksOpen] = useState(initialGroupPicksOpen);
  const [bracketPicksOpen, setBracketPicksOpen] = useState(initialBracketPicksOpen);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle(field: "group" | "bracket", value: boolean) {
    const next = {
      groupPicksOpen: field === "group" ? value : groupPicksOpen,
      bracketPicksOpen: field === "bracket" ? value : bracketPicksOpen,
    };
    if (field === "group") setGroupPicksOpen(value);
    else setBracketPicksOpen(value);

    startTransition(async () => {
      const result = await saveLockOverrides(challengeId, next);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-5 space-y-4">
      <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Lock overrides</h2>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Force picks to remain open regardless of game schedule.
      </p>

      <div className="space-y-3">
        <ToggleRow
          label="Keep group picks open"
          description="Group picks stay editable even after the first group game starts."
          checked={groupPicksOpen}
          disabled={isPending}
          onChange={(v) => toggle("group", v)}
        />
        <ToggleRow
          label="Keep bracket picks open"
          description="Bracket picks are unlocked and editable even after bracket games begin."
          checked={bracketPicksOpen}
          disabled={isPending}
          onChange={(v) => toggle("bracket", v)}
        />
      </div>

      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <div className="relative mt-0.5 shrink-0">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`w-9 h-5 rounded-full transition-colors ${
            checked
              ? "bg-zinc-900 dark:bg-zinc-100"
              : "bg-zinc-200 dark:bg-zinc-600"
          } ${disabled ? "opacity-50" : ""}`}
        />
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white dark:bg-zinc-900 shadow transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </div>
      <div>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">{label}</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">{description}</p>
      </div>
    </label>
  );
}
