import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './Divider.module.css';

export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: DividerOrientation;
  /** Optional label centered on the line. */
  label?: ReactNode;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { orientation = 'horizontal', label, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      data-orientation={orientation}
      className={cn(styles.divider, className)}
      {...rest}
    >
      {label && orientation === 'horizontal' && (
        <span className={styles.label}>{label}</span>
      )}
    </div>
  );
});
