import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import styles from './Modal.module.css';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'onClose' | 'title'> {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  /** Click outside the panel to close. Default: true. */
  dismissOnBackdrop?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  /** Slot rendered in the footer (typically action buttons). */
  footer?: ReactNode;
  children?: ReactNode;
}

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(function Modal(
  {
    open,
    onClose,
    size = 'md',
    dismissOnBackdrop = true,
    title,
    description,
    footer,
    className,
    children,
    ...rest
  },
  ref,
) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => dialogRef.current as HTMLDialogElement);

  // Sync `open` prop with the native dialog's open state.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Native dialog's "close" event fires for ESC, form method=dialog, and .close()
  const handleClose = useCallback(() => {
    if (open) onClose();
  }, [open, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (!dismissOnBackdrop) return;
      // Clicks on the dialog element itself (not its children) are backdrop clicks.
      if (e.target === dialogRef.current) onClose();
    },
    [dismissOnBackdrop, onClose],
  );

  return (
    <dialog
      ref={dialogRef}
      data-size={size}
      className={cn(styles.dialog, className)}
      onClose={handleClose}
      onClick={handleBackdropClick}
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
      {...rest}
    >
      <div className={styles.panel}>
        {(title || description) && (
          <header className={styles.header}>
            {title && (
              <h2 id="modal-title" className={styles.title}>
                {title}
              </h2>
            )}
            {description && (
              <p id="modal-description" className={styles.description}>
                {description}
              </p>
            )}
          </header>
        )}

        {children && <div className={styles.body}>{children}</div>}

        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </dialog>
  );
});
