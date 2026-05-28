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

  const dtstamp = formatIcsDate(new Date());

  for (const game of games) {
    const uid = `${game.id}@fixture.app`;
    const dtstart = formatIcsDate(game.kickoff);
    const dtend = formatIcsDate(new Date(game.kickoff.getTime() + 2 * 60 * 60 * 1000));
    const summary = `${game.awayTeam} @ ${game.homeTeam}`;
    const description = buildDescription(game);

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${dtstamp}`);
    lines.push(`DTSTART:${dtstart}`);
    lines.push(`DTEND:${dtend}`);
    lines.push(...fold(`SUMMARY:${escapeIcs(summary)}`));
    lines.push(...fold(`DESCRIPTION:${escapeIcs(description)}`));
    if (game.venue) lines.push(...fold(`LOCATION:${escapeIcs(game.venue)}`));
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

// RFC 5545 §3.1: fold lines longer than 75 octets
function fold(line: string): string[] {
  const out: string[] = [];
  while (line.length > 75) {
    out.push(line.slice(0, 75));
    line = " " + line.slice(75);
  }
  out.push(line);
  return out;
}

function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeIcs(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
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
