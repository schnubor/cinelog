/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TMDB_API_KEY: string;
  readonly VITE_CLIPDROP_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
