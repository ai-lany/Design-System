import { forwardRef, useEffect, useRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './Checkbox.module.css';

export type CheckboxSize = 'sm' | 'md';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: ReactNode;
  checkboxSize?: CheckboxSize;
  /** Renders a dash instead of a checkmark — used for "select all" rows. */
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    label,
    checkboxSize = 'md',
    indeterminate = false,
    id,
    className,
    disabled,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const innerRef = useRef<HTMLInputElement>(null);

  // Forward both the external ref and our internal one
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    el.indeterminate = indeterminate;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  }, [indeterminate, ref]);

  return (
    <label
      htmlFor={inputId}
      className={cn(styles.root, className)}
      data-size={checkboxSize}
      data-disabled={disabled || undefined}
    >
      <input
        ref={innerRef}
        id={inputId}
        type="checkbox"
        disabled={disabled}
        className={styles.input}
        {...rest}
      />
      <span className={styles.box} aria-hidden="true" />
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
});
