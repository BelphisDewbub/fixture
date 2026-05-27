# Fixture

Subscribe to sports teams and tournaments. Get automatic calendar invites for every game — in Google Calendar, Apple Calendar, Outlook, or any iCalendar-compatible app.

## How it works

1. Find your team or tournament on [fixture.app](https://fixture.app)
2. Click **Subscribe** to get a live calendar feed URL
3. Paste it into your calendar app once — games sync automatically

Feed URLs follow the pattern:
```
webcal://fixture.app/cal/chicago-fire
webcal://fixture.app/cal/world-cup-2026
```

Events include the kickoff time (with timezone), venue, and where to stream.

## Tech stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Calendar feeds**: iCalendar (`.ics`) format via `ical-generator`
- **Sports data**: football-data.org, TheSportsDB

## Project structure

```
src/
├── app/
│   ├── api/
│   │   └── cal/[slug]/   # Live ICS feed endpoints
│   └── ...               # Web frontend pages
├── lib/
│   ├── sports/           # Sports API clients + data normalization
│   └── ics/              # ICS feed generation
└── types/                # Shared TypeScript types
```

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

```env
SPORTS_API_KEY=        # football-data.org API key
SPORTSDB_API_KEY=      # TheSportsDB API key (optional, free tier available)
```
