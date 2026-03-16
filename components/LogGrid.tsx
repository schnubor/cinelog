'use client';

import { posterUrl } from '@/lib/tmdb-image';
import { Rating } from './RatingStars';
import type { LogEntry } from '@/types';
import styles from './LogGrid.module.css';

interface LogGridProps {
  entries: LogEntry[];
  isOwner: boolean;
  onSelect: (entry: LogEntry) => void;
  onRemove: (id: string) => void;
}

export function LogGrid({ entries, isOwner, onSelect, onRemove }: LogGridProps) {
  if (entries.length === 0) {
    return (
      <p className={styles.empty}>No movies logged yet.</p>
    );
  }

  return (
    <div className={styles.grid}>
      {entries.map((entry, i) => (
        <div
          key={entry.id}
          className={styles.card}
          style={{ animationDelay: `${i * 50}ms` }}
          onClick={() => onSelect(entry)}
        >
          {isOwner && (
            <button
              className={styles.removeBtn}
              onClick={(e) => {
                e.stopPropagation();
                onRemove(entry.id);
              }}
              title="Remove from log"
            >
              &times;
            </button>
          )}
          <img
            src={posterUrl(entry.movie.poster_path!, 'w342')}
            alt={entry.movie.title}
            className={styles.poster}
            loading="lazy"
          />
          <div className={styles.info}>
            <span className={styles.title}>{entry.movie.title}</span>
            <div className={styles.meta}>
              <span className={styles.year}>
                {entry.movie.release_date?.slice(0, 4) || '\u2014'}
              </span>
              <Rating value={entry.rating} readOnly size={13} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
