import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import type { MenuItem } from '../Menu';
import styles from './ContextMenu.module.css';

export interface ContextMenuProps {
  /** The element that receives the right-click event. */
  trigger: ReactElement;
  items: MenuItem[];
  className?: string;
}

export function ContextMenu({ trigger, items, className }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setFocusedIndex(-1);
  }, []);

  const itemIndices = items
    .map((it, i) => (it.type === 'separator' || it.type === 'label' || it.disabled ? -1 : i))
    .filter(i => i >= 0);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPos({ x: e.clientX, y: e.clientY });
    setOpen(true);
    setFocusedIndex(-1);
  };

  // Adjust menu so it doesn't overflow the viewport
  const menuStyle: CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    top: Math.min(pos.y, window.innerHeight - (menuRef.current?.offsetHeight ?? 200) - 8),
    left: Math.min(pos.x, window.innerWidth - (menuRef.current?.offsetWidth ?? 180) - 8),
  };

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) close();
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('mousedown', handle);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, close]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const pos2 = itemIndices.indexOf(focusedIndex);
    switch (e.key) {
      case 'ArrowDown': { e.preventDefault(); const next = itemIndices[Math.min(pos2 + 1, itemIndices.length - 1)]; if (next !== undefined) setFocusedIndex(next); break; }
      case 'ArrowUp':   { e.preventDefault(); const prev = itemIndices[Math.max(pos2 - 1, 0)]; if (prev !== undefined) setFocusedIndex(prev); break; }
      case 'Enter':
      case ' ': { e.preventDefault(); const item = focusedIndex >= 0 ? items[focusedIndex] : undefined; if (item?.onClick) { item.onClick(); close(); } break; }
      case 'Escape': close(); break;
    }
  };

  const triggerEl = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<Record<string, unknown>>, {
        onContextMenu: (e: React.MouseEvent) => {
          handleContextMenu(e);
          (trigger.props as Record<string, unknown>).onContextMenu?.(e);
        },
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
            style={menuStyle}
            onKeyDown={handleKeyDown}
          >
            {items.map((item, i) => {
              if (item.type === 'separator') return <div key={i} className={styles.separator} role="separator" />;
              if (item.type === 'label') return <div key={i} className={styles.sectionLabel}>{item.label}</div>;
              return (
                <button
                  key={i}
                  role="menuitem"
                  className={styles.item}
                  data-focused={i === focusedIndex || undefined}
                  data-danger={item.danger || undefined}
                  disabled={item.disabled}
                  onClick={() => { item.onClick?.(); close(); }}
                  onMouseEnter={() => setFocusedIndex(i)}
                >
                  {item.icon && <span className={styles.icon}>{item.icon}</span>}
                  <span className={styles.label}>{item.label}</span>
                  {item.shortcut && <span className={styles.shortcut}>{item.shortcut}</span>}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
