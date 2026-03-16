export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
}

export interface TMDBSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface PosterLayers {
  background: string; // original poster URL
  foreground: string | null; // segmented foreground (transparent bg)
  title: string;
  year: string;
  tagline?: string;
}

export interface LogEntry {
  id: string;
  movie: Movie;
  rating: number;              // 1.0–10.0
  comment: string;             // optional, empty string if none
  ratingPartner: number | null; // 1.0–10.0, null if not rated
  commentPartner: string;       // optional, empty string if none
  watchedAt: string | null;    // ISO date string (date only, e.g. "2026-03-15")
  loggedAt: string;            // ISO date string
}
