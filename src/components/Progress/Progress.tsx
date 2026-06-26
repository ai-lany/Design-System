import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './Progress.module.css';

export type ProgressTone = 'accent' | 'success' | 'warning' | 'danger';
export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressVariant = 'bar' | 'circular';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Value 0–100. */
  value: number;
  variant?: ProgressVariant;
  tone?: ProgressTone;
  size?: ProgressSize;
  label?: ReactNode;
  showValue?: boolean;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  {
    value,
    variant = 'bar',
    tone = 'accent',
    size = 'md',
    label,
    showValue = false,
    className,
    ...rest
  },
  ref,
) {
  const pct = Math.min(100, Math.max(0, value));

  if (variant === 'circular') {
    const r = 20;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    const dim = size === 'sm' ? 40 : size === 'lg' ? 64 : 52;
    const stroke = size === 'sm' ? 3 : size === 'lg' ? 5 : 4;

    return (
      <div ref={ref} className={cn(styles.circularRoot, className)} data-tone={tone} {...rest}>
        <svg
          width={dim}
          height={dim}
          viewBox="0 0 48 48"
          fill="none"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={typeof label === 'string' ? label : undefined}
        >
          <circle
            cx="24" cy="24" r={r}
            stroke="var(--color-bg-muted)"
            strokeWidth={stroke}
          />
          <circle
            cx="24" cy="24" r={r}
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform="rotate(-90 24 24)"
            style={{ transition: 'stroke-dashoffset var(--duration-slow) var(--ease-out)' }}
          />
        </svg>
        {showValue && (
          <span className={styles.circularValue}>{Math.round(pct)}%</span>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className={cn(styles.root, className)} data-tone={tone} data-size={size} {...rest}>
      {(label || showValue) && (
        <div className={styles.labelRow}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && <span className={styles.valueLabel}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={typeof label === 'string' ? label : undefined}
      >
        <div
          className={styles.fill}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
});
