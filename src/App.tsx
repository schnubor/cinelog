import { useState, useEffect, useCallback } from 'react';
import { SearchBar } from './components/SearchBar';
import { MovieGrid } from './components/MovieGrid';
import { ParallaxCard } from './components/ParallaxCard';
import { searchMovies } from './api/tmdb';
import { removeBackground } from './api/removeBackground';
import { useDebounce } from './hooks/useDebounce';
import type { Movie } from './types';
import styles from './App.module.css';

function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [foregroundUrl, setForegroundUrl] = useState<string | null>(null);
  const [processingLayers, setProcessingLayers] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery) {
      setMovies([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    searchMovies(debouncedQuery)
      .then((results) => {
        if (!cancelled) setMovies(results);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [debouncedQuery]);

  const handleSelect = useCallback(async (movie: Movie) => {
    setSelectedMovie(movie);
    setForegroundUrl(null);
    setProcessingLayers(true);

    try {
      const bgUrl = `https://image.tmdb.org/t/p/w780${movie.poster_path}`;
      const fg = await removeBackground(bgUrl);
      setForegroundUrl(fg);
    } catch {
      // Silently fall back to single-layer mode
    } finally {
      setProcessingLayers(false);
    }
  }, []);

  const handleBack = useCallback(() => {
    if (foregroundUrl) URL.revokeObjectURL(foregroundUrl);
    setSelectedMovie(null);
    setForegroundUrl(null);
  }, [foregroundUrl]);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.logo}>
          Paratilt
        </h1>
        <p className={styles.tagline}>
          Turn any movie poster into a 3D parallax card
        </p>
      </header>

      <main className={styles.main}>
        {selectedMovie ? (
          <>
            {processingLayers && (
              <p className={styles.processing}>Splitting layers...</p>
            )}
            <ParallaxCard
              movie={selectedMovie}
              foregroundUrl={foregroundUrl}
              onBack={handleBack}
            />
          </>
        ) : (
          <>
            <SearchBar value={query} onChange={setQuery} loading={loading} />
            <MovieGrid movies={movies} onSelect={handleSelect} />
            {!query && (
              <p className={styles.empty}>
                Search for a movie to get started
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
