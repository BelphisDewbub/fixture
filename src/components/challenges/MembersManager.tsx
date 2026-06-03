"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { removeMember, setAdmin } from "@/lib/actions/challenges";

interface ManagedMember {
  userId: string;
  name: string | null;
  image: string | null;
  isAdmin: boolean;
  isOwner: boolean;
}

export function MembersManager({
  challengeId,
  members: initialMembers,
  myUserId,
  viewerIsOwner,
}: {
  challengeId: string;
  members: ManagedMember[];
  myUserId: string;
  viewerIsOwner: boolean;
}) {
  const router = useRouter();
  const [members, setMembers] = useState(initialMembers);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleRemove(userId: string) {
    startTransition(async () => {
      const result = await removeMember(challengeId, userId);
      if (!result.error) {
        setMembers((prev) => prev.filter((m) => m.userId !== userId));
        setConfirmingId(null);
        router.refresh();
      }
    });
  }

  function handleToggleAdmin(userId: string, current: boolean) {
    startTransition(async () => {
      const result = await setAdmin(challengeId, userId, !current);
      if (!result.error) {
        setMembers((prev) =>
          prev.map((m) => (m.userId === userId ? { ...m, isAdmin: !current } : m)),
        );
      }
    });
  }

  return (
    <div className="rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-5 space-y-4">
      <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        Members · {members.length}
      </h2>
      <ul className="space-y-3">
        {members.map((member) => {
          const isSelf = member.userId === myUserId;
          const isConfirming = confirmingId === member.userId;
          const canRemove = !member.isOwner && !isSelf;
          const canToggleAdmin = viewerIsOwner && !member.isOwner && !isSelf;

          return (
            <li key={member.userId} className="flex items-center gap-3 min-h-[32px]">
              {member.image ? (
                <Image
                  src={member.image}
                  alt=""
                  width={32}
                  height={32}
                  className="rounded-full shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-600 shrink-0" />
              )}

              <span className="text-sm text-zinc-700 dark:text-zinc-300 flex-1">
                {isSelf ? "You" : (member.name ?? "Unknown")}
              </span>

              {member.isOwner && (
                <span className="text-xs text-zinc-400 dark:text-zinc-500">creator</span>
              )}
              {!member.isOwner && member.isAdmin && (
                <span className="text-xs text-zinc-400 dark:text-zinc-500">admin</span>
              )}

              {isConfirming ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Remove?</span>
                  <button
                    onClick={() => setConfirmingId(null)}
                    disabled={isPending}
                    className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRemove(member.userId)}
                    disabled={isPending}
                    className="text-xs font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 px-2 py-0.5 rounded transition-colors"
                  >
                    {isPending ? "…" : "Remove"}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {canToggleAdmin && (
                    <button
                      onClick={() => handleToggleAdmin(member.userId, member.isAdmin)}
                      disabled={isPending}
                      className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-50 transition-colors"
                    >
                      {member.isAdmin ? "Revoke admin" : "Make admin"}
                    </button>
                  )}
                  {canRemove && (
                    <button
                      onClick={() => setConfirmingId(member.userId)}
                      disabled={isPending}
                      className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
