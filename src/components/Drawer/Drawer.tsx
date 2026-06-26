import {
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import styles from './Drawer.module.css';

export type DrawerSide = 'left' | 'right';
export type DrawerSize = 'sm' | 'md' | 'lg';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  size?: DrawerSize;
  title?: ReactNode;
  description?: ReactNode;
  /** Slot rendered in the footer (typically action buttons). */
  footer?: ReactNode;
  children?: ReactNode;
  /** Click backdrop to close. Default true. */
  dismissOnBackdrop?: boolean;
  className?: string;
}

export function Drawer({
  open,
  onClose,
  side = 'right',
  size = 'md',
  title,
  description,
  footer,
  children,
  dismissOnBackdrop = true,
  className,
}: DrawerProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return createPortal(
    <div className={styles.root}>
      <div
        className={styles.backdrop}
        aria-hidden="true"
        onClick={dismissOnBackdrop ? onClose : undefined}
      />
      <div
        className={cn(styles.panel, className)}
        data-side={side}
        data-size={size}
        role="dialog"
        aria-modal="true"
      >
        {(title || description) && (
          <header className={styles.header}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {description && <p className={styles.desc}>{description}</p>}
            <button
              type="button"
              className={styles.closeBtn}
              aria-label="Close"
              onClick={onClose}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </header>
        )}
        {children && <div className={styles.body}>{children}</div>}
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
