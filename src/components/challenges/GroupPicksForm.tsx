"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { saveGroupPicks } from "@/lib/actions/picks";
import type { GroupPicksData } from "@/lib/actions/picks";
import type { GroupData } from "@/lib/tournament/structure";

interface Props {
  groups: GroupData[];
  initialPicks: GroupPicksData;
  entryId: string;
  locked: boolean;
}

const ORDINALS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

function SortableTeam({
  team,
  index,
  advances,
  locked,
}: {
  team: string;
  index: number;
  advances: boolean;
  locked: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: team, disabled: locked });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 ${isDragging ? "opacity-50" : ""}`}
    >
      <span className="w-7 shrink-0 text-right text-xs text-zinc-400 dark:text-zinc-500">
        {ORDINALS[index] ?? `${index + 1}`}
      </span>
      <span
        className={`flex-1 px-3 py-2 rounded-lg text-sm border select-none ${
          advances
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-zinc-800 dark:text-zinc-200"
            : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
        }`}
      >
        {team}
      </span>
      {!locked && (
        <button
          {...attributes}
          {...listeners}
          className="shrink-0 p-1.5 text-zinc-300 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-400 cursor-grab active:cursor-grabbing touch-none transition-colors"
          aria-label="Drag to reorder"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <circle cx="4" cy="3" r="1.2" />
            <circle cx="10" cy="3" r="1.2" />
            <circle cx="4" cy="7" r="1.2" />
            <circle cx="10" cy="7" r="1.2" />
            <circle cx="4" cy="11" r="1.2" />
            <circle cx="10" cy="11" r="1.2" />
          </svg>
        </button>
      )}
    </div>
  );
}

function GroupCard({
  group,
  order,
  locked,
  onReorder,
}: {
  group: GroupData;
  order: string[];
  locked: boolean;
  onReorder: (newOrder: string[]) => void;
}) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(active.id as string);
    const newIndex = order.indexOf(over.id as string);
    onReorder(arrayMove(order, oldIndex, newIndex));
  }

  return (
    <div className="rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4">
      <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
        Group {group.letter}
      </h3>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <div className="space-y-1.5">
            {order.map((team, i) => (
              <SortableTeam
                key={team}
                team={team}
                index={i}
                advances={i < 2}
                locked={locked}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export function GroupPicksForm({ groups, initialPicks, entryId, locked }: Props) {
  const [orders, setOrders] = useState<GroupPicksData>(() => {
    const result: GroupPicksData = {};
    for (const group of groups) {
      const teams = group.standings.map((s) => s.team);
      const saved = initialPicks[group.letter];
      if (saved && saved.length === teams.length && saved.every((t) => teams.includes(t))) {
        result[group.letter] = saved;
      } else {
        result[group.letter] = teams;
      }
    }
    return result;
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleReorder(groupLetter: string, newOrder: string[]) {
    setSaved(false);
    setOrders((prev) => ({ ...prev, [groupLetter]: newOrder }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await saveGroupPicks(entryId, orders);
      setSaved(true);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {groups.map((group) => {
          const order = orders[group.letter] ?? group.standings.map((s) => s.team);
          return (
            <GroupCard
              key={group.letter}
              group={group}
              order={order}
              locked={locked}
              onReorder={(newOrder) => handleReorder(group.letter, newOrder)}
            />
          );
        })}
      </div>

      {locked ? (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Group picks are locked — the tournament has started.
        </p>
      ) : (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2.5 text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : "Save picks"}
          </button>
          {saved && <span className="text-sm text-green-600 dark:text-green-400">Saved!</span>}
          {error && <span className="text-sm text-red-600 dark:text-red-400">{error}</span>}
        </div>
      )}
    </div>
  );
}
