'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { ParallaxCard } from '@/components/ParallaxCard';
import { AddMovieModal } from '@/components/AddMovieModal';
import type { MovieFormData } from '@/components/AddMovieModal';
import type { LogEntry } from '@/types';
import styles from './MovieDetail.module.css';

interface MovieDetailProps {
  entry: LogEntry;
  isOwner: boolean;
}

export function MovieDetail({ entry: initialEntry, isOwner }: MovieDetailProps) {
  const router = useRouter();
  const [entry, setEntry] = useState(initialEntry);
  const [editing, setEditing] = useState(false);

  const handleEdit = useCallback(
    async (_movie: unknown, data: MovieFormData) => {
      if (!isSupabaseConfigured) return;
      const supabase = createClient();
      const { data: row, error } = await supabase
        .from('log_entries')
        .update({
          rating: data.rating,
          comment: data.comment,
          rating_partner: data.ratingPartner,
          comment_partner: data.commentPartner,
          watched_at: data.watchedAt,
        })
        .eq('id', entry.id)
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

      setEntry({
        ...entry,
        rating: r.rating,
        comment: r.comment,
        ratingPartner: r.rating_partner,
        commentPartner: r.comment_partner ?? '',
        watchedAt: r.watched_at,
      });
      setEditing(false);
    },
    [entry],
  );

  return (
    <div className={styles.page}>
      <ParallaxCard
        movie={entry.movie}
        logEntry={entry}
        backLabel="Back"
        onBack={() => router.back()}
        onEdit={isOwner ? () => setEditing(true) : undefined}
      />

      {editing && (
        <AddMovieModal
          movie={entry.movie}
          existing={entry}
          onSubmit={handleEdit}
          onCancel={() => setEditing(false)}
        />
      )}
    </div>
  );
}
