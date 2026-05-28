import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 text-center text-xs text-zinc-400 dark:text-zinc-500 space-y-2">
      <p>
        Fixture · Game data via{" "}
        <a
          href="https://www.espn.com"
          className="underline hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          ESPN
        </a>
      </p>
      <p>
        <a
          href="https://buymeacoffee.com/belphisdewbub"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:border-yellow-300 dark:hover:border-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-800 dark:hover:text-yellow-300 transition-colors"
        >
          ☕ Buy me a coffee
        </a>
      </p>
    </footer>
  );
}
