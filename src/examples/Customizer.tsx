import { useState, useCallback } from 'react';
import { Button, Card, Col, Divider, Row } from '../index';

// ── Token defaults (mirror tokens.css) ────────────────────────────────────────

const DEFAULTS = {
  accentHex:  '#5b5bd6',
  radius:     6,          // px — maps to --radius-md; others scale from it
  fontSans:   'default' as 'default' | 'serif' | 'mono',
  textBase:   16,         // px
  motion:     'normal' as 'normal' | 'reduced' | 'none',
};

const FONT_STACKS: Record<string, { sans: string; display: string }> = {
  default: {
    sans:    '"Funnel Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    display: '"Funnel Display", ui-sans-serif, system-ui, sans-serif',
  },
  serif: {
    sans:    'Georgia, "Times New Roman", Times, serif',
    display: 'Georgia, "Times New Roman", Times, serif',
  },
  mono: {
    sans:    'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
    display: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Hex → { r, g, b } */
function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** Darken a hex color by mixing with black. amount 0–1 */
function darken(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  const f = 1 - amount;
  return `rgb(${Math.round(r * f)}, ${Math.round(g * f)}, ${Math.round(b * f)})`;
}

/** Lighten a hex color toward white. amount 0–1 */
function lighten(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.round(r + (255 - r) * amount)}, ${Math.round(g + (255 - g) * amount)}, ${Math.round(b + (255 - b) * amount)})`;
}

/** WCAG relative luminance of a hex color (0 = black, 1 = white) */
function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const linearize = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/** WCAG contrast ratio between two luminance values */
function contrastRatio(L1: number, L2: number): number {
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

/**
 * Returns white or near-black — whichever achieves better WCAG contrast
 * against the given background color.
 */
function getContrastForeground(hex: string): string {
  const L = relativeLuminance(hex);
  const whiteContrast = contrastRatio(1, L);
  const blackContrast = contrastRatio(L, 0);
  return whiteContrast >= blackContrast ? '#ffffff' : '#161614';
}

function set(prop: string, value: string) {
  document.documentElement.style.setProperty(prop, value);
}

function unset(prop: string) {
  document.documentElement.style.removeProperty(prop);
}

// ── Apply functions ───────────────────────────────────────────────────────────

function applyAccent(hex: string) {
  set('--color-accent',        hex);
  set('--color-accent-hover',  darken(hex, 0.12));
  set('--color-accent-active', darken(hex, 0.24));
  set('--color-accent-subtle', lighten(hex, 0.88));
  set('--color-border-focus',  hex);
  set('--color-fg-on-accent',  getContrastForeground(hex));
}

function applyRadius(base: number) {
  set('--radius-sm',   `${Math.max(0, base - 2)}px`);
  set('--radius-md',   `${base}px`);
  set('--radius-lg',   `${base + 4}px`);
  set('--radius-xl',   `${base + 10}px`);
}

function applyFont(key: 'default' | 'serif' | 'mono') {
  const stack = FONT_STACKS[key] ?? FONT_STACKS['default']!;
  set('--font-sans',    stack.sans);
  set('--font-display', stack.display);
}

function applyTextBase(px: number) {
  set('--text-xs',   `${Math.round(px * 0.75)}px`);
  set('--text-sm',   `${Math.round(px * 0.875)}px`);
  set('--text-base', `${px}px`);
  set('--text-lg',   `${Math.round(px * 1.125)}px`);
  set('--text-xl',   `${Math.round(px * 1.25)}px`);
  set('--text-2xl',  `${Math.round(px * 1.5)}px`);
  set('--text-3xl',  `${Math.round(px * 2)}px`);
}

function applyMotion(mode: 'normal' | 'reduced' | 'none') {
  if (mode === 'normal') {
    unset('--duration-fast');
    unset('--duration-base');
    unset('--duration-slow');
  } else if (mode === 'reduced') {
    set('--duration-fast', '60ms');
    set('--duration-base', '90ms');
    set('--duration-slow', '130ms');
  } else {
    set('--duration-fast', '0ms');
    set('--duration-base', '0ms');
    set('--duration-slow', '0ms');
  }
}

function resetAll() {
  [
    '--color-accent', '--color-accent-hover', '--color-accent-active',
    '--color-accent-subtle', '--color-border-focus', '--color-fg-on-accent',
    '--radius-sm', '--radius-md', '--radius-lg', '--radius-xl',
    '--font-sans', '--font-display',
    '--text-xs', '--text-sm', '--text-base', '--text-lg', '--text-xl', '--text-2xl', '--text-3xl',
    '--duration-fast', '--duration-base', '--duration-slow',
  ].forEach(unset);
}

// ── Customizer ────────────────────────────────────────────────────────────────

export function Customizer() {
  const [open, setOpen] = useState(false);
  const [accent, setAccent] = useState(DEFAULTS.accentHex);
  const [radius, setRadius] = useState(DEFAULTS.radius);
  const [font, setFont] = useState<'default' | 'serif' | 'mono'>(DEFAULTS.fontSans);
  const [textBase, setTextBase] = useState(DEFAULTS.textBase);
  const [motion, setMotion] = useState(DEFAULTS.motion);

  const handleAccent = useCallback((hex: string) => {
    setAccent(hex);
    applyAccent(hex);
  }, []);

  const handleRadius = useCallback((v: number) => {
    setRadius(v);
    applyRadius(v);
  }, []);

  const handleFont = useCallback((key: 'default' | 'serif' | 'mono') => {
    setFont(key);
    applyFont(key);
  }, []);

  const handleTextBase = useCallback((v: number) => {
    setTextBase(v);
    applyTextBase(v);
  }, []);

  const handleMotion = useCallback((v: 'normal' | 'reduced' | 'none') => {
    setMotion(v);
    applyMotion(v);
  }, []);

  const handleReset = useCallback(() => {
    setAccent(DEFAULTS.accentHex);
    setRadius(DEFAULTS.radius);
    setFont(DEFAULTS.fontSans);
    setTextBase(DEFAULTS.textBase);
    setMotion(DEFAULTS.motion);
    resetAll();
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: 'var(--space-5)', right: 'var(--space-5)', zIndex: 200 }}>
      {open ? (
        <Card elevation="floating" style={{ width: 260, padding: 0 }}>
          {/* Header */}
          <Row
            align="center"
            justify="space-between"
            style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)' }}
          >
            <span style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)' }}>Customize</span>
            <Button variant="ghost" size="sm" iconOnly aria-label="Close" onClick={() => setOpen(false)}>
              <CloseIcon />
            </Button>
          </Row>

          {/* Controls */}
          <Col gap={4} style={{ padding: 'var(--space-4)' }}>

            {/* Accent color */}
            <Col gap={2}>
              <Row align="center" justify="space-between">
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', color: 'var(--color-fg-muted)' }}>
                  Accent color
                </label>
                <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-fg-subtle)' }}>{accent}</span>
              </Row>
              <Row gap={2} align="center">
                <div style={{ position: 'relative', width: 28, height: 28, flexShrink: 0 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-md)', background: accent, border: '1px solid var(--color-border)' }} />
                  <input
                    type="color"
                    value={accent}
                    onChange={e => handleAccent(e.target.value)}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                  />
                </div>
                <Row gap={1} wrap style={{ flex: 1 }}>
                  {['#5b5bd6', '#e63946', '#2f8f4e', '#c98a16', '#0ea5e9', '#f97316'].map(c => (
                    <button
                      key={c}
                      onClick={() => handleAccent(c)}
                      aria-label={`Set accent to ${c}`}
                      style={{
                        width: 20, height: 20,
                        borderRadius: 'var(--radius-sm)',
                        background: c,
                        border: accent === c ? '2px solid var(--color-fg)' : '1px solid transparent',
                        cursor: 'pointer',
                        padding: 0,
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </Row>
              </Row>
            </Col>

            <Divider />

            {/* Border radius */}
            <Col gap={2}>
              <Row align="center" justify="space-between">
                <label htmlFor="radius-slider" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', color: 'var(--color-fg-muted)' }}>
                  Border radius
                </label>
                <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-fg-subtle)' }}>{radius}px</span>
              </Row>
              <input
                id="radius-slider"
                type="range"
                min={0}
                max={20}
                step={1}
                value={radius}
                onChange={e => handleRadius(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-accent)' }}
              />
              <Row justify="space-between">
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-subtle)' }}>Sharp</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-subtle)' }}>Rounded</span>
              </Row>
            </Col>

            <Divider />

            {/* Font family */}
            <Col gap={2}>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', color: 'var(--color-fg-muted)' }}>
                Font family
              </label>
              <Row gap={1}>
                {(['default', 'serif', 'mono'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => handleFont(f)}
                    style={{
                      flex: 1,
                      padding: 'var(--space-1) var(--space-2)',
                      fontSize: 'var(--text-xs)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      background: font === f ? 'var(--color-accent)' : 'var(--color-bg)',
                      color: font === f ? 'var(--color-fg-on-accent)' : 'var(--color-fg)',
                      cursor: 'pointer',
                      fontFamily: FONT_STACKS[f]!.sans,
                      transition: 'background-color 120ms',
                    }}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </Row>
            </Col>

            <Divider />

            {/* Text size */}
            <Col gap={2}>
              <Row align="center" justify="space-between">
                <label htmlFor="text-slider" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', color: 'var(--color-fg-muted)' }}>
                  Content text size
                </label>
                <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-fg-subtle)' }}>{textBase}px</span>
              </Row>
              <input
                id="text-slider"
                type="range"
                min={13}
                max={18}
                step={1}
                value={textBase}
                onChange={e => handleTextBase(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-accent)' }}
              />
            </Col>

            <Divider />

            {/* Motion */}
            <Col gap={2}>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', color: 'var(--color-fg-muted)' }}>
                Motion
              </label>
              <Row gap={1}>
                {(['normal', 'reduced', 'none'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => handleMotion(m)}
                    style={{
                      flex: 1,
                      padding: 'var(--space-1) var(--space-2)',
                      fontSize: 'var(--text-xs)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      background: motion === m ? 'var(--color-accent)' : 'var(--color-bg)',
                      color: motion === m ? 'var(--color-fg-on-accent)' : 'var(--color-fg)',
                      cursor: 'pointer',
                      transition: 'background-color 120ms',
                    }}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </Row>
            </Col>

          </Col>

          {/* Footer */}
          <Row
            justify="flex-end"
            style={{ padding: 'var(--space-3) var(--space-4)', borderTop: '1px solid var(--color-border)' }}
          >
            <Button variant="ghost" size="sm" onClick={handleReset}>Reset</Button>
          </Row>
        </Card>
      ) : (
        <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
          Customize
        </Button>
      )}
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
