import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Check, Close, InfoBox, SquareAlert } from 'pixelarticons/react';
import { cn } from '../../lib/cn';
import styles from './Alert.module.css';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: AlertTone;
  title?: ReactNode;
  /** Callback when the dismiss button is clicked. Omit to hide the button. */
  onClose?: () => void;
  children?: ReactNode;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { tone = 'info', title, onClose, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="alert"
      data-tone={tone}
      className={cn(styles.alert, className)}
      {...rest}
    >
      <span className={styles.icon} aria-hidden="true">
        <AlertIcon tone={tone} />
      </span>
      <div className={styles.body}>
        {title && <p className={styles.title}>{title}</p>}
        {children && <div className={styles.description}>{children}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          className={styles.close}
          aria-label="Dismiss"
          onClick={onClose}
        >
          <Close width="12" height="12" />
        </button>
      )}
    </div>
  );
});

function AlertIcon({ tone }: { tone: AlertTone }) {
  switch (tone) {
    case 'info':    return <InfoBox width="16" height="16" />;
    case 'success': return <Check width="16" height="16" />;
    case 'warning': return <SquareAlert width="16" height="16" />;
    case 'danger':  return <Close width="16" height="16" />;
  }
}
