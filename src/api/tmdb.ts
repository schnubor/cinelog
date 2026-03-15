import type { Movie, TMDBSearchResponse } from '../types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export function posterUrl(path: string, size: 'w342' | 'w500' | 'w780' | 'original' = 'w500') {
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];

  const params = new URLSearchParams({
    api_key: API_KEY,
    query: query.trim(),
    include_adult: 'false',
  });

  const res = await fetch(`${BASE_URL}/search/movie?${params}`);
  if (!res.ok) throw new Error(`TMDB search failed: ${res.status}`);

  const data: TMDBSearchResponse = await res.json();
  return data.results.filter((m) => m.poster_path);
}

export async function getMovieDetails(id: number): Promise<Movie & { tagline?: string }> {
  const params = new URLSearchParams({ api_key: API_KEY });
  const res = await fetch(`${BASE_URL}/movie/${id}?${params}`);
  if (!res.ok) throw new Error(`TMDB movie details failed: ${res.status}`);
  return res.json();
}
