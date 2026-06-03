import Link from "next/link";
import Image from "next/image";
import { auth, signIn, signOut } from "@/auth";
import { DarkModeToggle } from "@/components/DarkModeToggle";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800">
      <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          Fixture
        </Link>
        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link
                href="/challenges"
                className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
              >
                Challenges
              </Link>
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? ""}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <button
                type="submit"
                className="text-sm bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-3 py-1.5 rounded-lg font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
              >
                Sign in with Google
              </button>
            </form>
          )}
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
