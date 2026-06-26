import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './Tooltip.module.css';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'content'> {
  /** The tooltip text/content. */
  content: ReactNode;
  placement?: TooltipPlacement;
  children: ReactNode;
}

export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip(
  { content, placement = 'top', className, children, ...rest },
  ref,
) {
  const tooltipId = useId();

  return (
    <span
      ref={ref}
      className={cn(styles.wrapper, className)}
      data-placement={placement}
      aria-describedby={tooltipId}
      {...rest}
    >
      {children}
      <span id={tooltipId} className={styles.tooltip} role="tooltip">
        {content}
      </span>
    </span>
  );
});
