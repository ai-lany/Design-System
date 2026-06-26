import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import styles from './DatePicker.module.css';

export type DatePickerSize = 'sm' | 'md' | 'lg';

export interface DatePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean | string;
  helperText?: ReactNode;
  inputSize?: DatePickerSize;
  /** Minimum selectable date. */
  min?: Date;
  /** Maximum selectable date. */
  max?: Date;
  id?: string;
}

/* ── Calendar helpers ────────────────────────────────────────────── */

interface CalDay {
  date: Date;
  isCurrentMonth: boolean;
}

function getCalendarDays(year: number, month: number): CalDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7; // Monday = 0

  const days: CalDay[] = [];

  for (let i = startDow; i > 0; i--) {
    days.push({ date: new Date(year, month, 1 - i), isCurrentMonth: false });
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push({ date: new Date(year, month, d), isCurrentMonth: true });
  }
  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
  }

  return days;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d);
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

/* ── Component ───────────────────────────────────────────────────── */

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(function DatePicker(
  {
    value: controlledValue,
    onChange,
    label,
    placeholder = 'Select a date…',
    disabled = false,
    error,
    helperText,
    inputSize = 'md',
    min,
    max,
    id,
    className,
    ...rest
  },
  ref,
) {
  const baseId = useId();
  const inputId = id ?? `${baseId}-input`;
  const helperId = `${baseId}-helper`;

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<Date | null>(null);
  const value = isControlled ? (controlledValue ?? null) : internalValue;

  const today = new Date();
  const [viewYear, setViewYear] = useState(value?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(value?.getMonth() ?? today.getMonth());
  const [open, setOpen] = useState(false);
  const [calStyle, setCalStyle] = useState<CSSProperties>({});

  const innerRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;
  const helper = errorMessage ?? helperText;

  const select = useCallback(
    (d: Date) => {
      if (!isControlled) setInternalValue(d);
      onChange?.(d);
      setOpen(false);
    },
    [isControlled, onChange],
  );

  const clear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isControlled) setInternalValue(null);
      onChange?.(null);
    },
    [isControlled, onChange],
  );

  const updatePosition = useCallback(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const calH = calRef.current?.offsetHeight ?? 320;
    const below = rect.bottom + 6 + calH < window.innerHeight;
    setCalStyle({
      position: 'fixed',
      left: Math.min(rect.left, window.innerWidth - 300 - 8),
      top: below ? rect.bottom + 6 : rect.top - calH - 6,
      zIndex: 9999,
    });
  }, []);

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
      if (!innerRef.current?.contains(t) && !calRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const days = getCalendarDays(viewYear, viewMonth);

  const isDisabled = (d: Date) => {
    if (min && d < min) return true;
    if (max && d > max) return true;
    return false;
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  return (
    <div ref={innerRef} className={cn(styles.root, className)} data-size={inputSize} {...rest}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}

      <div ref={anchorRef} className={styles.anchor}>
        <div
          className={styles.field}
          data-disabled={disabled || undefined}
          data-error={hasError || undefined}
          data-open={open || undefined}
        >
          <span className={styles.calIcon} aria-hidden="true">
            <CalendarIcon />
          </span>
          <button
            id={inputId}
            type="button"
            className={styles.trigger}
            disabled={disabled}
            onClick={() => !disabled && setOpen(v => !v)}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-describedby={helper ? helperId : undefined}
            aria-invalid={hasError || undefined}
          >
            {value ? (
              <span className={styles.valueText}>{formatDate(value)}</span>
            ) : (
              <span className={styles.placeholder}>{placeholder}</span>
            )}
          </button>
          {value && !disabled && (
            <button
              type="button"
              className={styles.clearBtn}
              aria-label="Clear date"
              onClick={clear}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {helper && (
        <p id={helperId} className={styles.helper} data-error={hasError || undefined}>
          {helper}
        </p>
      )}

      {open &&
        createPortal(
          <div
            ref={calRef}
            className={styles.calendar}
            style={calStyle}
            role="dialog"
            aria-label="Date picker"
          >
            {/* Header */}
            <div className={styles.calHeader}>
              <button type="button" className={styles.navBtn} onClick={prevMonth} aria-label="Previous month">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className={styles.calTitle}>{MONTHS[viewMonth]} {viewYear}</span>
              <button type="button" className={styles.navBtn} onClick={nextMonth} aria-label="Next month">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Weekday labels */}
            <div className={styles.weekdays}>
              {WEEKDAYS.map(d => <span key={d} className={styles.weekday}>{d}</span>)}
            </div>

            {/* Days grid */}
            <div className={styles.daysGrid}>
              {days.map((day, i) => {
                const disabled2 = isDisabled(day.date);
                const isToday = sameDay(day.date, today);
                const isSelected = value ? sameDay(day.date, value) : false;
                return (
                  <button
                    key={i}
                    type="button"
                    className={styles.day}
                    data-today={isToday || undefined}
                    data-selected={isSelected || undefined}
                    data-outside={!day.isCurrentMonth || undefined}
                    disabled={disabled2}
                    onClick={() => !disabled2 && select(day.date)}
                    aria-label={formatDate(day.date)}
                    aria-pressed={isSelected}
                  >
                    {day.date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className={styles.calFooter}>
              <button
                type="button"
                className={styles.todayBtn}
                onClick={() => {
                  setViewYear(today.getFullYear());
                  setViewMonth(today.getMonth());
                  select(today);
                }}
              >
                Today
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
});

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 1v3M9.5 1v3M1.5 6h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
