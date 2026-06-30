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
import { Check, Close, InfoBox, SquareAlert } from 'pixelarticons/react';
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
        <Close width="12" height="12" />
      </button>
    </div>
  );
}

function ToastIcon({ tone }: { tone: ToastTone }) {
  switch (tone) {
    case 'success': return <Check width="16" height="16" />;
    case 'warning': return <SquareAlert width="16" height="16" />;
    case 'danger':  return <Close width="16" height="16" />;
    default:        return <InfoBox width="16" height="16" />;
  }
}
