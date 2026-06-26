import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import type { SpaceToken } from '../../lib/types';
import styles from './Row.module.css';

export interface RowProps extends HTMLAttributes<HTMLDivElement> {
  gap?: SpaceToken;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: boolean;
}

export const Row = forwardRef<HTMLDivElement, RowProps>(function Row(
  { gap, align, justify, wrap = false, className, style, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(styles.row, className)}
      style={{
        gap: gap ? `var(--space-${gap})` : undefined,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : undefined,
        ...style,
      }}
      {...rest}
    />
  );
});
