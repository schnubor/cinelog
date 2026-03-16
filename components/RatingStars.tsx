'use client';

import styles from './RatingStars.module.css';

interface RatingDisplayProps {
  value: number;
  readOnly: true;
  size?: number;
  tooltip?: string;
  onChange?: never;
}

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  readOnly?: false;
  size?: never;
  tooltip?: never;
}

type RatingProps = RatingDisplayProps | RatingInputProps;

export function Rating(props: RatingProps) {
  if (props.readOnly) {
    return (
      <span
        className={`${styles.badge} ${props.tooltip ? styles.hasTooltip : ''}`}
        style={{ fontSize: props.size ?? 13 }}
        data-tooltip={props.tooltip}
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
        className={`${styles.slider} ${value === 0 ? styles.sliderInactive : ''}`}
      />
      <span className={`${styles.display} ${value === 0 ? styles.displayInactive : ''}`}>
        {value > 0 ? value.toFixed(1) : '—'}
      </span>
    </div>
  );
}
