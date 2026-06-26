import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './Row.module.css';

export type SpaceToken = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

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
