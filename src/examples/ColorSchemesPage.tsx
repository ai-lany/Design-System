import { useState } from 'react';
import { Badge, Col, Row } from '../index';

// ─── Scheme definitions ────────────────────────────────────────────────────────

interface Scheme {
  name: string;
  description: string;
  vars: Record<string, string>;
}

const SCHEMES: Scheme[] = [
  {
    name: 'Graphite',
    description: 'Charcoal accent · forest / harvest / deep red status',
    vars: {
      '--color-accent':         '#1e293b',
      '--color-accent-subtle':  '#f1f5f9',
      '--color-success':        '#166534',
      '--color-success-subtle': '#dcfce7',
      '--color-warning':        '#92400e',
      '--color-warning-subtle': '#fef3c7',
      '--color-danger':         '#991b1b',
      '--color-danger-subtle':  '#fee2e2',
      '--color-fg-on-accent':   '#ffffff',
    },
  },
  {
    name: 'Ocean',
    description: 'Navy accent · emerald / amber / ruby status',
    vars: {
      '--color-accent':         '#1e40af',
      '--color-accent-subtle':  '#dbeafe',
      '--color-success':        '#065f46',
      '--color-success-subtle': '#d1fae5',
      '--color-warning':        '#92400e',
      '--color-warning-subtle': '#fef3c7',
      '--color-danger':         '#9f1239',
      '--color-danger-subtle':  '#ffe4e6',
      '--color-fg-on-accent':   '#ffffff',
    },
  },
  {
    name: 'Violet',
    description: 'Violet accent · emerald / amber / crimson status',
    vars: {
      '--color-accent':         '#5b21b6',
      '--color-accent-subtle':  '#ede9fe',
      '--color-success':        '#065f46',
      '--color-success-subtle': '#d1fae5',
      '--color-warning':        '#b45309',
      '--color-warning-subtle': '#fef3c7',
      '--color-danger':         '#be123c',
      '--color-danger-subtle':  '#fff1f2',
      '--color-fg-on-accent':   '#ffffff',
    },
  },
  {
    name: 'Tomato',
    description: 'Tomato accent · olive / ochre / berry status',
    vars: {
      '--color-accent':         '#c2410c',
      '--color-accent-subtle':  '#fff7ed',
      '--color-success':        '#3f6212',
      '--color-success-subtle': '#f7fee7',
      '--color-warning':        '#78350f',
      '--color-warning-subtle': '#fefce8',
      '--color-danger':         '#9f1239',
      '--color-danger-subtle':  '#ffe4e6',
      '--color-fg-on-accent':   '#ffffff',
    },
  },
  {
    name: 'Plum',
    description: 'Plum accent · forest / ochre / brick status',
    vars: {
      '--color-accent':         '#86198f',
      '--color-accent-subtle':  '#fdf4ff',
      '--color-success':        '#166534',
      '--color-success-subtle': '#dcfce7',
      '--color-warning':        '#78350f',
      '--color-warning-subtle': '#fef3c7',
      '--color-danger':         '#9a3626',
      '--color-danger-subtle':  '#fee2e2',
      '--color-fg-on-accent':   '#ffffff',
    },
  },
];

const TONES = ['neutral', 'accent', 'success', 'warning', 'danger'] as const;
const VARIANTS = ['soft', 'solid', 'outline'] as const;

// ─── SchemeCard ────────────────────────────────────────────────────────────────

function SchemeCard({ scheme }: { scheme: Scheme }) {
  return (
    <div
      style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        ...Object.fromEntries(Object.entries(scheme.vars)) as React.CSSProperties,
      }}
    >
      {/* Card header */}
      <div style={{
        padding: 'var(--space-4) var(--space-5)',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-bg-subtle)',
        display: 'flex',
        alignItems: 'baseline',
        gap: 'var(--space-3)',
      }}>
        <span style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-base)', color: 'var(--color-fg)' }}>
          {scheme.name}
        </span>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)' }}>
          {scheme.description}
        </span>
      </div>

      {/* Badge grid */}
      <div style={{ padding: 'var(--space-5)' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={thStyle}>Tone</th>
              {VARIANTS.map(v => (
                <th key={v} style={thStyle}>{v.charAt(0).toUpperCase() + v.slice(1)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TONES.map(tone => (
              <tr key={tone}>
                <td style={labelCellStyle}>
                  {tone.charAt(0).toUpperCase() + tone.slice(1)}
                </td>
                {VARIANTS.map(variant => (
                  <td key={variant} style={badgeCellStyle}>
                    <Row gap={2} wrap>
                      <Badge tone={tone} variant={variant} size="sm">{tone}</Badge>
                      <Badge tone={tone} variant={variant} size="md">{tone}</Badge>
                    </Row>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '0 var(--space-4) var(--space-3) var(--space-4)',
  fontSize: 'var(--text-xs)',
  fontWeight: 'var(--weight-semibold)',
  color: 'var(--color-fg-subtle)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  textAlign: 'left',
};

const labelCellStyle: React.CSSProperties = {
  padding: 'var(--space-3) var(--space-4)',
  fontSize: 'var(--text-sm)',
  color: 'var(--color-fg-muted)',
  fontWeight: 'var(--weight-medium)',
  whiteSpace: 'nowrap',
  width: 96,
};

const badgeCellStyle: React.CSSProperties = {
  padding: 'var(--space-3) var(--space-4)',
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export function ColorSchemesPage() {
  const [darkMode, setDarkMode] = useState(
    document.documentElement.dataset.theme === 'dark',
  );

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.dataset.theme = next ? 'dark' : '';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        height: 56,
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-bg)',
        display: 'flex', alignItems: 'center',
        padding: '0 var(--space-5)',
        gap: 'var(--space-4)',
      }}>
        <a
          href="#"
          style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)', textDecoration: 'none' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-fg)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = ''; }}
        >
          ← Components
        </a>
        <span style={{ width: 1, height: 16, background: 'var(--color-border)' }} />
        <span style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-base)', color: 'var(--color-fg)' }}>
          Badge Color Schemes
        </span>
        <span style={{ flex: 1 }} />
        <button
          onClick={toggleDark}
          style={{
            padding: 'var(--space-2) var(--space-3)',
            fontSize: 'var(--text-sm)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            background: 'transparent',
            color: 'var(--color-fg-muted)',
            cursor: 'pointer',
          }}
        >
          {darkMode ? 'Light mode' : 'Dark mode'}
        </button>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 900, margin: '0 auto', padding: 'var(--space-7) var(--space-6)' }}>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)', lineHeight: 'var(--leading-normal)' }}>
            Each card previews a complete set of badge tones and variants under a different color scheme.
            Sizes shown left-to-right: <strong>sm</strong>, <strong>md</strong>.
          </p>
        </div>
        <Col gap={5}>
          {SCHEMES.map(scheme => (
            <SchemeCard key={scheme.name} scheme={scheme} />
          ))}
        </Col>
      </main>
    </div>
  );
}
