import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useReducer,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import styles from './Toast.module.css';

/* ── Types ────────────────────────────────────────────────────────── */

export type ToastTone = 'info' | 'success' | 'warning' | 'danger';

export interface ToastItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** Auto-dismiss after this many ms. Default 4000. 0 = never. */
  duration?: number;
}

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  duration?: number;
}

/* ── Reducer ──────────────────────────────────────────────────────── */

type ToastAction =
  | { type: 'ADD'; toast: ToastItem }
  | { type: 'REMOVE'; id: string };

function toastReducer(state: ToastItem[], action: ToastAction): ToastItem[] {
  switch (action.type) {
    case 'ADD':    return [...state, action.toast];
    case 'REMOVE': return state.filter(t => t.id !== action.id);
    default:       return state;
  }
}

/* ── Context ──────────────────────────────────────────────────────── */

interface ToastContextValue {
  toasts: ToastItem[];
  dispatch: React.Dispatch<ToastAction>;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/* ── Provider ─────────────────────────────────────────────────────── */

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  return (
    <ToastContext.Provider value={{ toasts, dispatch }}>
      {children}
      {createPortal(
        <ToastRegion toasts={toasts} dispatch={dispatch} />,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

/* ── Hook ─────────────────────────────────────────────────────────── */

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = `toast-${Math.random().toString(36).slice(2)}`;
      ctx.dispatch({ type: 'ADD', toast: { id, ...options } });
    },
    [ctx],
  );

  return { toast };
}

/* ── Region ───────────────────────────────────────────────────────── */

function ToastRegion({
  toasts,
  dispatch,
}: {
  toasts: ToastItem[];
  dispatch: React.Dispatch<ToastAction>;
}) {
  return (
    <div
      className={styles.region}
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map(t => (
        <ToastCard
          key={t.id}
          toast={t}
          onClose={() => dispatch({ type: 'REMOVE', id: t.id })}
        />
      ))}
    </div>
  );
}

/* ── Individual toast ─────────────────────────────────────────────── */

function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const duration = toast.duration ?? 4000;

  useEffect(() => {
    if (duration === 0) return;
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [duration, onClose]);

  return (
    <div
      role="alert"
      className={cn(styles.toast)}
      data-tone={toast.tone ?? 'info'}
    >
      <span className={styles.toastIcon} aria-hidden="true">
        <ToastIcon tone={toast.tone ?? 'info'} />
      </span>
      <div className={styles.toastBody}>
        {toast.title && <p className={styles.toastTitle}>{toast.title}</p>}
        {toast.description && (
          <p className={styles.toastDesc}>{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        className={styles.toastClose}
        aria-label="Dismiss"
        onClick={onClose}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

function ToastIcon({ tone }: { tone: ToastTone }) {
  switch (tone) {
    case 'success':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'warning':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1.5L14.5 13H1.5L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M8 6v3M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'danger':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default: // info
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
}
