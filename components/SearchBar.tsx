'use client';

import { type ChangeEvent } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
}

export function SearchBar({ value, onChange, loading }: SearchBarProps) {
  return (
    <div className={styles.wrapper}>
      <svg className={styles.icon} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="8.5" cy="8.5" r="5.5" />
        <line x1="13" y1="13" x2="18" y2="18" />
      </svg>
      <input
        className={styles.input}
        type="text"
        placeholder="Search for a movie..."
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        autoFocus
      />
      {loading && <div className={styles.spinner} />}
    </div>
  );
}
