import { forwardRef, type SVGAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './PixelMark.module.css';

export type PixelMarkName = 'star' | 'corner' | 'arrow' | 'dot' | 'bolt';

export interface PixelMarkProps extends Omit<SVGAttributes<SVGSVGElement>, 'name'> {
  /** Which pixel glyph to render. */
  name: PixelMarkName;
  /** Rendered edge length in px (glyphs are square). Defaults to 16. */
  size?: number | string;
}

/**
 * A small, crisp-edged pixel glyph used as a brand accent — logo marks, corner
 * brackets, status bullets. Deliberately tiny: pixel art is the signature here,
 * never the whole surface. `currentColor` fills every pixel, so color it via CSS.
 */
type Glyph = { viewBox: string; rects: [number, number, number, number][] };

const GLYPHS: Record<PixelMarkName, Glyph> = {
  star: {
    viewBox: '0 0 8 8',
    rects: [
      [3, 0, 1, 1], [3, 1, 1, 1], [1, 3, 1, 1], [2, 3, 1, 1], [3, 3, 1, 1],
      [4, 3, 1, 1], [5, 3, 1, 1], [3, 4, 1, 1], [3, 5, 1, 1],
      [1, 1, 1, 1], [5, 1, 1, 1], [1, 5, 1, 1], [5, 5, 1, 1],
    ],
  },
  corner: {
    viewBox: '0 0 6 6',
    rects: [[0, 0, 1, 1], [1, 0, 1, 1], [2, 0, 1, 1], [0, 1, 1, 1], [0, 2, 1, 1]],
  },
  arrow: {
    viewBox: '0 0 8 8',
    rects: [
      [0, 3, 1, 1], [1, 3, 1, 1], [2, 3, 1, 1], [3, 3, 1, 1], [4, 3, 1, 1],
      [4, 1, 1, 1], [4, 2, 1, 1], [4, 4, 1, 1], [4, 5, 1, 1],
      [5, 2, 1, 1], [5, 4, 1, 1], [6, 3, 1, 1],
    ],
  },
  dot: {
    viewBox: '0 0 4 4',
    rects: [[1, 0, 2, 1], [0, 1, 4, 2], [1, 3, 2, 1]],
  },
  bolt: {
    viewBox: '0 0 8 8',
    rects: [
      [4, 0, 1, 1], [3, 1, 2, 1], [2, 2, 2, 1], [1, 3, 4, 1],
      [4, 4, 2, 1], [3, 5, 2, 1], [3, 6, 1, 1],
    ],
  },
};

export const PixelMark = forwardRef<SVGSVGElement, PixelMarkProps>(function PixelMark(
  { name, size = 16, className, ...rest },
  ref,
) {
  const glyph = GLYPHS[name];
  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={glyph.viewBox}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn(styles.mark, className)}
      {...rest}
    >
      {glyph.rects.map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} />
      ))}
    </svg>
  );
});
