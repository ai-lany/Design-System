import { type ElementType, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './Link.module.css';

export type LinkVariant = 'inline' | 'nav';
export type LinkUnderline = 'always' | 'hover' | 'none';
export type LinkColor =
  | 'default'
  | 'muted'
  | 'subtle'
  | 'inherit'
  | 'accent'
  | 'danger'
  | 'success'
  | 'warning';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** `inline` — text link; `nav` — block nav item with hover background. */
  variant?: LinkVariant;
  /** Controls underline rendering. Only applies to the `inline` variant. */
  underline?: LinkUnderline;
  /** Token-based text color. Defaults to `accent` for inline, `muted` for nav. */
  color?: LinkColor;
  /** Override the rendered element — useful for router Link components. */
  as?: ElementType;
  children?: ReactNode;
}

export function Link({
  variant = 'inline',
  underline = 'hover',
  color,
  as,
  className,
  children,
  ...rest
}: LinkProps) {
  const Tag = (as ?? 'a') as ElementType;

  const resolvedColor = color ?? (variant === 'nav' ? 'muted' : 'accent');

  return (
    <Tag
      data-variant={variant}
      data-underline={variant === 'inline' ? underline : undefined}
      data-color={resolvedColor !== 'default' ? resolvedColor : undefined}
      className={cn(styles.link, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
