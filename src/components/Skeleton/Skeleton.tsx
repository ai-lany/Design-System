import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './Skeleton.module.css';

export type SkeletonVariant = 'rect' | 'circle' | 'text';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  /** For variant="text": number of skeleton lines to render. */
  lines?: number;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { variant = 'rect', width, height, lines = 3, className, style, ...rest },
  ref,
) {
  const inlineStyle: CSSProperties = { ...style };
  if (width !== undefined) inlineStyle.width = typeof width === 'number' ? `${width}px` : width;
  if (height !== undefined) inlineStyle.height = typeof height === 'number' ? `${height}px` : height;

  if (variant === 'text') {
    return (
      <div ref={ref} className={cn(styles.textGroup, className)} {...rest}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={styles.skeleton}
            data-variant="text"
            style={i === lines - 1 ? { width: '72%' } : undefined}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(styles.skeleton, className)}
      data-variant={variant}
      style={inlineStyle}
      {...rest}
    />
  );
});
