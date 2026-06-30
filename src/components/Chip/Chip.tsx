import { forwardRef, type HTMLAttributes, type KeyboardEvent, type MouseEvent } from 'react';
import { Close } from 'pixelarticons/react';
import { cn } from '../../lib/cn';
import styles from './Chip.module.css';

export type ChipTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: ChipTone;
  /** Renders the chip in a selected/active state. */
  selected?: boolean;
  /** If provided, renders a remove (✕) button and calls this when clicked. */
  onRemove?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  { tone = 'neutral', selected = false, onRemove, className, children, onClick, ...rest },
  ref,
) {
  const handleKeyDown = onClick
    ? (e: KeyboardEvent<HTMLSpanElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e as unknown as MouseEvent<HTMLSpanElement>);
        }
      }
    : undefined;

  return (
    <span
      ref={ref}
      data-tone={tone}
      data-selected={selected || undefined}
      data-interactive={onClick ? true : undefined}
      className={cn(styles.chip, className)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...rest}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          className={styles.remove}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(e);
          }}
          aria-label="Remove"
        >
          <Close width="10" height="10" aria-hidden="true" />
        </button>
      )}
    </span>
  );
});
