import { createClient } from '@/lib/supabase/server';
import type { LogEntry, Movie } from '@/types';
import { HomeClient } from './HomeClient';

async function getLogEntries(): Promise<LogEntry[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('log_entries')
      .select('*')
      .order('logged_at', { ascending: false });

    if (error) throw error;

    type LogRow = {
      id: string;
      movie_data: Record<string, unknown>;
      rating: number;
      comment: string;
      logged_at: string;
    };

    return ((data ?? []) as unknown as LogRow[]).map((row) => ({
      id: row.id,
      movie: row.movie_data as unknown as Movie,
      rating: row.rating,
      comment: row.comment,
      loggedAt: row.logged_at,
    }));
  } catch {
    return [];
  }
}

async function getUser() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [entries, user] = await Promise.all([getLogEntries(), getUser()]);

  return <HomeClient initialEntries={entries} isOwner={!!user} userId={user?.id} />;
}
