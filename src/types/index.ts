export interface Team {
  slug: string;
  name: string;
  sport: string;
  league: string;
  logoUrl?: string;
}

export interface Tournament {
  slug: string;
  name: string;
  sport: string;
  season: string;
  logoUrl?: string;
}

export interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: string;
  awayScore?: string;
  completed?: boolean;
  kickoff: Date;
  venue?: string;
  competition: string;
  stage?: string;   // ESPN season.slug: "group-stage", "round-of-16", "quarterfinals", etc.
  group?: string;   // group letter: "A", "B", etc. (group stage only)
  broadcastInfo?: BroadcastInfo;
}

export interface BroadcastInfo {
  networks: string[];
  streamingServices: string[];
  leagueUrl?: string;
}

export type SubscriptionTarget = Team | Tournament;
