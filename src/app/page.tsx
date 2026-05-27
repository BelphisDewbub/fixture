import { SubscribeCard } from "@/components/SubscribeCard";

const FEATURED = [
  {
    slug: "world-cup-2026",
    name: "FIFA World Cup 2026",
    sport: "Soccer",
    dates: "Jun 11 – Jul 19, 2026",
    description: "All group stage and knockout matches across the US, Canada, and Mexico",
    matchCount: 104,
    logoUrl: "https://crests.football-data.org/wm26.png",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-zinc-900">Fixture</span>
          <span className="text-sm text-zinc-400 hidden sm:block">
            Sports schedules, straight to your calendar
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Never miss a game.
        </h1>
        <p className="mt-4 text-lg text-zinc-500 max-w-xl mx-auto">
          Subscribe to any team or tournament. Every match lands in your calendar
          automatically — with kickoff times, venues, and where to stream.
        </p>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { step: "1", label: "Find your team or tournament" },
            { step: "2", label: "Click Subscribe to get your feed URL" },
            { step: "3", label: "Paste it once — games sync automatically" },
          ].map(({ step, label }) => (
            <div key={step} className="flex items-center gap-3 rounded-xl bg-white border border-zinc-200 px-5 py-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                {step}
              </span>
              <span className="text-sm text-zinc-700">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <main className="mx-auto max-w-4xl px-6 pb-24">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-4">
          Featured
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FEATURED.map((item) => (
            <SubscribeCard key={item.slug} {...item} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-8 text-center text-xs text-zinc-400">
        Fixture · Game data via{" "}
        <a href="https://www.football-data.org" className="underline hover:text-zinc-600">
          football-data.org
        </a>
      </footer>
    </div>
  );
}
