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
