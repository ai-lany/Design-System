import {
  createContext,
  forwardRef,
  useContext,
  useId,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import styles from './Radio.module.css';

/* ── Context ──────────────────────────────────────────────────────── */

interface RadioGroupContextValue {
  name: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/* ── RadioGroup ───────────────────────────────────────────────────── */

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Controlled selected value. */
  value: string;
  onChange: (value: string) => void;
  label?: ReactNode;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  name?: string;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { value, onChange, label, orientation = 'vertical', disabled, name, className, children, ...rest },
  ref,
) {
  const generatedName = useId();
  const groupName = name ?? generatedName;

  return (
    <RadioGroupContext.Provider value={{ name: groupName, value, onChange, disabled }}>
      <div
        ref={ref}
        role="radiogroup"
        aria-label={typeof label === 'string' ? label : undefined}
        className={cn(styles.group, className)}
        data-orientation={orientation}
        {...rest}
      >
        {label && <span className={styles.groupLabel}>{label}</span>}
        <div className={styles.groupItems} data-orientation={orientation}>
          {children}
        </div>
      </div>
    </RadioGroupContext.Provider>
  );
});

/* ── Radio ────────────────────────────────────────────────────────── */

export type RadioSize = 'sm' | 'md';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  value: string;
  label?: ReactNode;
  radioSize?: RadioSize;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, label, radioSize = 'md', id, className, disabled, onChange, checked, ...rest },
  ref,
) {
  const ctx = useContext(RadioGroupContext);
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const isChecked = ctx ? ctx.value === value : checked;
  const isDisabled = disabled ?? ctx?.disabled;
  const name = ctx?.name ?? rest.name;

  const handleChange = () => {
    if (ctx) ctx.onChange(value);
    onChange?.({ target: { value } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <label
      htmlFor={inputId}
      className={cn(styles.root, className)}
      data-size={radioSize}
      data-disabled={isDisabled || undefined}
    >
      <input
        ref={ref}
        id={inputId}
        type="radio"
        value={value}
        name={name}
        checked={isChecked}
        disabled={isDisabled}
        onChange={handleChange}
        className={styles.input}
        {...rest}
      />
      <span className={styles.circle} aria-hidden="true" />
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
});
