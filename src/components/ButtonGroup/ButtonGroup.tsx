import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './ButtonGroup.module.css';

export interface ButtonGroupItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ButtonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: ButtonGroupItem[];
  value: string;
  onChange: (value: string) => void;
}

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { items, value, onChange, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} role="group" className={cn(styles.group, className)} {...rest}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          disabled={item.disabled}
          data-active={value === item.value || undefined}
          className={styles.item}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
});
