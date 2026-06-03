import Image from "next/image";

export interface LeaderboardRow {
  userId: string;
  name: string | null;
  image: string | null;
  groupScore: number;
  bracketScore: number;
  total: number;
}

interface Props {
  rows: LeaderboardRow[];
  myUserId: string;
}

export function Leaderboard({ rows, myUserId }: Props) {
  if (rows.length === 0) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400 py-4">No entries yet.</p>;
  }

  const sorted = [...rows].sort((a, b) => b.total - a.total);

  let currentRank = 1;
  const ranked = sorted.map((row, i) => {
    if (i > 0 && sorted[i].total < sorted[i - 1].total) currentRank = i + 1;
    return { ...row, rank: currentRank };
  });

  return (
    <div className="rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 w-8">
              #
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Player
            </th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Groups
            </th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Bracket
            </th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {ranked.map((row) => {
            const isMe = row.userId === myUserId;
            return (
              <tr
                key={row.userId}
                className={`border-b border-zinc-100 dark:border-zinc-700/50 last:border-0 ${
                  isMe ? "bg-green-50 dark:bg-green-900/10" : ""
                }`}
              >
                <td className="px-4 py-3 text-zinc-400 dark:text-zinc-500 tabular-nums">
                  {row.rank}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {row.image ? (
                      <Image
                        src={row.image}
                        alt={row.name ?? ""}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-600 shrink-0" />
                    )}
                    <span
                      className={`text-zinc-700 dark:text-zinc-300 ${isMe ? "font-medium" : ""}`}
                    >
                      {row.name ?? "Unknown"}
                      {isMe && (
                        <span className="ml-1 text-zinc-400 dark:text-zinc-500 font-normal">
                          (you)
                        </span>
                      )}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-zinc-600 dark:text-zinc-400">
                  {row.groupScore}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-zinc-600 dark:text-zinc-400">
                  {row.bracketScore}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-semibold text-zinc-900 dark:text-zinc-100">
                  {row.total}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
