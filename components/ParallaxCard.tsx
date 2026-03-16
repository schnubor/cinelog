'use client';

import { useRef, useCallback } from 'react';
import Tilt from 'react-parallax-tilt';
import { posterUrl } from '@/lib/tmdb-image';
import { Rating } from './RatingStars';
import type { Movie, LogEntry } from '@/types';
import styles from './ParallaxCard.module.css';

interface ParallaxCardProps {
  movie: Movie;
  logEntry?: LogEntry;
  foregroundUrl?: string | null;
  backLabel?: string;
  onBack: () => void;
}

const DEPTHS_WITH_FG = [0, 1.2, 2.5];
const DEPTHS_NO_FG = [0, 1.5];

export function ParallaxCard({ movie, logEntry, foregroundUrl, backLabel = 'Back', onBack }: ParallaxCardProps) {
  const bgUrl = posterUrl(movie.poster_path!, 'w780');
  const year = movie.release_date?.slice(0, 4) || '';

  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const depths = foregroundUrl ? DEPTHS_WITH_FG : DEPTHS_NO_FG;

  const setLayerRef = (index: number) => (el: HTMLDivElement | null) => {
    layerRefs.current[index] = el;
  };

  const handleMove = useCallback(({ tiltAngleX, tiltAngleY }: { tiltAngleX: number; tiltAngleY: number }) => {
    layerRefs.current.forEach((el, i) => {
      if (!el) return;
      const d = depths[i] ?? 0;
      el.style.transform = `translate(${tiltAngleY * d * -0.6}px, ${tiltAngleX * d * 0.6}px)`;
    });
  }, [depths]);

  const handleLeave = useCallback(() => {
    layerRefs.current.forEach((el) => {
      if (!el) return;
      el.style.transform = 'translate(0px, 0px)';
    });
  }, []);

  return (
    <div className={styles.container}>
      <button className={styles.back} onClick={onBack}>
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
          <line x1="14" y1="10" x2="6" y2="10" />
          <polyline points="10,4 4,10 10,16" />
        </svg>
        {backLabel}
      </button>

      <Tilt
        className={styles.tilt}
        tiltMaxAngleX={15}
        tiltMaxAngleY={15}
        perspective={800}
        scale={1.02}
        transitionSpeed={1200}
        gyroscope={true}
        glareEnable={true}
        glareMaxOpacity={0.25}
        glareColor="#ffffff"
        glarePosition="all"
        glareBorderRadius="16px"
        onMove={handleMove}
        onLeave={handleLeave}
      >
        <div className={styles.card}>
          {foregroundUrl ? (
            <>
              <div ref={setLayerRef(0)} className={styles.layer}>
                <img src={bgUrl} alt="" className={styles.bgImage} style={{ filter: 'blur(3px) brightness(0.6)' }} />
              </div>
              <div ref={setLayerRef(1)} className={styles.layer}>
                <img src={bgUrl} alt="" className={styles.bgImage} style={{ filter: 'brightness(0.8)' }} />
              </div>
              <div ref={setLayerRef(2)} className={styles.layer}>
                <img src={foregroundUrl} alt="" className={styles.fgImage} />
              </div>
            </>
          ) : (
            <>
              <div ref={setLayerRef(0)} className={styles.bgLayer}>
                <img src={bgUrl} alt="" className={styles.bgImage} />
              </div>
              <div ref={setLayerRef(1)} className={styles.layer}>
                <img src={bgUrl} alt="" className={styles.bgImage} />
              </div>
            </>
          )}

          <div className={styles.titleOverlay}>
            <h2 className={styles.movieTitle}>{movie.title}</h2>
            <div className={styles.meta}>
              {year && <span className={styles.movieYear}>{year}</span>}
              {logEntry ? (
                <Rating value={logEntry.rating} readOnly size={15} />
              ) : (
                <div className={styles.tmdbRating}>
                  <span className={styles.starIcon}>★</span> {movie.vote_average.toFixed(1)}
                </div>
              )}
            </div>
            {logEntry?.comment && (
              <p className={styles.comment}>"{logEntry.comment}"</p>
            )}
          </div>
        </div>
      </Tilt>

      <p className={styles.hint}>Move your mouse over the card (or tilt your phone)</p>
    </div>
  );
}
