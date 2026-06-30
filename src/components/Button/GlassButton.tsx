import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import LiquidGlass from 'liquid-glass-react';
import { cn } from '../../lib/cn';
import styles from './GlassButton.module.css';

export type GlassButtonSize = 'sm' | 'md' | 'lg';

export interface GlassButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  size?: GlassButtonSize;
  leading?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
}

const paddingMap: Record<GlassButtonSize, string> = {
  sm: '4px 12px',
  md: '6px 16px',
  lg: '10px 22px',
};

const fontSizeMap: Record<GlassButtonSize, string> = {
  sm: 'var(--text-sm)',
  md: 'var(--text-sm)',
  lg: 'var(--text-base)',
};

export function GlassButton({
  size = 'md',
  leading,
  trailing,
  disabled,
  children,
  className,
  onClick,
  style,
}: GlassButtonProps) {
  return (
    <LiquidGlass
      cornerRadius={999}
      padding={paddingMap[size]}
      elasticity={0.35}
      displacementScale={64}
      blurAmount={0.1}
      saturation={130}
      aberrationIntensity={2}
      onClick={disabled ? undefined : onClick}
      className={cn(styles.root, className)}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        display: 'inline-flex',
        ...style,
      }}
    >
      <span
        className={styles.content}
        style={{
          fontSize: fontSizeMap[size],
          fontFamily: 'var(--font-sans)',
          fontWeight: 'var(--weight-medium)',
        }}
      >
        {leading && <span className={styles.affix}>{leading}</span>}
        {children != null && <span className={styles.label}>{children}</span>}
        {trailing && <span className={styles.affix}>{trailing}</span>}
      </span>
    </LiquidGlass>
  );
}
