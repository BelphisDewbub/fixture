import { auth, signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import { joinChallenge } from "@/lib/actions/challenges";

interface Props {
  params: Promise<{ code: string }>;
}

export default async function JoinChallengePage({ params }: Props) {
  const { code } = await params;
  const session = await auth();

  const challenge = await prisma.challenge.findUnique({
    where: { inviteCode: code },
    include: { _count: { select: { entries: true } } },
  });

  if (!challenge) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 font-sans flex items-center justify-center">
        <p className="text-zinc-500 dark:text-zinc-400">Invalid invite link.</p>
      </div>
    );
  }

  if (session?.user?.id) {
    const existing = await prisma.challengeEntry.findUnique({
      where: { challengeId_userId: { challengeId: challenge.id, userId: session.user.id } },
    });
    if (existing) redirect(`/challenges/${challenge.id}`);
  }

  async function handleSignIn() {
    "use server";
    await signIn("google", { redirectTo: `/challenges/join/${code}` });
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 font-sans">
      <main className="mx-auto max-w-4xl px-6 py-10 flex flex-col items-center">
        <div className="rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-8 max-w-sm w-full text-center space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-green-600 dark:text-green-400 mb-2">
              You&apos;re invited to join
            </p>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{challenge.name}</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {challenge._count.entries}{" "}
              {challenge._count.entries === 1 ? "member" : "members"} · {challenge.tournamentSlug}
            </p>
          </div>

          {session?.user ? (
            <form action={joinChallenge}>
              <input type="hidden" name="code" value={code} />
              <button
                type="submit"
                className="w-full rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2.5 text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
              >
                Join challenge
              </button>
            </form>
          ) : (
            <form action={handleSignIn}>
              <button
                type="submit"
                className="w-full rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2.5 text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
              >
                Sign in with Google to join
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
