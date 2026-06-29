import { forwardRef, useState, type ChangeEvent, type HTMLAttributes } from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../../lib/cn';
import styles from './StickyNote.module.css';

export type StickyColor = 'yellow' | 'green' | 'pink' | 'blue' | 'purple';
export type StickySize  = 'sm' | 'md' | 'lg';

export interface StickyNoteProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Controlled markdown content. */
  value?: string;
  /** Uncontrolled initial content. */
  defaultValue?: string;
  /** Called with the new string whenever the user edits in edit mode. */
  onChange?: (value: string) => void;
  /** Note background color. Defaults to 'yellow'. */
  color?: StickyColor;
  /** Fixed size preset. Defaults to 'md'. */
  size?: StickySize;
  /** When true, renders markdown instead of a textarea. */
  readOnly?: boolean;
  /** Placeholder shown in edit mode when the note is empty. */
  placeholder?: string;
}

export const StickyNote = forwardRef<HTMLDivElement, StickyNoteProps>(function StickyNote(
  {
    value,
    defaultValue,
    onChange,
    color = 'yellow',
    size = 'md',
    readOnly = false,
    placeholder = 'Write something\u2026',
    className,
    ...rest
  },
  ref,
) {
  const [internal, setInternal] = useState(defaultValue ?? '');
  const controlled = value !== undefined;
  const text = controlled ? value : internal;

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    if (!controlled) setInternal(e.target.value);
    onChange?.(e.target.value);
  }

  return (
    <div
      ref={ref}
      data-color={color}
      data-size={size}
      className={cn(styles.note, className)}
      {...rest}
    >
      {readOnly ? (
        <div className={styles.prose}>
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          className={styles.textarea}
          value={text}
          onChange={handleChange}
          placeholder={placeholder}
        />
      )}
    </div>
  );
});
