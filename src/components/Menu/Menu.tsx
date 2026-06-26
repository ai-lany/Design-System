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
import styles from './Menu.module.css';

export interface MenuItem {
  type?: 'item' | 'separator' | 'label';
  label?: ReactNode;
  /** Optional leading icon. */
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  /** Renders item in danger color. */
  danger?: boolean;
  /** Keyboard shortcut hint shown on the right. */
  shortcut?: string;
}

export type MenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

export interface MenuProps {
  trigger: ReactElement;
  items: MenuItem[];
  placement?: MenuPlacement;
  className?: string;
}

function computeMenuStyle(
  anchor: DOMRect,
  floating: DOMRect,
  placement: MenuPlacement,
): CSSProperties {
  const gap = 4;
  let top: number;
  let left: number;

  if (placement.startsWith('bottom')) {
    top = anchor.bottom + gap;
  } else {
    top = anchor.top - floating.height - gap;
  }

  if (placement.endsWith('start')) {
    left = anchor.left;
  } else {
    left = anchor.right - floating.width;
  }

  left = Math.max(8, Math.min(left, window.innerWidth - floating.width - 8));
  top  = Math.max(8, Math.min(top,  window.innerHeight - floating.height - 8));

  return { position: 'fixed', top, left, zIndex: 9999 };
}

export const Menu = forwardRef<HTMLDivElement, MenuProps & HTMLAttributes<HTMLDivElement>>(
  function Menu({ trigger, items, placement = 'bottom-start', className, ...rest }, ref) {
    const [open, setOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [style, setStyle] = useState<CSSProperties>({});

    const anchorRef = useRef<HTMLElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const itemIndices = items
      .map((it, i) => (it.type === 'separator' || it.type === 'label' || it.disabled ? -1 : i))
      .filter(i => i >= 0);

    const close = useCallback(() => {
      setOpen(false);
      setFocusedIndex(-1);
    }, []);

    const updatePosition = useCallback(() => {
      if (!anchorRef.current || !menuRef.current) return;
      setStyle(computeMenuStyle(
        anchorRef.current.getBoundingClientRect(),
        menuRef.current.getBoundingClientRect(),
        placement,
      ));
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

    useEffect(() => {
      if (!open) return;
      const handle = (e: MouseEvent) => {
        const t = e.target as Node;
        if (!anchorRef.current?.contains(t) && !menuRef.current?.contains(t)) close();
      };
      document.addEventListener('mousedown', handle);
      return () => document.removeEventListener('mousedown', handle);
    }, [open, close]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setOpen(true);
          setFocusedIndex(itemIndices[0] ?? -1);
        }
        return;
      }
      const pos = itemIndices.indexOf(focusedIndex);
      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const next = itemIndices[Math.min(pos + 1, itemIndices.length - 1)];
          if (next !== undefined) setFocusedIndex(next);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prev = itemIndices[Math.max(pos - 1, 0)];
          if (prev !== undefined) setFocusedIndex(prev);
          break;
        }
        case 'Enter':
        case ' ': {
          e.preventDefault();
          const item = focusedIndex >= 0 ? items[focusedIndex] : undefined;
          if (item?.onClick) { item.onClick(); close(); }
          break;
        }
        case 'Escape':
        case 'Tab':
          close();
          break;
      }
    };

    const triggerEl = isValidElement(trigger)
      ? cloneElement(trigger as ReactElement<Record<string, unknown>>, {
          ref: anchorRef,
          onClick: (...args: unknown[]) => {
            setOpen(v => !v);
            (trigger.props as Record<string, unknown>).onClick?.(...args);
          },
          onKeyDown: handleKeyDown,
          'aria-expanded': open,
          'aria-haspopup': 'menu',
        })
      : trigger;

    return (
      <>
        {triggerEl}
        {open &&
          createPortal(
            <div
              ref={menuRef}
              role="menu"
              className={cn(styles.menu, className)}
              style={style}
              onKeyDown={handleKeyDown}
              {...rest}
            >
              {items.map((item, i) => {
                if (item.type === 'separator') {
                  return <div key={i} className={styles.separator} role="separator" />;
                }
                if (item.type === 'label') {
                  return <div key={i} className={styles.sectionLabel}>{item.label}</div>;
                }
                const isFocused = i === focusedIndex;
                return (
                  <button
                    key={i}
                    role="menuitem"
                    className={styles.item}
                    data-focused={isFocused || undefined}
                    data-danger={item.danger || undefined}
                    disabled={item.disabled}
                    onClick={() => { item.onClick?.(); close(); }}
                    onMouseEnter={() => setFocusedIndex(i)}
                  >
                    {item.icon && <span className={styles.itemIcon}>{item.icon}</span>}
                    <span className={styles.itemLabel}>{item.label}</span>
                    {item.shortcut && (
                      <span className={styles.shortcut}>{item.shortcut}</span>
                    )}
                  </button>
                );
              })}
            </div>,
            document.body,
          )}
      </>
    );
  },
);
