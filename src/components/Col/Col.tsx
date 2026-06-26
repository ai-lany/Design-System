import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import type { SpaceToken } from '../../lib/types';
import styles from './Col.module.css';

export interface ColProps extends HTMLAttributes<HTMLDivElement> {
  gap?: SpaceToken;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
}

export const Col = forwardRef<HTMLDivElement, ColProps>(function Col(
  { gap, align, justify, className, style, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(styles.col, className)}
      style={{
        gap: gap ? `var(--space-${gap})` : undefined,
        alignItems: align,
        justifyContent: justify,
        ...style,
      }}
      {...rest}
    />
  );
});
