import { type ElementType, type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './Typography.module.css';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline'
  | 'label';

export type TypographyColor =
  | 'default'
  | 'muted'
  | 'subtle'
  | 'inherit'
  | 'accent'
  | 'danger'
  | 'success'
  | 'warning';

export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';
export type TypographyWeight = 'regular' | 'medium' | 'semibold';

const defaultTags: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
  caption: 'span',
  overline: 'span',
  label: 'span',
};

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  /** Visual style variant. Defaults to `body1`. */
  variant?: TypographyVariant;
  /** Override the rendered HTML element. */
  as?: ElementType;
  /** Text color alias from the design token set. */
  color?: TypographyColor;
  /** Text alignment. */
  align?: TypographyAlign;
  /** Font-weight override. */
  weight?: TypographyWeight;
  /** Adds a `margin-bottom` to separate the element from its siblings. */
  gutterBottom?: boolean;
  /** Clips overflow with an ellipsis on a single line. */
  noWrap?: boolean;
  children?: ReactNode;
}

export function Typography({
  variant = 'body1',
  as,
  color = 'default',
  align,
  weight,
  gutterBottom = false,
  noWrap = false,
  className,
  children,
  ...rest
}: TypographyProps) {
  const Tag = as ?? defaultTags[variant];

  return (
    <Tag
      data-variant={variant}
      data-color={color !== 'default' ? color : undefined}
      data-align={align}
      data-weight={weight}
      data-gutter-bottom={gutterBottom || undefined}
      data-no-wrap={noWrap || undefined}
      className={cn(styles.typography, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
