import {
  createContext,
  forwardRef,
  useContext,
  useId,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import styles from './FormField.module.css';

/* ── Context ──────────────────────────────────────────────────────── */

interface FormFieldContextValue {
  id: string;
  required: boolean;
  hasError: boolean;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

/** Access the generated field id and error state from inside a FormField. */
export function useFormField() {
  return useContext(FormFieldContext);
}

/* ── FormField ────────────────────────────────────────────────────── */

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  helperText?: ReactNode;
  /** Show an error state. If a string, it replaces helperText. */
  error?: boolean | string;
  required?: boolean;
  /** The id of the associated control (used for the label's htmlFor). */
  htmlFor?: string;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(function FormField(
  { label, helperText, error, required, htmlFor, className, children, ...rest },
  ref,
) {
  const generatedId = useId();
  const fieldId = htmlFor ?? generatedId;
  const helperId = `${fieldId}-helper`;

  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;
  const helper = errorMessage ?? helperText;

  return (
    <FormFieldContext.Provider value={{ id: fieldId, required: Boolean(required), hasError }}>
      <div ref={ref} className={cn(styles.root, className)} {...rest}>
        {label && (
          <label htmlFor={fieldId} className={styles.label}>
            {label}
            {required && <span aria-hidden="true" className={styles.required}>*</span>}
          </label>
        )}
        {children}
        {helper && (
          <p id={helperId} className={styles.helper} data-error={hasError || undefined}>
            {helper}
          </p>
        )}
      </div>
    </FormFieldContext.Provider>
  );
});
