'use client';

import type { Movie } from '@/types';
import { posterUrl } from '@/lib/tmdb-image';
import styles from './MovieGrid.module.css';

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export function MovieGrid({ movies, onSelect }: MovieGridProps) {
  if (movies.length === 0) return null;

  return (
    <div className={styles.grid}>
      {movies.map((movie, i) => (
        <button
          key={movie.id}
          className={styles.card}
          onClick={() => onSelect(movie)}
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <img
            src={posterUrl(movie.poster_path!, 'w342')}
            alt={movie.title}
            className={styles.poster}
            loading="lazy"
          />
          <div className={styles.info}>
            <span className={styles.title}>{movie.title}</span>
            <span className={styles.year}>
              {movie.release_date?.slice(0, 4) || '—'}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
