import 'server-only';
import type { TMDBSearchResponse } from '@/types';

const TMDB_BASE = 'https://api.themoviedb.org/3';

const headers = {
  Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
  Accept: 'application/json',
};

export async function searchMovies(query: string): Promise<TMDBSearchResponse> {
  const res = await fetch(
    `${TMDB_BASE}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
    { headers, next: { revalidate: 300 } },
  );

  if (!res.ok) {
    throw new Error(`TMDB search failed: ${res.status}`);
  }

  return res.json();
}

export async function getTrailerKey(tmdbId: number): Promise<string | null> {
  const res = await fetch(
    `${TMDB_BASE}/movie/${tmdbId}/videos?language=en-US`,
    { headers, next: { revalidate: 3600 } },
  );

  if (!res.ok) return null;

  const data = await res.json() as {
    results: { key: string; site: string; type: string; official: boolean }[];
  };

  // Prefer official YouTube trailers, then any YouTube trailer, then any YouTube video
  const videos = data.results.filter((v) => v.site === 'YouTube');
  const trailer =
    videos.find((v) => v.type === 'Trailer' && v.official) ??
    videos.find((v) => v.type === 'Trailer') ??
    videos.find((v) => v.type === 'Teaser') ??
    videos[0];

  return trailer?.key ?? null;
}
