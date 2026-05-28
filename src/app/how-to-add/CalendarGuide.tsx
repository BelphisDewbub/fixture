"use client";

import { useState } from "react";

type Tab = "google" | "apple" | "outlook" | "other";

const TABS: { id: Tab; label: string }[] = [
  { id: "google", label: "Google Calendar" },
  { id: "apple", label: "Apple Calendar" },
  { id: "outlook", label: "Outlook" },
  { id: "other", label: "Other apps" },
];

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700 mt-0.5">
        {n}
      </span>
      <p className="text-sm text-zinc-700 leading-relaxed">{children}</p>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
      <span className="text-amber-500 text-base shrink-0">⚠</span>
      <p className="text-sm text-amber-800 leading-relaxed">{children}</p>
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
      <span className="text-blue-400 text-base shrink-0">💡</span>
      <p className="text-sm text-blue-800 leading-relaxed">{children}</p>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
      {children}
    </h3>
  );
}

function GoogleTab() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <SectionHeading>On a computer (required first step)</SectionHeading>
        <div className="space-y-3">
          <Step n={1}>
            Go to{" "}
            <strong className="font-semibold text-zinc-900">calendar.google.com</strong>{" "}
            in your browser and sign in.
          </Step>
          <Step n={2}>
            In the left sidebar, find <strong className="font-semibold text-zinc-900">Other calendars</strong> and
            click the <strong className="font-semibold text-zinc-900">+</strong> button next to it.
          </Step>
          <Step n={3}>
            Select <strong className="font-semibold text-zinc-900">From URL</strong>.
          </Step>
          <Step n={4}>
            Paste your Fixture feed URL into the box and click{" "}
            <strong className="font-semibold text-zinc-900">Add calendar</strong>.
          </Step>
        </div>
        <Tip>
          Your feed URL starts with <code className="font-mono bg-zinc-100 px-1 rounded text-xs">webcal://</code> — paste it exactly as copied from Fixture.
        </Tip>
      </div>

      <div className="space-y-4">
        <SectionHeading>On your phone (Google Calendar app)</SectionHeading>
        <Note>
          The Google Calendar mobile app doesn&apos;t let you add new calendar
          subscriptions directly. You must subscribe on a computer first (steps
          above), then the calendar will sync to your phone automatically.
        </Note>
        <div className="space-y-3">
          <Step n={1}>
            Complete the computer steps above. The calendar usually appears on
            your phone within a few minutes.
          </Step>
          <Step n={2}>
            Open the Google Calendar app and tap the{" "}
            <strong className="font-semibold text-zinc-900">☰ menu</strong> in the
            top-left corner.
          </Step>
          <Step n={3}>
            Scroll down to find your new Fixture calendar listed under{" "}
            <strong className="font-semibold text-zinc-900">Other calendars</strong>.
            Tap it to make sure it&apos;s checked.
          </Step>
          <Step n={4}>
            If it doesn&apos;t appear yet, pull down on the calendar view to
            refresh, or wait a few minutes and check again.
          </Step>
        </div>
      </div>
    </div>
  );
}

function AppleTab() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <SectionHeading>On iPhone or iPad</SectionHeading>
        <div className="space-y-3">
          <Step n={1}>
            Copy your Fixture feed URL from the Subscribe button.
          </Step>
          <Step n={2}>
            Open the <strong className="font-semibold text-zinc-900">Settings</strong> app,
            scroll down and tap <strong className="font-semibold text-zinc-900">Calendar</strong>.
          </Step>
          <Step n={3}>
            Tap <strong className="font-semibold text-zinc-900">Accounts</strong> →{" "}
            <strong className="font-semibold text-zinc-900">Add Account</strong> →{" "}
            <strong className="font-semibold text-zinc-900">Other</strong>.
          </Step>
          <Step n={4}>
            Tap <strong className="font-semibold text-zinc-900">Add Subscribed Calendar</strong>,
            paste your URL, and tap <strong className="font-semibold text-zinc-900">Next</strong>.
          </Step>
          <Step n={5}>
            Tap <strong className="font-semibold text-zinc-900">Save</strong>. Games
            will now appear in your Calendar app.
          </Step>
        </div>
        <Tip>
          Alternatively, tap the <strong className="font-semibold text-zinc-900">Apple Calendar</strong> button
          in the Subscribe panel — if your phone asks to open it in Calendar, just tap{" "}
          <strong className="font-semibold text-zinc-900">Subscribe</strong>.
        </Tip>
      </div>

      <div className="space-y-4">
        <SectionHeading>On a Mac</SectionHeading>
        <div className="space-y-3">
          <Step n={1}>
            Open the <strong className="font-semibold text-zinc-900">Calendar</strong> app.
          </Step>
          <Step n={2}>
            In the menu bar, click{" "}
            <strong className="font-semibold text-zinc-900">File</strong> →{" "}
            <strong className="font-semibold text-zinc-900">New Calendar Subscription…</strong>
          </Step>
          <Step n={3}>
            Paste your feed URL and click{" "}
            <strong className="font-semibold text-zinc-900">Subscribe</strong>.
          </Step>
          <Step n={4}>
            Choose how often to refresh (every hour is fine) and click{" "}
            <strong className="font-semibold text-zinc-900">OK</strong>.
          </Step>
        </div>
        <Tip>
          Enable <strong className="font-semibold text-zinc-900">iCloud</strong> sync on that screen to
          have the calendar appear on all your Apple devices automatically.
        </Tip>
      </div>
    </div>
  );
}

