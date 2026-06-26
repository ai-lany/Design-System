import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Render a loading spinner and disable the button. */
  loading?: boolean;
  /** Icon-only mode renders a square button. Pair with `aria-label`. */
  iconOnly?: boolean;
  /** Optional leading element (icon). */
  leading?: ReactNode;
  /** Optional trailing element (icon). */
  trailing?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    iconOnly = false,
    leading,
    trailing,
    disabled,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      data-icon-only={iconOnly || undefined}
      className={cn(styles.button, className)}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {!loading && leading && <span className={styles.affix}>{leading}</span>}
      {children != null && <span className={styles.label}>{children}</span>}
      {!loading && trailing && <span className={styles.affix}>{trailing}</span>}
    </button>
  );
});
