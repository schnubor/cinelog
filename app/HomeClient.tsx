"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { LogGrid } from "@/components/LogGrid";
import { SearchBar } from "@/components/SearchBar";
import { MovieGrid } from "@/components/MovieGrid";
import { AddMovieModal } from "@/components/AddMovieModal";
import type { MovieFormData } from "@/components/AddMovieModal";
import { useDebounce } from "@/hooks/useDebounce";
import type { Movie, LogEntry, TMDBSearchResponse } from "@/types";
import styles from "./page.module.css";

interface HomeClientProps {
    initialEntries: LogEntry[];
    isOwner: boolean;
    userId?: string;
}

type View = "log" | "add";

export function HomeClient({
    initialEntries,
    isOwner,
    userId,
}: HomeClientProps) {
    const router = useRouter();
    const [entries, setEntries] = useState<LogEntry[]>(initialEntries);
    const [view, setView] = useState<View>("log");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Movie[]>([]);
    const [searching, setSearching] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const debouncedQuery = useDebounce(query, 350);

    // Search TMDB via our API route
    const searchMovies = useCallback(async (q: string) => {
        if (!q.trim()) {
            setResults([]);
            return;
        }
        setSearching(true);
        try {
            const res = await fetch(
                `/api/tmdb/search?query=${encodeURIComponent(q)}`,
            );
            const data: TMDBSearchResponse = await res.json();
            setResults(data.results?.filter((m) => m.poster_path) ?? []);
        } catch {
            setResults([]);
        } finally {
            setSearching(false);
        }
    }, []);

    // Trigger search when debounced query changes
    useState(() => {
        if (view === "add") {
            searchMovies(debouncedQuery);
        }
    });

    // We need useEffect for debounced search
    const [prevQuery, setPrevQuery] = useState("");
    if (debouncedQuery !== prevQuery && view === "add") {
        setPrevQuery(debouncedQuery);
        searchMovies(debouncedQuery);
    }

    const handleAdd = useCallback(
        async (movie: Movie, data: MovieFormData) => {
            if (!isSupabaseConfigured || !userId) return;
            const supabase = createClient();
            const { data: row, error } = await supabase
                .from("log_entries")
                .insert({
                    user_id: userId,
                    tmdb_id: movie.id,
                    movie_data: movie as unknown as Record<string, unknown>,
                    rating: data.rating,
                    comment: data.comment,
                    rating_partner: data.ratingPartner,
                    comment_partner: data.commentPartner,
                    watched_at: data.watchedAt,
                })
                .select()
                .single();

            if (error) throw error;

            const r = row as unknown as {
                id: string;
                movie_data: Record<string, unknown>;
                rating: number;
                comment: string;
                rating_partner: number | null;
                comment_partner: string;
                watched_at: string | null;
                logged_at: string;
            };

            const entry: LogEntry = {
                id: r.id,
                movie: r.movie_data as unknown as Movie,
                rating: r.rating,
                comment: r.comment,
                ratingPartner: r.rating_partner,
                commentPartner: r.comment_partner,
                watchedAt: r.watched_at,
                loggedAt: r.logged_at,
            };

            setEntries((prev) => [entry, ...prev]);
            setSelectedMovie(null);
            setView("log");
            setQuery("");
            setResults([]);
        },
        [userId],
    );

    const handleRemove = useCallback(async (id: string) => {
        if (!isSupabaseConfigured) return;
        const supabase = createClient();
        const { error } = await supabase
            .from("log_entries")
            .delete()
            .eq("id", id);
        if (error) throw error;
        setEntries((prev) => prev.filter((e) => e.id !== id));
    }, []);

    const handleLogout = useCallback(async () => {
        if (!isSupabaseConfigured) return;
        const supabase = createClient();
        await supabase.auth.signOut();
        router.refresh();
    }, [router]);

    // Add movie view
    if (view === "add") {
        return (
            <div className={styles.app}>
                <header className={styles.header}>
                    <div className={styles.headerTop}>
                        <h1 className={styles.logo}>Cinelog</h1>
                    </div>
                    <p className={styles.tagline}>
                        Films we watched in cinema in 2026
                    </p>
                </header>

                <main className={styles.main}>
                    <div className={styles.addMoviePanel}>
                        <button
                            className={styles.backBtn}
                            onClick={() => {
                                setView("log");
                                setQuery("");
                                setResults([]);
                            }}
                        >
                            <svg
                                viewBox="0 0 20 20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                width="14"
                                height="14"
                            >
                                <line x1="14" y1="10" x2="6" y2="10" />
                                <polyline points="10,4 4,10 10,16" />
                            </svg>
                            Back to log
                        </button>
                        <SearchBar
                            value={query}
                            onChange={setQuery}
                            loading={searching}
                        />
                        <MovieGrid
                            movies={results}
                            onSelect={(movie) => setSelectedMovie(movie)}
                        />
                    </div>
                </main>

                {selectedMovie && (
                    <AddMovieModal
                        movie={selectedMovie}
                        onSubmit={handleAdd}
                        onCancel={() => setSelectedMovie(null)}
                    />
                )}
            </div>
        );
    }

    // Default: log view
    return (
        <div className={styles.app}>
            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <h1 className={styles.logo}>Cinelog</h1>
                    <div className={styles.headerActions}>
                        {isOwner && (
                            <>
                                <button
                                    className={styles.addBtn}
                                    onClick={() => setView("add")}
                                >
                                    + Add film
                                </button>
                                <button
                                    className={styles.authBtn}
                                    onClick={handleLogout}
                                >
                                    Sign out
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <p className={styles.tagline}>
                    Films we watched in cinema in 2026
                </p>
            </header>

            <main className={styles.main}>
                <LogGrid
                    entries={entries}
                    isOwner={isOwner}
                    onSelect={(entry) => router.push(`/movie/${entry.id}`)}
                    onRemove={handleRemove}
                />
            </main>
        </div>
    );
}
