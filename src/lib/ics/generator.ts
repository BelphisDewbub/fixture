import type { Game } from "@/types";

export function generateIcsFeed(games: Game[], calendarName: string): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Fixture//EN",
    `X-WR-CALNAME:${calendarName}`,
    "X-WR-TIMEZONE:UTC",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "REFRESH-INTERVAL;VALUE=DURATION:PT6H",
    "X-PUBLISHED-TTL:PT6H",
  ];

  for (const game of games) {
    const uid = `${game.id}@fixture.app`;
    const dtstart = formatIcsDate(game.kickoff);
    const dtend = formatIcsDate(new Date(game.kickoff.getTime() + 2 * 60 * 60 * 1000));
    const summary = `${game.awayTeam} @ ${game.homeTeam}`;
    const description = buildDescription(game);

    lines.push(
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTART:${dtstart}`,
      `DTEND:${dtend}`,
      `SUMMARY:${escapeIcs(summary)}`,
      `DESCRIPTION:${escapeIcs(description)}`,
      game.venue ? `LOCATION:${escapeIcs(game.venue)}` : "",
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return lines.filter(Boolean).join("\r\n");
}

function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeIcs(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function buildDescription(game: Game): string {
  const parts = [`${game.competition}`];
  if (game.broadcastInfo) {
    const { networks, streamingServices } = game.broadcastInfo;
    if (networks.length) parts.push(`TV: ${networks.join(", ")}`);
    if (streamingServices.length) parts.push(`Stream: ${streamingServices.join(", ")}`);
    if (game.broadcastInfo.leagueUrl) parts.push(`More info: ${game.broadcastInfo.leagueUrl}`);
  }
  return parts.join("\n");
}
