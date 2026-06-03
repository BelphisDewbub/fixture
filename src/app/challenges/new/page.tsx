import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import { createChallenge } from "@/lib/actions/challenges";

const TOURNAMENTS = [{ slug: "world-cup-2026", name: "FIFA World Cup 2026" }];

export default async function NewChallengePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin?callbackUrl=/challenges/new");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 font-sans">
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">New Challenge</h1>

        <form
          action={createChallenge}
          className="rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-6 space-y-5 max-w-md"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
            >
              Challenge name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g. Friends World Cup 2026"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="tournamentSlug"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
            >
              Tournament
            </label>
            <select
              id="tournamentSlug"
              name="tournamentSlug"
              required
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {TOURNAMENTS.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2.5 text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
          >
            Create challenge
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
