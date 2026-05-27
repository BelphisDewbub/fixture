export type Sport = "football" | "basketball" | "american-football" | "baseball" | "hockey";

const BASE_URLS: Record<Sport, string> = {
  football: "https://v3.football.api-sports.io",
  basketball: "https://v1.basketball.api-sports.io",
  "american-football": "https://v1.american-football.api-sports.io",
  baseball: "https://v1.baseball.api-sports.io",
  hockey: "https://v1.hockey.api-sports.io",
};

export interface ASFixture {
  fixture: {
    id: number;
    date: string;
    venue: { id: number | null; name: string; city: string } | null;
    status: { long: string; short: string; elapsed: number | null };
  };
  league: {
    id: number;
    name: string;
    season: number;
    round: string;
  };
  teams: {
    home: { id: number; name: string; logo: string };
    away: { id: number; name: string; logo: string };
  };
}

export interface ASFixturesResponse {
  errors: unknown[];
  results: number;
  response: ASFixture[];
}

export async function fetchFixtures(
  sport: Sport,
  params: Record<string, string | number>
): Promise<ASFixture[]> {
  const apiKey = process.env.API_SPORTS_KEY;
  if (!apiKey) throw new Error("API_SPORTS_KEY is not set");

  const url = new URL(`${BASE_URLS[sport]}/fixtures`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }

  const res = await fetch(url.toString(), {
    headers: { "x-apisports-key": apiKey },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`api-sports error: ${res.status} ${await res.text()}`);
  }

  const data: ASFixturesResponse = await res.json();

  if (Array.isArray(data.errors) && data.errors.length > 0) {
    throw new Error(`api-sports error: ${JSON.stringify(data.errors)}`);
  }

  // api-sports returns errors as an object when the plan restricts access
  if (data.errors && !Array.isArray(data.errors) && Object.keys(data.errors).length > 0) {
    throw new Error(`api-sports error: ${JSON.stringify(data.errors)}`);
  }

  return data.response;
}
