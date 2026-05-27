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
  kickoff: Date;
  venue?: string;
  competition: string;
  broadcastInfo?: BroadcastInfo;
}

export interface BroadcastInfo {
  networks: string[];
  streamingServices: string[];
  leagueUrl?: string;
}

export type SubscriptionTarget = Team | Tournament;
