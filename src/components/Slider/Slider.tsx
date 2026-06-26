import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import styles from './Slider.module.css';

export type SliderVariant = 'filled' | 'plain';

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onChange'> {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  label?: ReactNode;
  showValue?: boolean;
  /** Format the displayed value. Default: v => String(v) */
  formatValue?: (value: number) => string;
  disabled?: boolean;
  /** 'filled' (default) colors the track left of the thumb. 'plain' shows a uniform track. */
  variant?: SliderVariant;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    min = 0,
    max = 100,
    step = 1,
    value: controlledValue,
    defaultValue,
    onChange,
    label,
    showValue = true,
    formatValue = String,
    disabled,
    variant = 'filled',
    id,
    className,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? min);
  const value = isControlled ? controlledValue : internalValue;

  const pct = ((value - min) / (max - min)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    if (!isControlled) setInternalValue(v);
    onChange?.(v);
  };

  return (
    <div className={cn(styles.root, className)} data-disabled={disabled || undefined}>
      {(label || showValue) && (
        <div className={styles.header}>
          {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
          {showValue && (
            <span className={styles.valueDisplay}>{formatValue(value)}</span>
          )}
        </div>
      )}
      <div className={styles.trackWrapper}>
        <div className={styles.track} />
        {variant === 'filled' && (
          <div className={styles.fill} style={{ width: `${pct}%` }} />
        )}
        <input
          ref={ref}
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          className={styles.input}
          {...rest}
        />
      </div>
    </div>
  );
});
