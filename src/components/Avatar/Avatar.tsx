import { forwardRef, useState, useEffect, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './Avatar.module.css';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Image source. Falls back to initials if absent or fails to load. */
  src?: string;
  /** Person/entity name. Used to derive initials and the image alt. */
  name?: string;
  size?: AvatarSize;
  /** Optional status indicator dot. */
  status?: AvatarStatus;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, name = '', size = 'md', status, className, ...rest },
  ref,
) {
  const [imageFailed, setImageFailed] = useState(false);

  // Reset failure state when src changes
  useEffect(() => {
    setImageFailed(false);
  }, [src]);

  const showImage = src && !imageFailed;

  return (
    <span
      ref={ref}
      data-size={size}
      className={cn(styles.avatar, className)}
      {...rest}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          className={styles.image}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className={styles.initials} aria-label={name || undefined}>
          {getInitials(name)}
        </span>
      )}
      {status && <span data-status={status} className={styles.status} aria-hidden="true" />}
    </span>
  );
});
