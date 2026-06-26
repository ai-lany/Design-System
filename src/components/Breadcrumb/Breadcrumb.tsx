import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './Breadcrumb.module.css';

export interface BreadcrumbItem {
  label: ReactNode;
  /** When provided, renders an anchor tag. Omit for the current (last) page. */
  href?: string;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  /** Custom separator element. Defaults to a chevron. */
  separator?: ReactNode;
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items, separator, className, ...rest },
  ref,
) {
  const sep = separator ?? <ChevronIcon />;

  return (
    <nav ref={ref} aria-label="Breadcrumb" className={cn(styles.nav, className)} {...rest}>
      <ol className={styles.list}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className={styles.item}>
              {i > 0 && <span className={styles.separator} aria-hidden="true">{sep}</span>}
              {isLast || !item.href ? (
                <span
                  className={cn(styles.text, isLast && styles.current)}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <a href={item.href} className={styles.link}>{item.label}</a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
