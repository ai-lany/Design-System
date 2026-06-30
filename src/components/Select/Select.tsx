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
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'pixelarticons/react';
import { cn } from '../../lib/cn';
import styles from './Select.module.css';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SelectOption[];
  /** Controlled selected value. */
  value?: string;
  onChange?: (value: string) => void;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /** Text shown when nothing is selected. */
  placeholder?: string;
  label?: ReactNode;
  helperText?: ReactNode;
  /** Show an error state. If a string, it replaces helperText. */
  error?: boolean | string;
  inputSize?: SelectSize;
  /** Optional element rendered on the left of the trigger. */
  leadingIcon?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  /** Renders a hidden <input> with this name for form submission. */
  name?: string;
  id?: string;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(function Select(
  {
    options,
    value: controlledValue,
    onChange,
    defaultValue,
    placeholder = 'Select…',
    label,
    helperText,
    error,
    inputSize = 'md',
    leadingIcon,
    disabled = false,
    required,
    name,
    id,
    className,
    ...rest
  },
  ref,
) {
  const baseId = useId();
  const triggerId = id ?? `${baseId}-trigger`;
  const labelId = `${baseId}-label`;
  const listboxId = `${baseId}-listbox`;
  const helperId = `${baseId}-helper`;
  const optionId = (val: string) => `${baseId}-opt-${encodeURIComponent(val)}`;

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const currentValue = isControlled ? controlledValue : internalValue;

  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const innerRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({});

  useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;
  const helper = errorMessage ?? helperText;

  const selectedOption = options.find(o => o.value === currentValue);

  const enabledIndices = options
    .map((o, i) => (o.disabled ? -1 : i))
    .filter(i => i >= 0);

  const commit = useCallback((opt: SelectOption) => {
    if (opt.disabled) return;
    if (!isControlled) setInternalValue(opt.value);
    onChange?.(opt.value);
    setOpen(false);
    triggerRef.current?.focus();
  }, [isControlled, onChange]);

  const openAt = useCallback((idx: number) => {
    if (disabled) return;
    setOpen(true);
    setFocusedIndex(idx);
  }, [disabled]);

  const close = useCallback(() => {
    setOpen(false);
    setFocusedIndex(-1);
  }, []);

  // Scroll focused option into view within the listbox only
  useEffect(() => {
    if (!open || focusedIndex < 0 || !listboxRef.current) return;
    const opt = options[focusedIndex];
    if (!opt) return;
    const el = listboxRef.current.querySelector<HTMLElement>(`[id="${optionId(opt.value)}"]`);
    if (!el) return;
    const list = listboxRef.current;
    if (el.offsetTop < list.scrollTop) {
      list.scrollTop = el.offsetTop;
    } else if (el.offsetTop + el.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = el.offsetTop + el.offsetHeight - list.clientHeight;
    }
  }, [focusedIndex, open]);

  // Position the portal dropdown under the anchor
  useEffect(() => {
    if (!open) return;
    const updatePos = () => {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    };
    updatePos();
    window.addEventListener('scroll', updatePos, true);
    window.addEventListener('resize', updatePos);
    return () => {
      window.removeEventListener('scroll', updatePos, true);
      window.removeEventListener('resize', updatePos);
    };
  }, [open]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !innerRef.current?.contains(target) &&
        !listboxRef.current?.contains(target)
      ) {
        close();
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open, close]);

  const handleTriggerClick = () => {
    if (disabled) return;
    if (open) {
      close();
    } else {
      const sel = options.findIndex(o => o.value === currentValue);
      openAt(sel >= 0 ? sel : (enabledIndices[0] ?? 0));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        const sel = options.findIndex(o => o.value === currentValue);
        openAt(sel >= 0 ? sel : (enabledIndices[0] ?? 0));
      }
      return;
    }

    const pos = enabledIndices.indexOf(focusedIndex);

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const next = enabledIndices[Math.min(pos + 1, enabledIndices.length - 1)];
        if (next !== undefined) setFocusedIndex(next);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prev = enabledIndices[Math.max(pos - 1, 0)];
        if (prev !== undefined) setFocusedIndex(prev);
        break;
      }
      case 'Home': {
        e.preventDefault();
        const first = enabledIndices[0];
        if (first !== undefined) setFocusedIndex(first);
        break;
      }
      case 'End': {
        e.preventDefault();
        const last = enabledIndices[enabledIndices.length - 1];
        if (last !== undefined) setFocusedIndex(last);
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        const opt = focusedIndex >= 0 ? options[focusedIndex] : undefined;
        if (opt) commit(opt);
        break;
      }
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'Tab':
        close();
        break;
      default: {
        // Typeahead: jump to first option starting with the typed char
        if (e.key.length !== 1) break;
        const char = e.key.toLowerCase();
        const start = focusedIndex >= 0 ? focusedIndex + 1 : 0;
        const pool = [...options.slice(start), ...options.slice(0, start)];
        const match = pool.find(o => !o.disabled && o.label.toLowerCase().startsWith(char));
        if (match) setFocusedIndex(options.indexOf(match));
        break;
      }
    }
  };

  return (
    <div
      ref={innerRef}
      className={cn(styles.root, className)}
      data-size={inputSize}
      {...rest}
    >
      {name && <input type="hidden" name={name} value={currentValue} />}

      {label && (
        <label id={labelId} htmlFor={triggerId} className={styles.label}>
          {label}
          {required && <span aria-hidden="true" className={styles.required}>*</span>}
        </label>
      )}

      {/* Anchor: field + dropdown positioned relative to this */}
      <div ref={anchorRef} className={styles.anchor}>
        <div
          className={styles.field}
          data-disabled={disabled || undefined}
          data-error={hasError || undefined}
          data-open={open || undefined}
        >
          {leadingIcon && <span className={styles.leadingIcon}>{leadingIcon}</span>}

          <button
            ref={triggerRef}
            id={triggerId}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            aria-labelledby={label ? labelId : undefined}
            aria-activedescendant={
              open && focusedIndex >= 0 && focusedIndex < options.length
                ? optionId(options[focusedIndex]!.value)
                : undefined
            }
            aria-required={required}
            aria-invalid={hasError || undefined}
            aria-describedby={helper ? helperId : undefined}
            disabled={disabled}
            className={styles.trigger}
            onClick={handleTriggerClick}
            onKeyDown={handleKeyDown}
          >
            {selectedOption ? (
              <span className={styles.value}>{selectedOption.label}</span>
            ) : (
              <span className={styles.placeholder}>{placeholder}</span>
            )}
            <span className={cn(styles.chevron, open && styles.chevronOpen)} aria-hidden="true">
              <ChevronDown width="12" height="12" />
            </span>
          </button>
        </div>

        {open && createPortal(
          <div className={styles.dropdownWrapper} style={dropdownStyle}>
            <ul
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              aria-label={typeof label === 'string' ? label : undefined}
              className={styles.dropdown}
            >
              {options.length === 0 && (
                <li className={styles.empty} role="option" aria-disabled="true">No options</li>
              )}
              {options.map((opt, i) => (
                <li
                  key={opt.value}
                  id={optionId(opt.value)}
                  role="option"
                  aria-selected={opt.value === currentValue}
                  aria-disabled={opt.disabled}
                  data-focused={i === focusedIndex || undefined}
                  data-selected={opt.value === currentValue || undefined}
                  data-disabled={opt.disabled || undefined}
                  className={styles.option}
                  onMouseDown={e => e.preventDefault()} // keep trigger focused
                  onClick={() => commit(opt)}
                  onMouseEnter={() => !opt.disabled && setFocusedIndex(i)}
                >
                  {opt.label}
                  <span className={styles.checkIcon} aria-hidden="true">
                    {opt.value === currentValue && <Check width="12" height="12" />}
                  </span>
                </li>
              ))}
            </ul>
          </div>,
          document.body,
        )}
      </div>

      {helper && (
        <p id={helperId} className={styles.helper} data-error={hasError || undefined}>
          {helper}
        </p>
      )}
    </div>
  );
});