function OutlookTab() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <SectionHeading>Outlook on the web (Outlook.com or Microsoft 365)</SectionHeading>
        <div className="space-y-3">
          <Step n={1}>
            Go to <strong className="font-semibold text-zinc-900">outlook.live.com</strong> or
            your Microsoft 365 calendar and sign in.
          </Step>
          <Step n={2}>
            Click <strong className="font-semibold text-zinc-900">Add calendar</strong> in
            the left sidebar.
          </Step>
          <Step n={3}>
            Select <strong className="font-semibold text-zinc-900">Subscribe from web</strong>.
          </Step>
          <Step n={4}>
            Paste your feed URL and give the calendar a name, then click{" "}
            <strong className="font-semibold text-zinc-900">Import</strong>.
          </Step>
        </div>
      </div>

      <div className="space-y-4">
        <SectionHeading>Outlook desktop app (Windows or Mac)</SectionHeading>
        <div className="space-y-3">
          <Step n={1}>
            Open Outlook and switch to the{" "}
            <strong className="font-semibold text-zinc-900">Calendar</strong> view.
          </Step>
          <Step n={2}>
            In the ribbon at the top, click{" "}
            <strong className="font-semibold text-zinc-900">Open Calendar</strong> →{" "}
            <strong className="font-semibold text-zinc-900">From Internet…</strong>
          </Step>
          <Step n={3}>
            Paste your feed URL and click{" "}
            <strong className="font-semibold text-zinc-900">OK</strong>, then{" "}
            <strong className="font-semibold text-zinc-900">Yes</strong> when asked
            to add it.
          </Step>
        </div>
        <Note>
          In newer versions of the Outlook desktop app, the menu may say{" "}
          <strong className="font-semibold text-zinc-900">Add calendar</strong> instead
          of <strong className="font-semibold text-zinc-900">Open Calendar</strong>. Look
          for a similar &quot;From internet / From URL&quot; option.
        </Note>
      </div>
    </div>
  );
}

function OtherTab() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-600 leading-relaxed">
        Any calendar app that supports <strong className="font-semibold text-zinc-900">ICS subscriptions</strong> or{" "}
        <strong className="font-semibold text-zinc-900">webcal:// URLs</strong> will work with Fixture. Look for
        an option like:
      </p>
      <ul className="space-y-2">
        {[
          "Subscribe to calendar",
          "Add calendar from URL",
          "Import from internet",
          "Add ICS feed",
          "Add webcal subscription",
        ].map((label) => (
          <li key={label} className="flex items-center gap-2 text-sm text-zinc-700">
            <span className="text-green-500 font-bold">✓</span>
            {label}
          </li>
        ))}
      </ul>
      <Tip>
        When asked for a URL, paste your Fixture feed URL exactly as shown — it starts
        with <code className="font-mono bg-zinc-100 px-1 rounded text-xs">webcal://</code>.
        Some apps may also accept it starting with{" "}
        <code className="font-mono bg-zinc-100 px-1 rounded text-xs">https://</code> if webcal
        doesn&apos;t work.
      </Tip>
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-2">
        <p className="text-sm font-semibold text-zinc-800">Popular apps that work</p>
        <div className="flex flex-wrap gap-2">
          {[
            "Fantastical",
            "Cron",
            "Calendars 5",
            "Proton Calendar",
            "Thunderbird",
            "Samsung Calendar",
            "Notion Calendar",
          ].map((app) => (
            <span
              key={app}
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600"
            >
              {app}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const TAB_CONTENT: Record<Tab, React.ReactNode> = {
  google: <GoogleTab />,
  apple: <AppleTab />,
  outlook: <OutlookTab />,
  other: <OtherTab />,
};

export function CalendarGuide() {
  const [active, setActive] = useState<Tab>("google");

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-b border-zinc-200 mb-8">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`shrink-0 px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              active === id
                ? "border-green-600 text-green-700"
                : "border-transparent text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>{TAB_CONTENT[active]}</div>
    </div>
  );
}
