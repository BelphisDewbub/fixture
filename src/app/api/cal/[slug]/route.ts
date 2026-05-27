import { NextRequest, NextResponse } from "next/server";
import { getGamesBySlug } from "@/lib/sports";
import { generateIcsFeed } from "@/lib/ics/generator";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const games = await getGamesBySlug(slug);

  if (!games.length) {
    return NextResponse.json({ error: "No schedule found for this slug." }, { status: 404 });
  }

  const calendarName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const ics = generateIcsFeed(games, `Fixture — ${calendarName}`);

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.ics"`,
      "Cache-Control": "public, max-age=21600", // 6 hours
    },
  });
}
