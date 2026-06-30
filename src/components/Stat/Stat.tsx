import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { ArrowDown, ArrowUp } from 'pixelarticons/react';
import { cn } from '../../lib/cn';
import styles from './Stat.module.css';

export type StatTrend = 'up' | 'down' | 'neutral';

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  /** Change indicator, e.g. "+12%" or "–3". */
  change?: ReactNode;
  trend?: StatTrend;
  /** Optional description below the change. */
  description?: ReactNode;
}

export const Stat = forwardRef<HTMLDivElement, StatProps>(function Stat(
  { label, value, change, trend = 'neutral', description, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.stat, className)} {...rest}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      {(change || description) && (
        <div className={styles.footer}>
          {change && (
            <span className={styles.change} data-trend={trend}>
              {trend === 'up' && <ArrowUp width="12" height="12" />}
              {trend === 'down' && <ArrowDown width="12" height="12" />}
              {change}
            </span>
          )}
          {description && <span className={styles.description}>{description}</span>}
        </div>
      )}
    </div>
  );
});

