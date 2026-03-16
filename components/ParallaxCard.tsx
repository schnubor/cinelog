'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import Tilt from 'react-parallax-tilt';
import { posterUrl } from '@/lib/tmdb-image';
import { Rating } from './RatingStars';
import type { Movie, LogEntry } from '@/types';
import styles from './ParallaxCard.module.css';

function useGyroscopePermission() {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    // Non-iOS browsers don't need permission
    const doe = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof doe.requestPermission !== 'function') {
      setGranted(true);
    }
  }, []);

  const request = useCallback(async () => {
    const doe = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof doe.requestPermission === 'function') {
      try {
        const result = await doe.requestPermission();
        if (result === 'granted') setGranted(true);
      } catch {
        // User denied or error
      }
    } else {
      setGranted(true);
    }
  }, []);

  return { granted, request };
}

interface ParallaxCardProps {
  movie: Movie;
  logEntry?: LogEntry;
  foregroundUrl?: string | null;
}

const DEPTHS_WITH_FG = [0, 1.2, 2.5];
const DEPTHS_NO_FG = [0, 1.5];

function formatWatchedDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function useIsMobile(breakpoint = 600) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [breakpoint]);
  return isMobile;
}

export function ParallaxCard({ movie, logEntry, foregroundUrl }: ParallaxCardProps) {
  const bgUrl = posterUrl(movie.poster_path!, 'w780');
  const year = movie.release_date?.slice(0, 4) || '';
  const isMobile = useIsMobile();
  const gyroscope = useGyroscopePermission();

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
      <Tilt
        className={styles.tilt}
        tiltMaxAngleX={isMobile ? 0 : 15}
        tiltMaxAngleY={15}
        perspective={800}
        scale={1.02}
        transitionSpeed={1200}
        gyroscope={gyroscope.granted}
        glareEnable={true}
        glareMaxOpacity={0.25}
        glareColor="#ffffff"
        glarePosition="all"
        glareBorderRadius="16px"
        onMove={handleMove}
        onLeave={handleLeave}
      >
        <div className={styles.card} onClick={() => { if (!gyroscope.granted) gyroscope.request(); }}>
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
                <Rating
                  value={logEntry.ratingPartner != null
                    ? (logEntry.rating + logEntry.ratingPartner) / 2
                    : logEntry.rating}
                  readOnly
                  size={15}
                  tooltip={logEntry.ratingPartner != null
                    ? `Him: ${logEntry.rating.toFixed(1)}  ·  Her: ${logEntry.ratingPartner.toFixed(1)}`
                    : undefined}
                />
              ) : (
                <div className={styles.tmdbRating}>
                  <span className={styles.starIcon}>★</span> {movie.vote_average.toFixed(1)}
                </div>
              )}
            </div>
            {logEntry?.watchedAt && (
              <span className={styles.watchedAt}>
                Watched {formatWatchedDate(logEntry.watchedAt)}
              </span>
            )}
          </div>
        </div>
      </Tilt>
    </div>
  );
}
