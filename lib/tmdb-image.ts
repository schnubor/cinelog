const IMAGE_BASE = 'https://image.tmdb.org/t/p';

type PosterSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';

export function posterUrl(path: string, size: PosterSize = 'w342'): string {
  return `${IMAGE_BASE}/${size}${path}`;
}
