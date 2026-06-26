import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import styles from './Tabs.module.css';

/* ---------- Context ---------- */

interface TabsContextValue {
  value: string;
  onChange: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('<Tab> and <TabPanel> must be used inside <Tabs>');
  return ctx;
}

/* ---------- Tabs (root) ---------- */

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Controlled selected value. */
  value: string;
  onChange: (value: string) => void;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { value, onChange, className, children, ...rest },
  ref,
) {
  const baseId = useId();
  return (
    <TabsContext.Provider value={{ value, onChange, baseId }}>
      <div ref={ref} className={cn(styles.tabs, className)} {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  );
});

/* ---------- TabList ---------- */

export const TabList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function TabList({ className, children, ...rest }, ref) {
    const listRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      const list = listRef.current ?? ref as React.RefObject<HTMLDivElement> | null;
      const el = (list as React.RefObject<HTMLDivElement> | null)?.current ?? listRef.current;
      if (!el) return;
      const tabs = Array.from(el.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'));
      const idx = tabs.indexOf(document.activeElement as HTMLButtonElement);
      if (idx === -1) return;

      if (e.key === 'ArrowRight') {
        tabs[(idx + 1) % tabs.length]?.focus();
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        tabs[(idx - 1 + tabs.length) % tabs.length]?.focus();
        e.preventDefault();
      } else if (e.key === 'Home') {
        tabs[0]?.focus();
        e.preventDefault();
      } else if (e.key === 'End') {
        tabs[tabs.length - 1]?.focus();
        e.preventDefault();
      }
    };

    return (
      <div
        ref={listRef}
        role="tablist"
        className={cn(styles.tabList, className)}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

/* ---------- Tab ---------- */

export interface TabProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab(
  { value, disabled, className, children, ...rest },
  ref,
) {
  const { value: selected, onChange, baseId } = useTabsContext();
  const isSelected = value === selected;

  return (
    <button
      ref={ref}
      role="tab"
      type="button"
      aria-selected={isSelected}
      aria-controls={`${baseId}-panel-${value}`}
      id={`${baseId}-tab-${value}`}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      data-selected={isSelected || undefined}
      className={cn(styles.tab, className)}
      onClick={() => !disabled && onChange(value)}
      {...rest}
    >
      {children}
    </button>
  );
});

/* ---------- TabPanel ---------- */

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children?: ReactNode;
}

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel(
  { value, className, children, ...rest },
  ref,
) {
  const { value: selected, baseId } = useTabsContext();
  const isSelected = value === selected;

  return (
    <div
      ref={ref}
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      hidden={!isSelected}
      tabIndex={0}
      className={cn(styles.tabPanel, className)}
      {...rest}
    >
      {children}
    </div>
  );
});
