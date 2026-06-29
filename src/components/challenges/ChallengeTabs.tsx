"use client";

import { useState } from "react";
import Image from "next/image";
import { InviteLinkCopy } from "@/components/InviteLinkCopy";
import { DeleteChallengeButton } from "@/components/challenges/DeleteChallengeButton";
import { WeightsForm } from "@/components/challenges/WeightsForm";
import { MembersManager } from "@/components/challenges/MembersManager";
import { LockOverridesForm } from "@/components/challenges/LockOverridesForm";
import { GroupPicksForm } from "@/components/challenges/GroupPicksForm";
import { BracketPicksForm } from "@/components/challenges/BracketPicksForm";
import { Leaderboard } from "@/components/challenges/Leaderboard";
import type { GroupData, BracketRound } from "@/lib/tournament/structure";
import type { GroupPicksData, BracketPicksData } from "@/lib/actions/picks";
import type { LeaderboardRow } from "@/components/challenges/Leaderboard";
import { type ChallengeWeights, WEIGHT_LABELS } from "@/lib/weights";

interface Member {
  name: string | null;
  image: string | null;
}

interface Entry {
  userId: string;
  isAdmin: boolean;
  user: Member;
}

interface ChallengeInfo {
  id: string;
  createdById: string;
  entries: Entry[];
  groupPicksOpen: boolean;
  bracketPicksOpen: boolean;
}

export interface PlayerPicksRow {
  userId: string;
  name: string | null;
  image: string | null;
  groupPicks: GroupPicksData;
  bracketPicks: BracketPicksData;
}

interface Props {
  challenge: ChallengeInfo;
  myUserId: string;
  myEntryId: string;
  myIsAdmin: boolean;
  inviteUrl: string;
  groups: GroupData[];
  bracketRounds: BracketRound[];
  groupPicks: GroupPicksData;
  bracketPicks: BracketPicksData;
  groupPicksLocked: boolean;
  bracketPicksUnlocked: boolean;
  bracketPicksLocked: boolean;
  leaderboard: LeaderboardRow[];
  allPicksData: PlayerPicksRow[];
  weights: ChallengeWeights;
}

type Tab = "leaderboard" | "picks" | "overview" | "settings";

const TAB_LABELS: Record<Tab, string> = {
  leaderboard: "Leaderboard",
  picks: "My Picks",
  overview: "Overview",
  settings: "Settings",
};

const BRACKET_SLUGS = [
  "round-of-32",
  "round-of-16",
  "quarterfinals",
  "semifinals",
  "3rd-place-match",
  "final",
] as const;

