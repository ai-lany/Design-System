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
import { Check, ChevronDown } from 'pixelarticons/react';
import { cn } from '../../lib/cn';
import type { SelectOption } from '../Select';
import styles from './Combobox.module.css';

export type ComboboxSize = 'sm' | 'md' | 'lg';

export interface ComboboxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  label?: ReactNode;
  helperText?: ReactNode;
  error?: boolean | string;
  inputSize?: ComboboxSize;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  /** Custom filter. Defaults to case-insensitive label match. */
  filterFn?: (option: SelectOption, query: string) => boolean;
}

const defaultFilter = (opt: SelectOption, q: string) =>
  opt.label.toLowerCase().includes(q.toLowerCase());

export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(function Combobox(
  {
    options,
    value: controlledValue,
    onChange,
    defaultValue,
    placeholder = 'Search…',
    label,
    helperText,
    error,
    inputSize = 'md',
    disabled = false,
    required,
    name,
    id,
    className,
    filterFn = defaultFilter,
    ...rest
  },
  ref,
) {
  const baseId = useId();
  const inputId = id ?? `${baseId}-input`;
  const labelId = `${baseId}-label`;
  const listboxId = `${baseId}-listbox`;
  const helperId = `${baseId}-helper`;
  const optionId = (v: string) => `${baseId}-opt-${encodeURIComponent(v)}`;

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const currentValue = isControlled ? controlledValue : internalValue;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const innerRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({});

  useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;
  const helper = errorMessage ?? helperText;

  const filtered = open ? options.filter(o => filterFn(o, query)) : options;
  const selectedOption = options.find(o => o.value === currentValue);

  const commit = useCallback(
    (opt: SelectOption) => {
      if (opt.disabled) return;
      if (!isControlled) setInternalValue(opt.value);
      onChange?.(opt.value);
      setQuery('');
      setOpen(false);
      inputRef.current?.blur();
    },
    [isControlled, onChange],
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setFocusedIndex(-1);
  }, []);

  const updatePosition = useCallback(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: 'fixed',
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
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
      if (!innerRef.current?.contains(t) && !listboxRef.current?.contains(t)) close();
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open, close]);

  // Scroll focused option into view
  useEffect(() => {
    if (!open || focusedIndex < 0 || !listboxRef.current) return;
    const opt = filtered[focusedIndex];
    if (!opt) return;
    const el = listboxRef.current.querySelector<HTMLElement>(`[id="${optionId(opt.value)}"]`);
    if (!el) return;
    const list = listboxRef.current;
    if (el.offsetTop < list.scrollTop) list.scrollTop = el.offsetTop;
    else if (el.offsetTop + el.offsetHeight > list.scrollTop + list.clientHeight)
      list.scrollTop = el.offsetTop + el.offsetHeight - list.clientHeight;
  }, [focusedIndex, open]);

  const enabledIndices = filtered
    .map((o, i) => (o.disabled ? -1 : i))
    .filter(i => i >= 0);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setFocusedIndex(enabledIndices[0] ?? -1); }
      return;
    }
    const pos = enabledIndices.indexOf(focusedIndex);
    switch (e.key) {
      case 'ArrowDown': { e.preventDefault(); const next = enabledIndices[Math.min(pos + 1, enabledIndices.length - 1)]; if (next !== undefined) setFocusedIndex(next); break; }
      case 'ArrowUp':   { e.preventDefault(); const prev = enabledIndices[Math.max(pos - 1, 0)]; if (prev !== undefined) setFocusedIndex(prev); break; }
      case 'Enter': { e.preventDefault(); const opt = focusedIndex >= 0 ? filtered[focusedIndex] : undefined; if (opt) commit(opt); break; }
      case 'Escape': e.preventDefault(); close(); break;
      case 'Tab': close(); break;
    }
  };

  return (
    <div ref={innerRef} className={cn(styles.root, className)} data-size={inputSize} {...rest}>
      {name && <input type="hidden" name={name} value={currentValue} />}
      {label && (
        <label id={labelId} htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span aria-hidden="true" className={styles.required}>*</span>}
        </label>
      )}
      <div ref={anchorRef} className={styles.anchor}>
        <div
          className={styles.field}
          data-disabled={disabled || undefined}
          data-error={hasError || undefined}
          data-open={open || undefined}
        >
          <input
            ref={inputRef}
            id={inputId}
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            aria-labelledby={label ? labelId : undefined}
            aria-required={required}
            aria-invalid={hasError || undefined}
            aria-describedby={helper ? helperId : undefined}
            aria-autocomplete="list"
            className={styles.input}
            disabled={disabled}
            value={open ? query : (selectedOption?.label ?? '')}
            placeholder={open ? placeholder : (selectedOption ? undefined : placeholder)}
            onChange={e => { setQuery(e.target.value); setFocusedIndex(-1); }}
            onFocus={() => { setOpen(true); setQuery(''); }}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          <span className={styles.chevron} aria-hidden="true">
            <ChevronDown width="12" height="12" />
          </span>
        </div>

        {open &&
          createPortal(
            <ul
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              className={styles.dropdown}
              style={dropdownStyle}
            >
              {filtered.length === 0 ? (
                <li className={styles.empty} role="option" aria-disabled="true">No results</li>
              ) : (
                filtered.map((opt, i) => (
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
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => commit(opt)}
                    onMouseEnter={() => !opt.disabled && setFocusedIndex(i)}
                  >
                    {opt.label}
                    <span className={styles.checkIcon} aria-hidden="true">
                      {opt.value === currentValue && <Check width="12" height="12" />}
                    </span>
                  </li>
                ))
              )}
            </ul>,
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
