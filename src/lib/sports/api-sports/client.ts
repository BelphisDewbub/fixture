export type Sport = "football" | "basketball" | "american-football" | "baseball" | "hockey";

const BASE_URLS: Record<Sport, string> = {
  football: "https://v3.football.api-sports.io",
  basketball: "https://v1.basketball.api-sports.io",
  "american-football": "https://v1.american-football.api-sports.io",
  baseball: "https://v1.baseball.api-sports.io",
  hockey: "https://v1.hockey.api-sports.io",
};

// football uses /fixtures; all other sports use /games
const ENDPOINTS: Record<Sport, string> = {
  football: "fixtures",
  basketball: "games",
  "american-football": "games",
  baseball: "games",
  hockey: "games",
};

interface ASResponse<T> {
  errors: unknown[] | Record<string, string>;
  results: number;
  response: T[];
}

export async function fetchGames<T>(
  sport: Sport,
  params: Record<string, string | number>
): Promise<T[]> {
  const apiKey = process.env.API_SPORTS_KEY;
  if (!apiKey) throw new Error("API_SPORTS_KEY is not set");

  const url = new URL(`${BASE_URLS[sport]}/${ENDPOINTS[sport]}`);
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

  const data: ASResponse<T> = await res.json();

  const errors = data.errors;
  const hasErrors = Array.isArray(errors) ? errors.length > 0 : Object.keys(errors).length > 0;
  if (hasErrors) {
    throw new Error(`api-sports error: ${JSON.stringify(errors)}`);
  }

  return data.response;
}
