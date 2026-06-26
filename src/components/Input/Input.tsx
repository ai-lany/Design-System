import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './Input.module.css';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: ReactNode;
  helperText?: ReactNode;
  /** Show an error state. If a string, it replaces helperText. */
  error?: boolean | string;
  inputSize?: InputSize;
  /** Optional element rendered inside the input, on the left. */
  leadingIcon?: ReactNode;
  /** Optional element rendered inside the input, on the right. */
  trailingIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    helperText,
    error,
    inputSize = 'md',
    leadingIcon,
    trailingIcon,
    id,
    className,
    disabled,
    required,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;

  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;
  const helper = errorMessage ?? helperText;

  return (
    <div className={cn(styles.root, className)} data-size={inputSize}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span aria-hidden="true" className={styles.required}>*</span>}
        </label>
      )}

      <div
        className={styles.field}
        data-disabled={disabled || undefined}
        data-error={hasError || undefined}
      >
        {leadingIcon && <span className={styles.icon}>{leadingIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={styles.input}
          disabled={disabled}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={helper ? helperId : undefined}
          {...rest}
        />
        {trailingIcon && <span className={styles.icon}>{trailingIcon}</span>}
      </div>

      {helper && (
        <p
          id={helperId}
          className={styles.helper}
          data-error={hasError || undefined}
        >
          {helper}
        </p>
      )}
    </div>
  );
});
