import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 py-8 text-center text-xs text-zinc-400 space-y-2">
      <p>
        Fixture · Game data via{" "}
        <a
          href="https://www.espn.com"
          className="underline hover:text-zinc-600 transition-colors"
        >
          ESPN
        </a>
      </p>
      <p>
        <a
          href="https://buymeacoffee.com/belphisdewbub"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 hover:border-yellow-300 hover:bg-yellow-50 hover:text-yellow-800 transition-colors"
        >
          ☕ Buy me a coffee
        </a>
      </p>
    </footer>
  );
}
