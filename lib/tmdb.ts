import 'server-only';
import type { TMDBSearchResponse } from '@/types';

const TMDB_BASE = 'https://api.themoviedb.org/3';

export async function searchMovies(query: string): Promise<TMDBSearchResponse> {
  const res = await fetch(
    `${TMDB_BASE}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
        Accept: 'application/json',
      },
      next: { revalidate: 300 },
    },
  );

  if (!res.ok) {
    throw new Error(`TMDB search failed: ${res.status}`);
  }

  return res.json();
}
