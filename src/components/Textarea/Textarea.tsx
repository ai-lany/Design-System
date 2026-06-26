import { forwardRef, useId, useState, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { highlight } from '../../lib/highlight';
import styles from './Textarea.module.css';

export type TextareaVariant = 'default' | 'code';
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {
  label?: ReactNode;
  helperText?: ReactNode;
  /** Show an error state. If a string, it replaces helperText. */
  error?: boolean | string;
  /** 'code' renders a read-only highlighted code block instead of a textarea. */
  variant?: TextareaVariant;
  resize?: TextareaResize;
  rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    helperText,
    error,
    variant = 'default',
    resize = 'vertical',
    rows = 4,
    id,
    className,
    disabled,
    required,
    value,
    onChange,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const helperId = `${textareaId}-helper`;

  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;
  const helper = errorMessage ?? helperText;

  const [localValue, setLocalValue] = useState<string>(
    String(value ?? rest.defaultValue ?? ''),
  );

  if (variant === 'code') {
    const isControlled = value !== undefined;
    const displayValue = isControlled ? String(value) : localValue;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) setLocalValue(e.target.value);
      onChange?.(e);
    };

    return (
      <div className={cn(styles.root, className)}>
        {label && (
          <label htmlFor={textareaId} className={styles.label}>
            {label}
            {required && <span aria-hidden="true" className={styles.required}>*</span>}
          </label>
        )}
        <div
          className={styles.codeWrapper}
          data-error={hasError || undefined}
          data-disabled={disabled || undefined}
        >
          <div className={styles.codeInner}>
            <pre className={styles.codePre} aria-hidden="true">
              {highlight(displayValue + '\n')}
            </pre>
            <textarea
              ref={ref}
              id={textareaId}
              className={styles.codeTextarea}
              disabled={disabled}
              required={required}
              value={isControlled ? value : undefined}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
              aria-invalid={hasError || undefined}
              aria-describedby={helper ? helperId : undefined}
              onChange={handleChange}
              {...rest}
            />
          </div>
        </div>
        {helper && (
          <p id={helperId} className={styles.helper} data-error={hasError || undefined}>
            {helper}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn(styles.root, className)}>
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
          {required && <span aria-hidden="true" className={styles.required}>*</span>}
        </label>
      )}
      <div
        className={styles.field}
        data-disabled={disabled || undefined}
        data-error={hasError || undefined}
      >
        <textarea
          ref={ref}
          id={textareaId}
          className={styles.textarea}
          disabled={disabled}
          required={required}
          rows={rows}
          aria-invalid={hasError || undefined}
          aria-describedby={helper ? helperId : undefined}
          value={value}
          style={{ resize }}
          {...rest}
        />
      </div>
      {helper && (
        <p id={helperId} className={styles.helper} data-error={hasError || undefined}>
          {helper}
        </p>
      )}
    </div>
  );
});
