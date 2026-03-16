'use client';

import styles from './RatingStars.module.css';

interface RatingDisplayProps {
  value: number;
  readOnly: true;
  size?: number;
  onChange?: never;
}

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  readOnly?: false;
  size?: never;
}

type RatingProps = RatingDisplayProps | RatingInputProps;

export function Rating(props: RatingProps) {
  if (props.readOnly) {
    return (
      <span
        className={styles.badge}
        style={{ fontSize: props.size ?? 13 }}
      >
        {props.value.toFixed(1)}
      </span>
    );
  }

  const { value, onChange } = props;

  return (
    <div className={styles.inputGroup}>
      <input
        type="range"
        min="1"
        max="10"
        step="0.1"
        value={value || 1}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={styles.slider}
      />
      <span className={styles.display}>
        {value > 0 ? value.toFixed(1) : '—'}
      </span>
    </div>
  );
}
