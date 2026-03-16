import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getTrailerKey } from '@/lib/tmdb';
import type { LogEntry, Movie } from '@/types';
import { MovieDetail } from './MovieDetail';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();

  const [{ data, error }, { data: { user } }] = await Promise.all([
    supabase.from('log_entries').select('*').eq('id', id).single(),
    supabase.auth.getUser(),
  ]);

  if (error || !data) notFound();

  const row = data as unknown as {
    id: string;
    tmdb_id: number;
    movie_data: Record<string, unknown>;
    rating: number;
    comment: string;
    rating_partner: number | null;
    comment_partner: string;
    watched_at: string | null;
    logged_at: string;
  };

  const entry: LogEntry = {
    id: row.id,
    movie: row.movie_data as unknown as Movie,
    rating: row.rating,
    comment: row.comment,
    ratingPartner: row.rating_partner,
    commentPartner: row.comment_partner ?? '',
    watchedAt: row.watched_at,
    loggedAt: row.logged_at,
  };

  const trailerKey = await getTrailerKey(row.tmdb_id);

  return <MovieDetail entry={entry} isOwner={!!user} trailerKey={trailerKey} />;
}