export function ChallengeTabs({
  challenge,
  myUserId,
  myEntryId,
  myIsAdmin,
  inviteUrl,
  groups,
  bracketRounds,
  groupPicks,
  bracketPicks,
  groupPicksLocked,
  bracketPicksUnlocked,
  bracketPicksLocked,
  leaderboard,
  allPicksData,
  weights,
}: Props) {
  const [tab, setTab] = useState<Tab>("overview");
  const [viewingUserId, setViewingUserId] = useState(myUserId);

  const isOwner = myUserId === challenge.createdById;
  const isOwnerOrAdmin = isOwner || myIsAdmin;

  const visibleTabs: Tab[] = ["overview", "leaderboard", "picks", ...(isOwnerOrAdmin ? (["settings"] as Tab[]) : [])];

  const anyLocked = groupPicksLocked || bracketPicksLocked;
  const isViewingOwn = viewingUserId === myUserId;
  const viewingData = allPicksData.find((p) => p.userId === viewingUserId);

  const displayGroupPicks = isViewingOwn ? groupPicks : (viewingData?.groupPicks ?? {});
  const displayBracketPicks = isViewingOwn ? bracketPicks : (viewingData?.bracketPicks ?? {});

  return (
    <div>
      <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg mb-6 w-fit">
        {visibleTabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              tab === t
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {tab === "leaderboard" && (
        <Leaderboard rows={leaderboard} myUserId={myUserId} />
      )}

      {tab === "overview" && (
        <div className="space-y-5">
          <div className="rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-5 space-y-3">
            <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Invite link</h2>
            <InviteLinkCopy inviteUrl={inviteUrl} />
          </div>

          <div className="rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-5">
            <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
              Members · {challenge.entries.length}
            </h2>
            <ul className="space-y-3">
              {challenge.entries.map(({ userId, user }) => (
                <li key={userId} className="flex items-center gap-3">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name ?? ""}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-600" />
                  )}
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {user.name ?? "Unknown"}
                  </span>
                  {userId === challenge.createdById && (
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">(creator)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              How points are calculated
            </h2>
            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Group Stage
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {weights.groupStage} pt
                </span>
                {" "}per team in the correct standings position
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Knockout Rounds
              </p>
              {BRACKET_SLUGS.map((slug) => (
                <div key={slug} className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">{WEIGHT_LABELS[slug]}</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {weights[slug]} {weights[slug] === 1 ? "pt" : "pts"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {isOwner && (
            <div className="flex justify-end">
              <DeleteChallengeButton challengeId={challenge.id} />
            </div>
          )}
        </div>
      )}

      {tab === "picks" && (
        <div className="space-y-10">
          {anyLocked && (
            <div className="flex flex-wrap gap-2">
              {allPicksData.map((player) => {
                const isSelected = viewingUserId === player.userId;
                return (
                  <button
                    key={player.userId}
                    onClick={() => setViewingUserId(player.userId)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      isSelected
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {player.image ? (
                      <Image
                        src={player.image}
                        alt=""
                        width={18}
                        height={18}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-[18px] h-[18px] rounded-full bg-zinc-300 dark:bg-zinc-600 shrink-0" />
                    )}
                    <span>{player.userId === myUserId ? "You" : (player.name ?? "Unknown")}</span>
                  </button>
                );
              })}
            </div>
          )}

          {(isViewingOwn || groupPicksLocked) && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Group Stage
                </h2>
                {groupPicksLocked && (
                  <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">
                    Locked
                  </span>
                )}
              </div>
              <GroupPicksForm
                key={viewingUserId + "-groups"}
                groups={groups}
                initialPicks={displayGroupPicks}
                entryId={myEntryId}
                locked={groupPicksLocked || !isViewingOwn}
              />
            </div>
          )}

          {(isViewingOwn || bracketPicksLocked) && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Bracket</h2>
                {bracketPicksLocked && (
                  <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">
                    Locked
                  </span>
                )}
                {isViewingOwn && !bracketPicksUnlocked && !bracketPicksLocked && (
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded-full">
                    Pending
                  </span>
                )}
              </div>
              <BracketPicksForm
                key={viewingUserId + "-bracket"}
                bracketRounds={bracketRounds}
                initialPicks={displayBracketPicks}
                entryId={myEntryId}
                unlocked={isViewingOwn ? bracketPicksUnlocked : bracketPicksLocked}
                locked={bracketPicksLocked || !isViewingOwn}
              />
            </div>
          )}
        </div>
      )}

      {tab === "settings" && isOwnerOrAdmin && (
        <div className="space-y-5">
          {isOwner && (
            <WeightsForm challengeId={challenge.id} initialWeights={weights} />
          )}
          <LockOverridesForm
            challengeId={challenge.id}
            initialGroupPicksOpen={challenge.groupPicksOpen}
            initialBracketPicksOpen={challenge.bracketPicksOpen}
          />
          <MembersManager
            challengeId={challenge.id}
            members={challenge.entries.map((e) => ({
              userId: e.userId,
              name: e.user.name,
              image: e.user.image,
              isAdmin: e.isAdmin,
              isOwner: e.userId === challenge.createdById,
            }))}
            myUserId={myUserId}
            viewerIsOwner={isOwner}
          />
        </div>
      )}
    </div>
  );
}
