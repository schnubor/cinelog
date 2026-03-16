'use client';

import { useState } from 'react';
import { Rating } from './RatingStars';
import { posterUrl } from '@/lib/tmdb-image';
import type { Movie } from '@/types';
import styles from './AddMovieModal.module.css';

interface AddMovieModalProps {
  movie: Movie;
  onAdd: (movie: Movie, rating: number, comment: string) => void | Promise<void>;
  onCancel: () => void;
}

export function AddMovieModal({ movie, onAdd, onCancel }: AddMovieModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitting(true);
    try {
      await onAdd(movie, rating, comment.trim());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.movieInfo}>
          {movie.poster_path && (
            <img
              src={posterUrl(movie.poster_path, 'w154')}
              alt={movie.title}
              className={styles.poster}
            />
          )}
          <div className={styles.details}>
            <h3 className={styles.title}>{movie.title}</h3>
            <span className={styles.year}>{movie.release_date?.slice(0, 4)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Your rating
            <Rating value={rating} onChange={setRating} />
            {rating === 0 && <span className={styles.required}>Pick a rating</span>}
          </label>

          <label className={styles.label}>
            Comment <span className={styles.optional}>(optional)</span>
            <textarea
              className={styles.textarea}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you think?"
              rows={3}
            />
          </label>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className={styles.addBtn} disabled={rating === 0 || submitting}>
              {submitting ? 'Adding...' : 'Add to Log'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
