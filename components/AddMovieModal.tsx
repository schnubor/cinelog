'use client';

import { useState } from 'react';
import { Rating } from './RatingStars';
import { posterUrl } from '@/lib/tmdb-image';
import type { Movie, LogEntry } from '@/types';
import styles from './AddMovieModal.module.css';

export interface MovieFormData {
  rating: number;
  comment: string;
  ratingPartner: number | null;
  commentPartner: string;
  watchedAt: string | null;
}

interface AddMovieModalProps {
  movie: Movie;
  /** Pre-fill for edit mode */
  existing?: LogEntry;
  onSubmit: (movie: Movie, data: MovieFormData) => void | Promise<void>;
  onCancel: () => void;
}

export function AddMovieModal({ movie, existing, onSubmit, onCancel }: AddMovieModalProps) {
  const isEdit = !!existing;
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [comment, setComment] = useState(existing?.comment ?? '');
  const [ratingPartner, setRatingPartner] = useState(existing?.ratingPartner ?? 0);
  const [commentPartner, setCommentPartner] = useState(existing?.commentPartner ?? '');
  const [watchedAt, setWatchedAt] = useState(existing?.watchedAt ?? '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitting(true);
    try {
      await onSubmit(movie, {
        rating,
        comment: comment.trim(),
        ratingPartner: ratingPartner > 0 ? ratingPartner : null,
        commentPartner: commentPartner.trim(),
        watchedAt: watchedAt || null,
      });
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
            Watched on <span className={styles.optional}>(optional)</span>
            <input
              type="date"
              className={styles.dateInput}
              value={watchedAt}
              onChange={(e) => setWatchedAt(e.target.value)}
            />
          </label>

          <div className={styles.ratingColumns}>
            <div className={styles.ratingColumn}>
              <span className={styles.personLabel}>Him</span>
              <label className={styles.label}>
                Rating
                <Rating value={rating} onChange={setRating} />
                {rating === 0 && <span className={styles.required}>Pick a rating</span>}
              </label>
              <label className={styles.label}>
                Comment <span className={styles.optional}>(optional)</span>
                <textarea
                  className={styles.textarea}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did he think?"
                  rows={2}
                />
              </label>
            </div>

            <div className={styles.divider} />

            <div className={styles.ratingColumn}>
              <span className={styles.personLabel}>Her</span>
              <label className={styles.label}>
                Rating <span className={styles.optional}>(optional)</span>
                <Rating value={ratingPartner} onChange={setRatingPartner} />
              </label>
              <label className={styles.label}>
                Comment <span className={styles.optional}>(optional)</span>
                <textarea
                  className={styles.textarea}
                  value={commentPartner}
                  onChange={(e) => setCommentPartner(e.target.value)}
                  placeholder="What did she think?"
                  rows={2}
                />
              </label>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className={styles.addBtn} disabled={rating === 0 || submitting}>
              {submitting ? (isEdit ? 'Saving...' : 'Adding...') : (isEdit ? 'Save Changes' : 'Add to Log')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
