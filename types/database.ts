export interface Database {
  public: {
    Tables: {
      log_entries: {
        Row: {
          id: string;
          user_id: string;
          tmdb_id: number;
          movie_data: Record<string, unknown>;
          rating: number;
          comment: string;
          logged_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tmdb_id: number;
          movie_data: Record<string, unknown>;
          rating: number;
          comment?: string;
          logged_at?: string;
        };
        Update: {
          rating?: number;
          comment?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
