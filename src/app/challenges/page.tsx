import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Footer } from "@/components/Footer";

export default async function ChallengesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin?callbackUrl=/challenges");

  const entries = await prisma.challengeEntry.findMany({
    where: { userId: session.user.id },
    include: {
      challenge: {
        include: { _count: { select: { entries: true } } },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 font-sans">
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">My Challenges</h1>
          <Link
            href="/challenges/new"
            className="text-sm bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-3 py-1.5 rounded-lg font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
          >
            New challenge
          </Link>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 dark:text-zinc-400 mb-4">No challenges yet.</p>
            <Link
              href="/challenges/new"
              className="text-green-600 dark:text-green-400 font-medium hover:underline"
            >
              Create your first challenge →
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {entries.map(({ challenge }) => (
              <li key={challenge.id}>
                <Link
                  href={`/challenges/${challenge.id}`}
                  className="flex items-center justify-between rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-5 py-4 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors group"
                >
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">{challenge.name}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {challenge.tournamentSlug} ·{" "}
                      {challenge._count.entries}{" "}
                      {challenge._count.entries === 1 ? "member" : "members"}
                    </p>
                  </div>
                  <span className="text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors text-sm">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}
