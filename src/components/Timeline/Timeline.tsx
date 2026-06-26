import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './Timeline.module.css';

export type TimelineTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export interface TimelineItem {
  label: ReactNode;
  description?: ReactNode;
  time?: ReactNode;
  /** Custom icon inside the dot. Defaults to a filled circle. */
  icon?: ReactNode;
  tone?: TimelineTone;
}

export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {
  items: TimelineItem[];
}

export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(function Timeline(
  { items, className, ...rest },
  ref,
) {
  return (
    <ol ref={ref} className={cn(styles.timeline, className)} {...rest}>
      {items.map((item, i) => (
        <li key={i} className={styles.item} data-tone={item.tone ?? 'neutral'}>
          <div className={styles.track}>
            <div className={styles.dot}>{item.icon}</div>
            {i < items.length - 1 && <div className={styles.line} />}
          </div>
          <div className={styles.content}>
            <div className={styles.header}>
              <span className={styles.label}>{item.label}</span>
              {item.time && <span className={styles.time}>{item.time}</span>}
            </div>
            {item.description && (
              <p className={styles.description}>{item.description}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
});
