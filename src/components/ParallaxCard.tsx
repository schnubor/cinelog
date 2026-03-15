import Tilt from 'react-parallax-tilt';
import { posterUrl } from '../api/tmdb';
import type { Movie } from '../types';
import styles from './ParallaxCard.module.css';

interface ParallaxCardProps {
  movie: Movie;
  foregroundUrl: string | null;
  onBack: () => void;
}

export function ParallaxCard({ movie, foregroundUrl, onBack }: ParallaxCardProps) {
  const bgUrl = posterUrl(movie.poster_path!, 'w780');
  const year = movie.release_date?.slice(0, 4) || '';

  return (
    <div className={styles.container}>
      <button className={styles.back} onClick={onBack}>
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
          <line x1="14" y1="10" x2="6" y2="10" />
          <polyline points="10,4 4,10 10,16" />
        </svg>
        Back to search
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
      >
        <div className={styles.card}>
          {/* Layer 0: Background — no depth offset */}
          <div className={styles.layer} style={{ transform: 'translateZ(0px)' }}>
            <img
              src={bgUrl}
              alt=""
              className={styles.bgImage}
              style={foregroundUrl ? { filter: 'blur(2px) brightness(0.7)' } : undefined}
            />
          </div>

          {/* Layer 1: Foreground subject — floats closer */}
          {foregroundUrl && (
            <div className={styles.layer} style={{ transform: 'translateZ(40px)' }}>
              <img src={foregroundUrl} alt="" className={styles.fgImage} />
            </div>
          )}

          {/* Layer 2: Title text overlay — closest to viewer */}
          <div
            className={styles.layer}
            style={{ transform: `translateZ(${foregroundUrl ? 60 : 40}px)` }}
          >
            <div className={styles.titleOverlay}>
              <h2 className={styles.movieTitle}>{movie.title}</h2>
              {year && <span className={styles.movieYear}>{year}</span>}
              <div className={styles.rating}>
                <span className={styles.star}>★</span> {movie.vote_average.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </Tilt>

      <p className={styles.hint}>Move your mouse over the card (or tilt your phone)</p>
    </div>
  );
}
