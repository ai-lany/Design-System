import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import type { SpaceToken } from '../../lib/types';
import styles from './Container.module.css';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Constrain max-width. 'sm'=640, 'md'=768, 'lg'=1024, 'xl'=1280, 'full'=100%. */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Horizontal padding using a space token (1–8). Defaults to 4 (1rem). */
  padding?: SpaceToken;
  /** Center horizontally with auto margins. Default: true. */
  center?: boolean;
}

const MAX_WIDTHS: Record<NonNullable<ContainerProps['maxWidth']>, CSSProperties['maxWidth']> = {
  sm:   640,
  md:   768,
  lg:   1024,
  xl:   1280,
  full: '100%',
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { maxWidth, padding = 4, center = true, className, style, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(styles.container, className)}
      style={{
        maxWidth: maxWidth ? MAX_WIDTHS[maxWidth] : undefined,
        paddingLeft:  `var(--space-${padding})`,
        paddingRight: `var(--space-${padding})`,
        marginLeft:   center ? 'auto' : undefined,
        marginRight:  center ? 'auto' : undefined,
        ...style,
      }}
      {...rest}
    />
  );
});
