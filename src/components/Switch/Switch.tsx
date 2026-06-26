import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './Switch.module.css';

export type SwitchSize = 'sm' | 'md';

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: ReactNode;
  /** Visual size. Defaults to 'md'. */
  switchSize?: SwitchSize;
  /** Label position. Defaults to 'end' (right). */
  labelPosition?: 'start' | 'end';
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    label,
    switchSize = 'md',
    labelPosition = 'end',
    id,
    className,
    disabled,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <label
      htmlFor={inputId}
      className={cn(styles.root, className)}
      data-size={switchSize}
      data-label-position={labelPosition}
      data-disabled={disabled || undefined}
    >
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        role="switch"
        disabled={disabled}
        className={styles.input}
        {...rest}
      />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
});
