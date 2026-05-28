import Link from "next/link";
import { Footer } from "@/components/Footer";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { CalendarGuide } from "./CalendarGuide";

export const metadata = {
  title: "How to add your calendar — Fixture",
  description:
    "Step-by-step instructions for adding a Fixture calendar feed to Google Calendar, Apple Calendar, Outlook, and more.",
};

export default function HowToAddPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 font-sans">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              ← Back
            </Link>
            <span className="text-zinc-200 dark:text-zinc-700">|</span>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Fixture</span>
          </div>
          <DarkModeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-3">
            How to add your calendar
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg">
            After subscribing, you&apos;ll get a feed URL. Here&apos;s how to add it to
            whichever calendar app you use — games will then appear automatically
            and stay up to date.
          </p>
        </div>

        <CalendarGuide />
      </main>
      <Footer />
    </div>
  );
}
