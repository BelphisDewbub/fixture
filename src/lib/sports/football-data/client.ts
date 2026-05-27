const BASE_URL = "https://api.football-data.org/v4";

export interface FDTeam {
  id: number;
  name: string;
  shortName: string;
  crest: string;
}

export interface FDMatch {
  id: number;
  utcDate: string;
  status: "TIMED" | "SCHEDULED" | "LIVE" | "IN_PLAY" | "PAUSED" | "FINISHED" | "POSTPONED" | "CANCELLED";
  stage: string;
  group: string | null;
  homeTeam: FDTeam;
  awayTeam: FDTeam;
  venue: string | null;
  competition: { id: number; name: string; code: string };
}

export interface FDMatchesResponse {
  matches: FDMatch[];
}

export async function fetchCompetitionMatches(
  competitionCode: string,
  options: { status?: string } = {}
): Promise<FDMatch[]> {
  const apiKey = process.env.SPORTS_API_KEY;
  if (!apiKey) throw new Error("SPORTS_API_KEY is not set");

  const url = new URL(`${BASE_URL}/competitions/${competitionCode}/matches`);
  if (options.status) url.searchParams.set("status", options.status);

  const res = await fetch(url.toString(), {
    headers: { "X-Auth-Token": apiKey },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`football-data.org error: ${res.status} ${await res.text()}`);
  }

  const data: FDMatchesResponse = await res.json();
  return data.matches;
}
