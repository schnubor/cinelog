import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getTrailerKey } from '@/lib/tmdb';
import type { LogEntry, Movie } from '@/types';
import { MovieDetail } from './MovieDetail';

interface Props {
  params: Promise<{ id: string }>;
}

async function getEntry(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('log_entries')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;

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

  return {
    entry: {
      id: row.id,
      movie: row.movie_data as unknown as Movie,
      rating: row.rating,
      comment: row.comment,
      ratingPartner: row.rating_partner,
      commentPartner: row.comment_partner ?? '',
      watchedAt: row.watched_at,
      loggedAt: row.logged_at,
    } as LogEntry,
    tmdbId: row.tmdb_id,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await getEntry(id);
  if (!result) return {};

  const { entry } = result;
  const movie = entry.movie;
  const avgRating =
    entry.ratingPartner != null
      ? ((entry.rating + entry.ratingPartner) / 2).toFixed(1)
      : entry.rating.toFixed(1);
  const year = movie.release_date?.slice(0, 4);

  return {
    title: `${movie.title}${year ? ` (${year})` : ''} — Cinelog`,
    description: `Rated ${avgRating}/10. ${movie.overview?.slice(0, 150) ?? ''}`,
  };
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  const result = await getEntry(id);
  if (!result) notFound();

  const { entry, tmdbId } = result;

  const [{ data: { user } }, trailerKey] = await Promise.all([
    (await createClient()).auth.getUser(),
    getTrailerKey(tmdbId),
  ]);

  return <MovieDetail entry={entry} isOwner={!!user} trailerKey={trailerKey} />;
}
