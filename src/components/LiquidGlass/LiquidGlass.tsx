import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './LiquidGlass.module.css';

export interface LiquidGlassProps extends HTMLAttributes<HTMLDivElement> {}

export const LiquidGlass = forwardRef<HTMLDivElement, LiquidGlassProps>(
  function LiquidGlass({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cn(styles.glass, className)} {...rest}>
        <div className={styles.inner}>{children}</div>
      </div>
    );
  },
);
