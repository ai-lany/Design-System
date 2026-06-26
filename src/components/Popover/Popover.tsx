import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import styles from './Popover.module.css';

export type PopoverPlacement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'right';

export interface PopoverProps {
  trigger: ReactElement;
  content: ReactNode;
  placement?: PopoverPlacement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

function getPopoverStyle(
  anchor: DOMRect,
  floating: DOMRect,
  placement: PopoverPlacement,
  gap = 6,
): CSSProperties {
  let top = 0;
  let left = 0;

  switch (placement) {
    case 'bottom':
      top = anchor.bottom + gap;
      left = anchor.left + anchor.width / 2 - floating.width / 2;
      break;
    case 'bottom-start':
      top = anchor.bottom + gap;
      left = anchor.left;
      break;
    case 'bottom-end':
      top = anchor.bottom + gap;
      left = anchor.right - floating.width;
      break;
    case 'top':
      top = anchor.top - floating.height - gap;
      left = anchor.left + anchor.width / 2 - floating.width / 2;
      break;
    case 'top-start':
      top = anchor.top - floating.height - gap;
      left = anchor.left;
      break;
    case 'top-end':
      top = anchor.top - floating.height - gap;
      left = anchor.right - floating.width;
      break;
    case 'left':
      top = anchor.top + anchor.height / 2 - floating.height / 2;
      left = anchor.left - floating.width - gap;
      break;
    case 'right':
      top = anchor.top + anchor.height / 2 - floating.height / 2;
      left = anchor.right + gap;
      break;
  }

  // Clamp to viewport
  left = Math.max(8, Math.min(left, window.innerWidth - floating.width - 8));
  top  = Math.max(8, Math.min(top,  window.innerHeight - floating.height - 8));

  return { position: 'fixed', top, left, zIndex: 9999 };
}

export const Popover = forwardRef<HTMLDivElement, PopoverProps & HTMLAttributes<HTMLDivElement>>(
  function Popover(
    { trigger, content, placement = 'bottom', open: controlledOpen, onOpenChange, className, ...rest },
    ref,
  ) {
    const isControlled = controlledOpen !== undefined;
    const [internalOpen, setInternalOpen] = useState(false);
    const open = isControlled ? controlledOpen : internalOpen;

    const setOpen = useCallback(
      (v: boolean) => {
        if (!isControlled) setInternalOpen(v);
        onOpenChange?.(v);
      },
      [isControlled, onOpenChange],
    );

    const anchorRef = useRef<HTMLElement>(null);
    const floatingRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<CSSProperties>({});

    const updatePosition = useCallback(() => {
      if (!anchorRef.current || !floatingRef.current) return;
      const anchor = anchorRef.current.getBoundingClientRect();
      const floating = floatingRef.current.getBoundingClientRect();
      setStyle(getPopoverStyle(anchor, floating, placement));
    }, [placement]);

    useEffect(() => {
      if (!open) return;
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }, [open, updatePosition]);

    // Close on outside click
    useEffect(() => {
      if (!open) return;
      const handle = (e: MouseEvent) => {
        const t = e.target as Node;
        if (!anchorRef.current?.contains(t) && !floatingRef.current?.contains(t)) {
          setOpen(false);
        }
      };
      document.addEventListener('mousedown', handle);
      return () => document.removeEventListener('mousedown', handle);
    }, [open, setOpen]);

    const triggerEl = isValidElement(trigger)
      ? cloneElement(trigger as ReactElement<Record<string, unknown>>, {
          ref: anchorRef,
          onClick: (...args: unknown[]) => {
            setOpen(!open);
            (trigger.props as Record<string, unknown>).onClick?.(...args);
          },
          'aria-expanded': open,
          'aria-haspopup': 'true',
        })
      : trigger;

    return (
      <>
        {triggerEl}
        {open &&
          createPortal(
            <div
              ref={floatingRef}
              className={cn(styles.popover, className)}
              style={style}
              {...rest}
            >
              {content}
            </div>,
            document.body,
          )}
      </>
    );
  },
);
