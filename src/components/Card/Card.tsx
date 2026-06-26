import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './Card.module.css';

export type CardElevation = 'flat' | 'raised' | 'floating';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: CardElevation;
  /** Remove inner padding (e.g. when the card contains its own layout). */
  unpadded?: boolean;
  /** Render as an interactive surface (clickable, with hover). */
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    elevation = 'raised',
    unpadded = false,
    interactive = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      data-elevation={elevation}
      data-unpadded={unpadded || undefined}
      data-interactive={interactive || undefined}
      className={cn(styles.card, className)}
      {...rest}
    >
      {children}
    </div>
  );
});

/* ---------- Subcomponents ---------- */

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...rest }, ref) {
    return <div ref={ref} className={cn(styles.header, className)} {...rest} />;
  },
);

export const CardBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardBody({ className, ...rest }, ref) {
    return <div ref={ref} className={cn(styles.body, className)} {...rest} />;
  },
);

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...rest }, ref) {
    return <div ref={ref} className={cn(styles.footer, className)} {...rest} />;
  },
);
