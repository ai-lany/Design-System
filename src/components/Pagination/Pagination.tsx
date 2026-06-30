import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './Pagination.module.css';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  /** Number of sibling pages shown on each side of the current page. Default 1. */
  siblingCount?: number;
}

function getRange(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function buildPages(page: number, pageCount: number, siblings: number): (number | null)[] {
  const totalShown = siblings * 2 + 5; // siblings + current + 2 edges + 2 ellipses
  if (pageCount <= totalShown) return getRange(1, pageCount);

  const left = Math.max(2, page - siblings);
  const right = Math.min(pageCount - 1, page + siblings);

  const showLeftDot = left > 2;
  const showRightDot = right < pageCount - 1;

  const pages: (number | null)[] = [1];
  if (showLeftDot) pages.push(null);
  pages.push(...getRange(left, right));
  if (showRightDot) pages.push(null);
  pages.push(pageCount);
  return pages;
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { page, pageCount, onChange, siblingCount = 1, className, ...rest },
  ref,
) {
  const pages = buildPages(page, pageCount, siblingCount);

  return (
    <nav
      ref={ref}
      aria-label="Pagination"
      className={cn(styles.nav, className)}
      {...rest}
    >
      <button
        className={styles.btn}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeftIcon />
      </button>

      {pages.map((p, i) =>
        p === null ? (
          <span key={`dot-${i}`} className={styles.ellipsis} aria-hidden="true">…</span>
        ) : (
          <button
            key={p}
            className={styles.btn}
            data-active={p === page || undefined}
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ),
      )}

      <button
        className={styles.btn}
        onClick={() => onChange(page + 1)}
        disabled={page >= pageCount}
        aria-label="Next page"
      >
        <ChevronRightIcon />
      </button>
    </nav>
  );
});

function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M9 2L5 7l4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 2l4 5-4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
