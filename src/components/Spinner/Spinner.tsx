import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './Spinner.module.css';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerColor = 'accent' | 'current';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  /** 'accent' uses --color-accent; 'current' inherits the parent's text color. */
  color?: SpinnerColor;
  /** Accessible label read by screen readers. */
  label?: string;
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', color = 'accent', label = 'Loading…', className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      role="status"
      aria-label={label}
      data-size={size}
      data-color={color}
      className={cn(styles.spinner, className)}
      {...rest}
    />
  );
});
