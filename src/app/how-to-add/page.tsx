import Link from "next/link";
import { CalendarGuide } from "./CalendarGuide";

export const metadata = {
  title: "How to add your calendar — Fixture",
  description:
    "Step-by-step instructions for adding a Fixture calendar feed to Google Calendar, Apple Calendar, Outlook, and more.",
};

export default function HowToAddPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center gap-3">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            ← Back
          </Link>
          <span className="text-zinc-200">|</span>
          <span className="text-xl font-bold tracking-tight text-zinc-900">Fixture</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-3">
            How to add your calendar
          </h1>
          <p className="text-zinc-500 text-lg">
            After subscribing, you&apos;ll get a feed URL. Here&apos;s how to add it to
            whichever calendar app you use — games will then appear automatically
            and stay up to date.
          </p>
        </div>

        <CalendarGuide />
      </main>
    </div>
  );
}
