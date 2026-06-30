import { type ReactNode, useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card, CardBody, CardFooter, CardHeader,
  Checkbox,
  Chip,
  Col,
  Combobox,
  Container,
  ContextMenu,
  DataTable,
  DatePicker,
  Divider,
  Drawer,
  EmptyState,
  FormField,
  Input,
  Menu,
  Modal,
  Pagination,
  Popover,
  Progress,
  Radio,
  RadioGroup,
  Row,
  Select,
  Skeleton,
  Slider,
  StickyNote,
  Spinner,
  Stat,
  Switch,
  Tab, TabList, TabPanel, Tabs,
  Table, TableBody, TableHead, TableRow, Td, Th,
  Textarea,
  Timeline,
  ToastProvider,
  Tooltip,
  Typography,
  LiquidGlass,
  Link,
  useToast,
  type MenuItem,
} from '../index';
import { Customizer } from './Customizer';

// ─── PreviewCode ──────────────────────────────────────────────────────────────

function PreviewCode({ preview, code }: { preview: ReactNode; code: string }) {
  const [active, setActive] = useState<'preview' | 'code'>('preview');
  return (
    <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <Tabs value={active} onChange={(v) => setActive(v as 'preview' | 'code')}>
        <TabList style={{ background: 'var(--color-bg-subtle)', paddingLeft: 'var(--space-2)' }}>
          <Tab value="preview">Preview</Tab>
          <Tab value="code">Code</Tab>
        </TabList>
        <TabPanel value="preview" style={{ padding: 'var(--space-5)', background: 'var(--color-bg)' }}>
          {preview}
        </TabPanel>
        <TabPanel value="code" style={{ padding: 0 }}>
          <Textarea variant="code" defaultValue={code.trim()} />
        </TabPanel>
      </Tabs>
    </div>
  );
}

// ─── Layout helpers ──────────────────────────────────────────────────────────

const NAV_GROUPS: { label: string; items: string[] }[] = [
  { label: 'Actions', items: ['Button'] },
  { label: 'Forms', items: ['Input', 'Textarea', 'Select', 'Combobox', 'Checkbox', 'Radio', 'Switch', 'Slider', 'DatePicker', 'FormField'] },
  { label: 'Layout', items: ['Container', 'Row & Col', 'Divider'] },
  { label: 'Navigation', items: ['Tabs', 'Breadcrumb', 'Pagination', 'Menu', 'ContextMenu'] },
  { label: 'Overlays', items: ['Modal', 'Drawer', 'Popover', 'Tooltip'] },
  { label: 'Feedback', items: ['Alert', 'Toast', 'Spinner', 'Skeleton', 'Progress'] },
  { label: 'Data', items: ['Table', 'Stat', 'Timeline', 'EmptyState'] },
  { label: 'Display', items: ['Badge', 'Chip', 'Avatar', 'Card', 'StickyNote', 'Liquid Glass'] },
  { label: 'Typography', items: ['Typography', 'Link'] },
];

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} style={{ scrollMarginTop: '64px' }}>
      <Typography variant="h2" style={{ marginBottom: 'var(--space-5)' }}>{title}</Typography>
      <Col gap={6}>{children}</Col>
    </section>
  );
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <Badge tone="accent" variant="soft" size="sm">{label}</Badge>
      </div>
      {children}
    </div>
  );
}

// ─── useMediaQuery ────────────────────────────────────────────────────────────

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

// ─── NavContent ───────────────────────────────────────────────────────────────

function NavContent({ onLinkClick }: { onLinkClick?: () => void }) {
  return (
    <Col gap={4}>
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <div style={{
            margin: '0 0 var(--space-1) var(--space-3)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--color-fg-subtle)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>{group.label}</div>
          <Col>
            {group.items.map((name) => {
              const id = name.toLowerCase().replace(/\s+/g, '-').replace('&', '').replace('--', '-');
              return (
                <Link key={name} variant="nav" href={`#${id}`} onClick={onLinkClick}>{name}</Link>
              );
            })}
          </Col>
        </div>
      ))}
    </Col>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function Example() {
  const [darkMode, setDarkMode] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.dataset.theme = next ? 'dark' : '';
  };

  return (
    <ToastProvider>
      <div style={{
          minHeight: '100vh',
          position: 'relative',
          backgroundColor: 'var(--color-bg)',
          backgroundImage: [
            'radial-gradient(ellipse at center, var(--color-bg) 55%, transparent 80%)',
            'linear-gradient(color-mix(in srgb, var(--color-border) 50%, transparent) 1px, transparent 1px)',
            'linear-gradient(90deg, color-mix(in srgb, var(--color-border) 50%, transparent) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
          backgroundAttachment: 'fixed, fixed, fixed',
          backgroundRepeat: 'no-repeat, repeat, repeat',
        }}>
        {/* ── Header ── */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 50,
          height: 56,
          borderBottom: '1px solid var(--color-border)',
          background: 'color-mix(in srgb, var(--color-bg) 88%, transparent)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center',
          padding: '0 var(--space-5)',
          gap: 'var(--space-4)',
        }}>
          {isMobile && (
            <Button variant="ghost" size="sm" iconOnly aria-label="Open navigation" onClick={() => setNavOpen(true)}>
              <HamburgerIcon />
            </Button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{
              width: 26, height: 26,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <rect x="1.5" y="1.5" width="4.5" height="4.5" rx="1.2" fill="white" opacity="0.95"/>
                <rect x="8" y="1.5" width="4.5" height="4.5" rx="1.2" fill="white" opacity="0.65"/>
                <rect x="1.5" y="8" width="4.5" height="4.5" rx="1.2" fill="white" opacity="0.65"/>
                <rect x="8" y="8" width="4.5" height="4.5" rx="1.2" fill="white" opacity="0.4"/>
              </svg>
            </div>
            <Typography variant="label" as="span" style={{ fontWeight: 'var(--weight-semibold)' }}>Design System</Typography>
          </div>
          <Badge tone="accent" variant="soft">v0.1</Badge>
          <span style={{ flex: 1 }} />
          <Button variant="ghost" size="sm" onClick={toggleDark} aria-label="Toggle dark mode">
            {darkMode ? 'Light mode' : 'Dark mode'}
          </Button>
        </header>

        <div style={{ display: 'flex', maxWidth: 1100, margin: '0 auto' }}>
          {/* ── Sidebar (desktop only) ── */}
          {!isMobile && (
            <nav style={{
              width: 180, flexShrink: 0,
              padding: 'var(--space-6) var(--space-4)',
              position: 'sticky', top: 56,
              height: 'calc(100vh - 56px)', overflowY: 'auto',
              borderRight: '1px solid var(--color-border)',
            }}>
              <NavContent />
            </nav>
          )}

          {/* ── Content ── */}
          <main style={{ flex: 1, padding: 'var(--space-7) var(--space-6)', minWidth: 0 }}>
            <Col gap={8}>

              {/* ── BUTTON ── */}
              <Section id="button" title="Button">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Primary interactive element for triggering actions. Comes in four semantic variants (<code>primary</code>, <code>secondary</code>, <code>ghost</code>, <code>danger</code>), three sizes, and supports loading states, disabled states, and leading/trailing icon slots.
                </Typography>
                <Block label="Variants">
                  <PreviewCode
                    preview={
                      <Row gap={3} wrap>
                        {(['primary', 'secondary', 'ghost', 'danger'] as const).map(v => (
                          <Button key={v} variant={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
                        ))}
                      </Row>
                    }
                    code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>`}
                  />
                </Block>
                <Block label="Sizes">
                  <PreviewCode
                    preview={
                      <Row gap={3} align="center" wrap>
                        {(['sm', 'md', 'lg'] as const).map(s => (
                          <Button key={s} size={s}>{s.toUpperCase()}</Button>
                        ))}
                      </Row>
                    }
                    code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}
                  />
                </Block>
                <Block label="States">
                  <PreviewCode
                    preview={
                      <Row gap={3} wrap>
                        <Button loading>Loading</Button>
                        <Button disabled>Disabled</Button>
                        <Button variant="secondary" leading={<PlusIcon />}>With icon</Button>
                        <Button variant="ghost" size="md" iconOnly aria-label="Add"><PlusIcon /></Button>
                      </Row>
                    }
                    code={`<Button loading>Loading</Button>
<Button disabled>Disabled</Button>

// Leading / trailing icon slots
<Button variant="secondary" leading={<PlusIcon />}>
  With icon
</Button>

// Icon-only (square) — always pair with aria-label
<Button variant="ghost" iconOnly aria-label="Add">
  <PlusIcon />
</Button>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── INPUT ── */}
              <Section id="input" title="Input">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Single-line text field with a built-in label, helper text, error state, and optional leading/trailing icon slots. Use <code>inputSize</code> instead of the native <code>size</code> attribute to control height.
                </Typography>
                <Block label="Default">
                  <PreviewCode
                    preview={
                      <Col gap={4} style={{ maxWidth: 360 }}>
                        <Input label="Email" type="email" placeholder="you@example.com" helperText="We'll never share your email." />
                        <Input label="Password" type="password" placeholder="••••••••" required />
                      </Col>
                    }
                    code={`<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  helperText="We'll never share your email."
/>

<Input
  label="Password"
  type="password"
  placeholder="••••••••"
  required
/>`}
                  />
                </Block>
                <Block label="Sizes">
                  <PreviewCode
                    preview={
                      <Col gap={3} style={{ maxWidth: 360 }}>
                        {(['sm', 'md', 'lg'] as const).map(s => (
                          <Input key={s} inputSize={s} placeholder={`Size ${s}`} />
                        ))}
                      </Col>
                    }
                    code={`<Input inputSize="sm" placeholder="Small" />
<Input inputSize="md" placeholder="Medium" />
<Input inputSize="lg" placeholder="Large" />`}
                  />
                </Block>
                <Block label="States">
                  <PreviewCode
                    preview={
                      <Col gap={4} style={{ maxWidth: 360 }}>
                        <Input label="Error" error="This field is required." placeholder="Enter a value" />
                        <Input label="Disabled" disabled placeholder="Cannot edit" />
                      </Col>
                    }
                    code={`// String error replaces helperText
<Input
  label="Email"
  error="This field is required."
/>

// Boolean error for custom helper
<Input label="Email" error />

<Input label="Disabled" disabled />`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── SELECT ── */}
              <Section id="select" title="Select">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Custom dropdown for choosing one option from a predefined list. Portal-rendered for consistent cross-browser appearance. Accepts the same <code>label</code>, <code>helperText</code>, and <code>error</code> props as <code>Input</code>. For long or searchable lists, prefer <code>Combobox</code>.
                </Typography>
                <Block label="Default">
                  <PreviewCode
                    preview={
                      <Col gap={4} style={{ maxWidth: 360 }}>
                        <Select
                          label="Country"
                          placeholder="Choose a country…"
                          helperText="We ship to these countries."
                          options={[
                            { value: 'us', label: 'United States' },
                            { value: 'ca', label: 'Canada' },
                            { value: 'uk', label: 'United Kingdom' },
                            { value: 'au', label: 'Australia' },
                          ]}
                        />
                        <Select
                          label="Role"
                          placeholder="Select a role…"
                          required
                          options={[
                            { value: 'admin', label: 'Admin' },
                            { value: 'editor', label: 'Editor' },
                            { value: 'viewer', label: 'Viewer' },
                            { value: 'locked', label: 'Locked role', disabled: true },
                          ]}
                        />
                      </Col>
                    }
                    code={`<Select
  label="Country"
  placeholder="Choose a country…"
  helperText="We ship to these countries."
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
  ]}
/>

// Controlled
const [role, setRole] = useState('');
<Select
  label="Role"
  value={role}
  onChange={setRole}
  placeholder="Select a role…"
  options={[
    { value: 'admin',  label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer', disabled: true },
  ]}
/>`}
                  />
                </Block>
                <Block label="States">
                  <PreviewCode
                    preview={
                      <Col gap={4} style={{ maxWidth: 360 }}>
                        <Select
                          label="Error"
                          error="Please select an option."
                          placeholder="Choose…"
                          options={[
                            { value: 'a', label: 'Option A' },
                            { value: 'b', label: 'Option B' },
                          ]}
                        />
                        <Select
                          label="Disabled"
                          disabled
                          defaultValue="enterprise"
                          options={[{ value: 'enterprise', label: 'Enterprise' }]}
                        />
                      </Col>
                    }
                    code={`<Select
  label="Role"
  error="Please select an option."
  options={[{ value: 'a', label: 'Option A' }]}
/>

<Select label="Plan" disabled options={[{ value: 'ent', label: 'Enterprise' }]} />`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── CHECKBOX ── */}
              <Section id="checkbox" title="Checkbox">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Binary toggle for boolean values. Supports an <code>indeterminate</code> state — useful for "select all" patterns where some but not all child items are checked.
                </Typography>
                <Block label="Default">
                  <PreviewCode
                    preview={
                      <Col gap={3}>
                        <Checkbox label="I agree to the terms and conditions" defaultChecked />
                        <Checkbox label="Subscribe to marketing emails" />
                        <Checkbox label="Indeterminate state" indeterminate />
                        <Checkbox label="Disabled" disabled />
                        <Checkbox label="Disabled checked" disabled defaultChecked />
                      </Col>
                    }
                    code={`<Checkbox label="I agree to the terms" defaultChecked />
<Checkbox label="Subscribe to emails" />

// Indeterminate — for "select all" rows
<Checkbox label="Select all" indeterminate />

<Checkbox label="Disabled" disabled />
<Checkbox label="Disabled checked" disabled defaultChecked />`}
                  />
                </Block>
                <Block label="Real-world: permission list">
                  <PreviewCode
                    preview={<CheckboxPermissionsExample />}
                    code={`const [perms, setPerms] = useState({ read: true, write: false, admin: false });
const allChecked = Object.values(perms).every(Boolean);
const someChecked = Object.values(perms).some(Boolean) && !allChecked;

<Checkbox
  label="All permissions"
  checked={allChecked}
  indeterminate={someChecked}
  onChange={toggleAll}
/>
<Checkbox label="Read"  checked={perms.read}  onChange={() => toggle('read')}  />
<Checkbox label="Write" checked={perms.write} onChange={() => toggle('write')} />
<Checkbox label="Admin" checked={perms.admin} onChange={() => toggle('admin')} />`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── SWITCH ── */}
              <Section id="switch" title="Switch">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Toggle that communicates an on/off state. Prefer it over <code>Checkbox</code> when the change takes effect immediately without a submit action — for example, enabling dark mode or a notification setting.
                </Typography>
                <Block label="Sizes & label position">
                  <PreviewCode
                    preview={
                      <Row gap={5} align="center" wrap>
                        <Switch label="Small" switchSize="sm" defaultChecked />
                        <Switch label="Medium" switchSize="md" defaultChecked />
                        <Switch label="Label start" labelPosition="start" defaultChecked />
                      </Row>
                    }
                    code={`<Switch label="Small"  switchSize="sm" />
<Switch label="Medium" switchSize="md" />

// Label position
<Switch label="Notifications" labelPosition="start" />`}
                  />
                </Block>
                <Block label="States">
                  <PreviewCode
                    preview={
                      <Row gap={5} align="center">
                        <Switch label="Off" />
                        <Switch label="On" defaultChecked />
                        <Switch label="Disabled" disabled />
                        <Switch label="Disabled on" disabled defaultChecked />
                      </Row>
                    }
                    code={`<Switch label="Off" />
<Switch label="On" defaultChecked />
<Switch label="Disabled" disabled />
<Switch label="Disabled on" disabled defaultChecked />`}
                  />
                </Block>
                <Block label="Real-world: notifications panel">
                  <PreviewCode
                    preview={<NotificationsExample />}
                    code={`const [state, setState] = useState({
  email: true,
  push: false,
  marketing: false,
});

{Object.entries(state).map(([key, value]) => (
  <Row key={key} justify="space-between" align="center">
    <Col gap={1}>
      <span>{labels[key].title}</span>
      <span>{labels[key].desc}</span>
    </Col>
    <Switch
      checked={value}
      onChange={() => setState(p => ({ ...p, [key]: !p[key] }))}
    />
  </Row>
))}`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── CARD ── */}
              <Section id="card" title="Card">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  General-purpose surface container with three elevation levels. Use the <code>CardHeader</code>, <code>CardBody</code>, and <code>CardFooter</code> subcomponents to structure content — they remove the Card's own padding so each region owns its own spacing.
                </Typography>
                <Block label="Elevations">
                  <PreviewCode
                    preview={
                      <Row gap={4} wrap align="stretch">
                        {(['flat', 'raised', 'floating'] as const).map(e => (
                          <Card key={e} elevation={e} style={{ flex: '1 1 160px' }}>
                            <Typography variant="body2" weight="medium">{e.charAt(0).toUpperCase() + e.slice(1)}</Typography>
                            <Typography variant="caption" color="muted" style={{ marginTop: 'var(--space-1)' }}>elevation="{e}"</Typography>
                          </Card>
                        ))}
                      </Row>
                    }
                    code={`<Card elevation="flat">Flat — no shadow</Card>
<Card elevation="raised">Raised — default</Card>
<Card elevation="floating">Floating — stronger shadow</Card>`}
                  />
                </Block>
                <Block label="Composed with subcomponents">
                  <PreviewCode
                    preview={
                      <Card style={{ maxWidth: 340 }}>
                        <CardHeader><Typography variant="label">Account settings</Typography></CardHeader>
                        <CardBody>
                          <Typography variant="body2" color="muted">Update your email and notification preferences.</Typography>
                        </CardBody>
                        <CardFooter>
                          <Button variant="ghost" size="sm">Cancel</Button>
                          <Button size="sm">Save</Button>
                        </CardFooter>
                      </Card>
                    }
                    code={`<Card>
  <CardHeader>Account settings</CardHeader>
  <CardBody>
    <p>Update your preferences.</p>
  </CardBody>
  <CardFooter>
    <Button variant="ghost">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>`}
                  />
                </Block>
                <Block label="Interactive">
                  <PreviewCode
                    preview={
                      <Card interactive style={{ maxWidth: 280 }}>
                        <Typography variant="body2" weight="medium">Clickable card</Typography>
                        <Typography variant="body2" color="muted" style={{ marginTop: 'var(--space-1)' }}>Hover to see the lift effect.</Typography>
                      </Card>
                    }
                    code={`<Card interactive onClick={() => router.push('/detail')}>
  <p>Clickable card</p>
</Card>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── MODAL ── */}
              <Section id="modal" title="Modal">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Focused dialog that overlays the page and traps keyboard focus until dismissed. Portal-rendered with a backdrop. Supports three widths and an optional <code>footer</code> slot for confirmation actions.
                </Typography>
                <Block label="Sizes">
                  <PreviewCode
                    preview={
                      <Row gap={3} wrap>
                        {(['sm', 'md', 'lg'] as const).map(s => <ModalExample key={s} size={s} />)}
                      </Row>
                    }
                    code={`const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open modal</Button>

<Modal
  open={open}
  onClose={() => setOpen(false)}
  size="md"
  title="Confirm action"
  description="This cannot be undone."
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="danger" onClick={() => setOpen(false)}>Delete</Button>
    </>
  }
>
  <p>Are you sure you want to proceed?</p>
</Modal>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── BADGE ── */}
              <Section id="badge" title="Badge">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Compact inline label for status, counts, or categories. Combines five tones (<code>neutral</code>, <code>accent</code>, <code>success</code>, <code>warning</code>, <code>danger</code>) with three surface variants (<code>soft</code>, <code>solid</code>, <code>outline</code>).
                </Typography>
                <Block label="Variants × tones">
                  <PreviewCode
                    preview={
                      <Col gap={4}>
                        {(['soft', 'solid', 'outline'] as const).map(v => (
                          <Row key={v} gap={2} wrap align="center">
                            <Typography variant="caption" color="subtle" as="span" style={{ width: 52 }}>{v}</Typography>
                            {(['neutral', 'accent', 'success', 'warning', 'danger'] as const).map(t => (
                              <Badge key={t} tone={t} variant={v}>{t}</Badge>
                            ))}
                          </Row>
                        ))}
                      </Col>
                    }
                    code={`// Tones: neutral | accent | success | warning | danger
// Variants: soft (default) | solid | outline

<Badge tone="success">Active</Badge>
<Badge tone="danger" variant="solid">Overdue</Badge>
<Badge tone="accent" variant="outline">Beta</Badge>`}
                  />
                </Block>
                <Block label="Sizes">
                  <PreviewCode
                    preview={
                      <Row gap={3} align="center">
                        <Badge size="sm" tone="accent">sm</Badge>
                        <Badge size="md" tone="accent">md</Badge>
                      </Row>
                    }
                    code={`<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── CHIP ── */}
              <Section id="chip" title="Chip">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Compact interactive tag. Can be toggled and selected for filter UIs, or made removable for tag-input patterns. Shares the same tone options as <code>Badge</code>.
                </Typography>
                <Block label="Interactive toggle">
                  <PreviewCode
                    preview={<ChipToggleExample />}
                    code={`const [selected, setSelected] = useState(new Set(['Design']));

const toggle = (tag: string) =>
  setSelected(prev => {
    const next = new Set(prev);
    next.has(tag) ? next.delete(tag) : next.add(tag);
    return next;
  });

{tags.map(tag => (
  <Chip
    key={tag}
    tone="accent"
    selected={selected.has(tag)}
    onClick={() => toggle(tag)}
  >
    {tag}
  </Chip>
))}`}
                  />
                </Block>
                <Block label="Removable">
                  <PreviewCode
                    preview={<ChipRemoveExample />}
                    code={`const [chips, setChips] = useState(['React', 'TypeScript', 'Vite']);

{chips.map(chip => (
  <Chip
    key={chip}
    onRemove={() => setChips(prev => prev.filter(c => c !== chip))}
  >
    {chip}
  </Chip>
))}`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── AVATAR ── */}
              <Section id="avatar" title="Avatar">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Displays a user's photo with an automatic initials fallback when the image is absent or fails to load. Supports four sizes and four status dot states (<code>online</code>, <code>busy</code>, <code>away</code>, <code>offline</code>).
                </Typography>
                <Block label="Sizes & initials fallback">
                  <PreviewCode
                    preview={
                      <Row gap={4} align="center">
                        {(['sm', 'md', 'lg', 'xl'] as const).map(s => (
                          <Avatar key={s} name="Maya Lin" size={s} />
                        ))}
                      </Row>
                    }
                    code={`// Initials derived from name automatically
<Avatar name="Maya Lin" size="sm" />
<Avatar name="Maya Lin" size="md" />
<Avatar name="Maya Lin" size="lg" />
<Avatar name="Maya Lin" size="xl" />`}
                  />
                </Block>
                <Block label="Status dots">
                  <PreviewCode
                    preview={
                      <Row gap={4} align="center">
                        {(['online', 'busy', 'away', 'offline'] as const).map(s => (
                          <Col key={s} gap={1} align="center">
                            <Avatar name="User" size="lg" status={s} />
                            <Typography variant="caption" color="muted" as="span">{s}</Typography>
                          </Col>
                        ))}
                      </Row>
                    }
                    code={`// status: online | busy | away | offline
<Avatar name="Maya Lin" size="md" status="online" />
<Avatar name="Maya Lin" size="md" status="busy" />
<Avatar name="Maya Lin" size="md" status="away" />
<Avatar name="Maya Lin" size="md" status="offline" />`}
                  />
                </Block>
                <Block label="Real-world: team list">
                  <PreviewCode
                    preview={<TeamListExample />}
                    code={`{team.map(member => (
  <Row key={member.name} align="center" gap={3} justify="space-between">
    <Row align="center" gap={3}>
      <Avatar name={member.name} size="md" status={member.status} />
      <Col gap={1}>
        <span>{member.name}</span>
        <span>{member.role}</span>
      </Col>
    </Row>
    <Badge tone={member.tone}>{member.status}</Badge>
  </Row>
))}`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── TABS ── */}
              <Section id="tabs" title="Tabs">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Organizes related content into labelled panels, showing one at a time. Fully controlled — manage the active tab with <code>value</code> and <code>onChange</code>. Individual tabs can be disabled.
                </Typography>
                <Block label="Default">
                  <PreviewCode
                    preview={<TabsExample />}
                    code={`const [tab, setTab] = useState('preview');

<Tabs value={tab} onChange={setTab}>
  <TabList>
    <Tab value="preview">Preview</Tab>
    <Tab value="code">Code</Tab>
    <Tab value="props">Props</Tab>
    <Tab value="disabled" disabled>Disabled</Tab>
  </TabList>

  <TabPanel value="preview">Preview content</TabPanel>
  <TabPanel value="code">Code content</TabPanel>
  <TabPanel value="props">Props content</TabPanel>
</Tabs>`}
                  />
                </Block>
                <Block label="Real-world: settings panel">
                  <PreviewCode
                    preview={<SettingsTabsExample />}
                    code={`const [tab, setTab] = useState('profile');

<Tabs value={tab} onChange={setTab}>
  <TabList>
    <Tab value="profile">Profile</Tab>
    <Tab value="security">Security</Tab>
    <Tab value="billing">Billing</Tab>
  </TabList>

  <TabPanel value="profile">
    <Input label="Display name" defaultValue="Maya Lin" />
    <Input label="Email" type="email" />
  </TabPanel>

  <TabPanel value="security">
    <Input label="Current password" type="password" />
    <Input label="New password" type="password" />
  </TabPanel>

  <TabPanel value="billing">
    You are on the <Badge tone="accent">Pro</Badge> plan.
  </TabPanel>
</Tabs>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── TOOLTIP ── */}
              <Section id="tooltip" title="Tooltip">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Short contextual hint that appears on hover or focus. Works on any element. Supports four placements. Keep content brief and non-interactive — for richer floating content use <code>Popover</code>.
                </Typography>
                <Block label="Placements">
                  <PreviewCode
                    preview={
                      <Row gap={5} wrap align="center" style={{ padding: 'var(--space-4) 0' }}>
                        {(['top', 'bottom', 'left', 'right'] as const).map(p => (
                          <Tooltip key={p} content={`Tooltip ${p}`} placement={p}>
                            <Button variant="secondary" size="sm">{p}</Button>
                          </Tooltip>
                        ))}
                      </Row>
                    }
                    code={`// placement: top (default) | bottom | left | right
<Tooltip content="Saved!" placement="top">
  <Button>Save</Button>
</Tooltip>

<Tooltip content="Opens in new tab" placement="right">
  <a href="/docs">Docs</a>
</Tooltip>`}
                  />
                </Block>
                <Block label="On various triggers">
                  <PreviewCode
                    preview={
                      <Row gap={4} align="center" wrap>
                        <Tooltip content="Edit this item">
                          <Button variant="ghost" size="sm" iconOnly aria-label="Edit"><EditIcon /></Button>
                        </Tooltip>
                        <Tooltip content="Required field">
                          <Badge tone="danger">!</Badge>
                        </Tooltip>
                        <Tooltip content="Maya Lin · Owner" placement="bottom">
                          <Avatar name="Maya Lin" size="md" status="online" />
                        </Tooltip>
                      </Row>
                    }
                    code={`// Works on any element — wraps with an inline span
<Tooltip content="Delete item">
  <Button variant="ghost" iconOnly aria-label="Delete">
    <TrashIcon />
  </Button>
</Tooltip>

<Tooltip content="Maya Lin · Owner" placement="bottom">
  <Avatar name="Maya Lin" size="md" status="online" />
</Tooltip>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── DIVIDER ── */}
              <Section id="divider" title="Divider">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Horizontal or vertical rule for visually separating sections. The horizontal variant optionally accepts a centered <code>label</code> — useful for "or" dividers in login forms.
                </Typography>
                <Block label="Horizontal">
                  <PreviewCode
                    preview={
                      <Col gap={4}>
                        <Divider />
                        <Divider label="or" />
                        <Divider label="Section break" />
                      </Col>
                    }
                    code={`// Plain line
<Divider />

// With centered label
<Divider label="or" />
<Divider label="Section break" />`}
                  />
                </Block>
                <Block label="Vertical">
                  <PreviewCode
                    preview={
                      <Row gap={4} align="center" style={{ height: 40 }}>
                        <Typography variant="body2" color="muted" as="span">Item A</Typography>
                        <Divider orientation="vertical" />
                        <Typography variant="body2" color="muted" as="span">Item B</Typography>
                        <Divider orientation="vertical" />
                        <Typography variant="body2" color="muted" as="span">Item C</Typography>
                      </Row>
                    }
                    code={`<Row align="center" style={{ height: 40 }}>
  <span>Item A</span>
  <Divider orientation="vertical" />
  <span>Item B</span>
  <Divider orientation="vertical" />
  <span>Item C</span>
</Row>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── CONTAINER ── */}
              <Section id="container" title="Container">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Constrains content to a max-width and centers it horizontally with auto margins. Use it at the page level to maintain consistent, readable line lengths across viewport sizes.
                </Typography>
                <Block label="Max-width presets">
                  <PreviewCode
                    preview={
                      <Col gap={3}>
                        {(['sm', 'md', 'lg', 'xl'] as const).map(s => (
                          <Container key={s} maxWidth={s} center style={{ background: 'var(--color-bg-muted)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', border: '1px dashed var(--color-border)' }}>
                            <Row justify="space-between" align="center">
                              <Typography variant="caption" color="muted" as="span">maxWidth="{s}"</Typography>
                              <Badge variant="outline" tone="neutral">{s === 'sm' ? '640px' : s === 'md' ? '768px' : s === 'lg' ? '1024px' : '1280px'}</Badge>
                            </Row>
                          </Container>
                        ))}
                      </Col>
                    }
                    code={`// maxWidth: 'sm' (640) | 'md' (768) | 'lg' (1024) | 'xl' (1280) | 'full'
// center: true by default (auto left/right margins)

<Container maxWidth="lg">
  <Row gap={4}>
    <Col gap={3}>Left column</Col>
    <Col gap={3}>Right column</Col>
  </Row>
</Container>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── ROW & COL ── */}
              <Section id="row-col" title="Row & Col">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Thin flexbox layout primitives. <code>Row</code> lays children out horizontally; <code>Col</code> vertically. Both accept <code>gap</code> (space tokens 1–8), <code>align</code>, and <code>justify</code> — eliminating repetitive flex boilerplate.
                </Typography>
                <Block label="Row — gap, align, justify">
                  <PreviewCode
                    preview={
                      <Col gap={4}>
                        {[
                          { name: 'Maya Lin', status: 'online' as const, tone: 'success' as const },
                          { name: 'Alex Ray', status: 'offline' as const, tone: 'neutral' as const },
                        ].map(m => (
                          <Row key={m.name} gap={3} align="center" justify="space-between" style={{ background: 'var(--color-bg-muted)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                            <Avatar name={m.name} size="sm" />
                            <Typography variant="body2" as="span" style={{ flex: 1 }}>{m.name}</Typography>
                            <Badge tone={m.tone}>{m.status}</Badge>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </Row>
                        ))}
                      </Col>
                    }
                    code={`<Row gap={3} align="center" justify="space-between">
  <Avatar name="Maya Lin" size="sm" />
  <span style={{ flex: 1 }}>Maya Lin</span>
  <Badge tone="success">online</Badge>
  <Button variant="ghost" size="sm">Edit</Button>
</Row>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── TEXTAREA ── */}
              <Section id="textarea" title="Textarea">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Multi-line text input with four resize modes and the same label/helper/error system as <code>Input</code>. The <code>code</code> variant renders a read-only syntax-highlighted block — used by this page for all code examples.
                </Typography>
                <Block label="Default">
                  <PreviewCode
                    preview={
                      <Col gap={4} style={{ maxWidth: 480 }}>
                        <Textarea label="Bio" placeholder="Tell us about yourself…" helperText="Max 280 characters." rows={3} />
                        <Textarea label="Notes" placeholder="Add notes…" resize="none" rows={4} />
                      </Col>
                    }
                    code={`<Textarea
  label="Bio"
  placeholder="Tell us about yourself…"
  helperText="Max 280 characters."
  rows={3}
/>

// resize: 'none' | 'vertical' (default) | 'horizontal' | 'both'
<Textarea label="Notes" resize="none" rows={4} />`}
                  />
                </Block>
                <Block label="States">
                  <PreviewCode
                    preview={
                      <Col gap={4} style={{ maxWidth: 480 }}>
                        <Textarea label="Error" error="This field is required." placeholder="Enter a value" rows={3} />
                        <Textarea label="Disabled" disabled placeholder="Cannot edit" rows={3} />
                      </Col>
                    }
                    code={`<Textarea label="Notes" error="This field is required." rows={3} />
<Textarea label="Notes" disabled rows={3} />`}
                  />
                </Block>
                <Block label="Code variant">
                  <PreviewCode
                    preview={
                      <Textarea
                        variant="code"
                        value={`import { Button } from '@your-org/design-system';

export function MyComponent() {
  return (
    <Button variant="primary" onClick={() => alert('Clicked!')}>
      Click me
    </Button>
  );
}`}
                      />
                    }
                    code={`// variant="code" renders a syntax-highlighted read-only block
<Textarea
  variant="code"
  value={\`import { Button } from '@your-org/ds';

export function App() {
  return <Button>Hello</Button>;
}\`}
/>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── COMBOBOX ── */}
              <Section id="combobox" title="Combobox">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Filterable select that lets users type to narrow down a long list of options. Keyboard navigable (arrow keys, Enter, Escape). Accepts a custom <code>filterFn</code> for server-side or fuzzy filtering.
                </Typography>
                <Block label="Filterable select">
                  <PreviewCode
                    preview={
                      <Col gap={4} style={{ maxWidth: 360 }}>
                        <Combobox
                          label="Framework"
                          placeholder="Search frameworks…"
                          options={[
                            { value: 'react', label: 'React' },
                            { value: 'vue', label: 'Vue' },
                            { value: 'svelte', label: 'Svelte' },
                            { value: 'solid', label: 'SolidJS' },
                            { value: 'angular', label: 'Angular' },
                            { value: 'qwik', label: 'Qwik' },
                          ]}
                          helperText="Type to filter options."
                        />
                      </Col>
                    }
                    code={`<Combobox
  label="Framework"
  placeholder="Search frameworks…"
  options={[
    { value: 'react',   label: 'React' },
    { value: 'vue',     label: 'Vue' },
    { value: 'svelte',  label: 'Svelte' },
    { value: 'solid',   label: 'SolidJS' },
    { value: 'angular', label: 'Angular' },
  ]}
/>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── DATEPICKER ── */}
              <Section id="datepicker" title="DatePicker">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Calendar popover for selecting a single date. Portal-rendered to avoid clipping inside overflow containers. Accepts <code>min</code> and <code>max</code> props to constrain the selectable range, and works in both controlled and uncontrolled modes.
                </Typography>
                <Block label="Default">
                  <PreviewCode
                    preview={
                      <Col gap={4} style={{ maxWidth: 360 }}>
                        <DatePicker label="Start date" placeholder="Pick a date…" helperText="Select the project start date." />
                        <DatePicker label="End date" placeholder="Pick a date…" />
                      </Col>
                    }
                    code={`// Uncontrolled
<DatePicker
  label="Start date"
  placeholder="Pick a date…"
  helperText="Select the project start date."
/>

// Controlled
const [date, setDate] = useState<Date | null>(null);
<DatePicker
  label="End date"
  value={date}
  onChange={setDate}
/>`}
                  />
                </Block>
                <Block label="Sizes & states">
                  <PreviewCode
                    preview={
                      <Col gap={4} style={{ maxWidth: 360 }}>
                        <DatePicker label="Small" inputSize="sm" placeholder="Pick a date…" />
                        <DatePicker label="Large" inputSize="lg" placeholder="Pick a date…" />
                        <DatePicker label="Error" error="Date is required." placeholder="Pick a date…" />
                        <DatePicker label="Disabled" disabled placeholder="Pick a date…" />
                      </Col>
                    }
                    code={`<DatePicker inputSize="sm" label="Small" />
<DatePicker inputSize="lg" label="Large" />
<DatePicker label="Deadline" error="Date is required." />
<DatePicker label="Locked" disabled />`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── SLIDER ── */}
              <Section id="slider" title="Slider">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Range input for choosing a numeric value. The default <code>filled</code> variant colors the track to the left of the thumb; the <code>plain</code> variant shows a uniform track. Accepts a <code>formatValue</code> function for custom display (e.g., currency, percentage).
                </Typography>
                <Block label="Default">
                  <PreviewCode
                    preview={
                      <Col gap={6} style={{ maxWidth: 400 }}>
                        <Slider label="Volume" defaultValue={60} showValue />
                        <Slider label="Opacity" defaultValue={80} showValue formatValue={v => `${v}%`} />
                        <Slider label="Price range" min={0} max={500} step={10} defaultValue={200} showValue formatValue={v => `$${v}`} />
                      </Col>
                    }
                    code={`<Slider label="Volume" defaultValue={60} showValue />

<Slider
  label="Opacity"
  defaultValue={80}
  showValue
  formatValue={v => \`\${v}%\`}
/>

<Slider
  label="Price range"
  min={0}
  max={500}
  step={10}
  defaultValue={200}
  showValue
  formatValue={v => \`$\${v}\`}
/>`}
                  />
                </Block>
                <Block label="Plain variant">
                  <PreviewCode
                    preview={
                      <Col gap={6} style={{ maxWidth: 400 }}>
                        <Slider label="Balance" defaultValue={65} showValue variant="plain" />
                        <Slider label="Speed" defaultValue={30} showValue variant="plain" formatValue={v => `${v}%`} />
                      </Col>
                    }
                    code={`// variant="plain" — uniform track, no fill
<Slider label="Balance" defaultValue={65} showValue variant="plain" />
<Slider label="Speed"   defaultValue={30} showValue variant="plain" formatValue={v => \`\${v}%\`} />`}
                  />
                </Block>
                <Block label="States">
                  <PreviewCode
                    preview={
                      <Col gap={6} style={{ maxWidth: 400 }}>
                        <Slider label="Disabled" defaultValue={40} disabled showValue />
                      </Col>
                    }
                    code={`<Slider label="Disabled" defaultValue={40} disabled />`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── RADIO ── */}
              <Section id="radio" title="Radio">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Single-select choice among a fixed, visible set of options. Wrap individual <code>Radio</code> elements in a <code>RadioGroup</code> to share state, name, and orientation. For more than ~5 options, prefer <code>Select</code> or <code>Combobox</code>.
                </Typography>
                <Block label="Vertical group">
                  <PreviewCode
                    preview={<RadioGroupExample />}
                    code={`const [plan, setPlan] = useState('pro');

<RadioGroup
  label="Billing plan"
  value={plan}
  onChange={setPlan}
>
  <Radio value="free"  label="Free — up to 3 projects" />
  <Radio value="pro"   label="Pro — unlimited projects" />
  <Radio value="team"  label="Team — collaboration tools" />
</RadioGroup>`}
                  />
                </Block>
                <Block label="Horizontal">
                  <PreviewCode
                    preview={<RadioHorizontalExample />}
                    code={`const [size, setSize] = useState('md');

<RadioGroup
  label="Size"
  value={size}
  onChange={setSize}
  orientation="horizontal"
>
  <Radio value="sm" label="SM" />
  <Radio value="md" label="MD" />
  <Radio value="lg" label="LG" />
</RadioGroup>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── FORMFIELD ── */}
              <Section id="formfield" title="FormField">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  A layout wrapper that adds a label, helper text, and error state around <em>any</em> control.
                  Use it when the built-in components (<code>Input</code>, <code>Select</code>, <code>Textarea</code>, etc.) don't fit — for example, a native <code>&lt;select&gt;</code>, a third-party date picker, or a custom composite control.
                  Children can read the generated field id and error state via the <code>useFormField()</code> hook.
                </Typography>
                <Block label="Wrapping any input">
                  <PreviewCode
                    preview={<FormFieldExample />}
                    code={`<FormField
  label="Username"
  helperText="Only letters, numbers, and underscores."
  required
>
  <input type="text" placeholder="e.g. maya_lin" />
</FormField>

<FormField
  label="Custom select"
  error="Please choose a value."
>
  <select>
    <option value="">Choose…</option>
    <option value="a">Option A</option>
  </select>
</FormField>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── DRAWER ── */}
              <Section id="drawer" title="Drawer">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Slide-in panel from the left or right edge of the viewport. Portal-rendered with a backdrop. Accepts a sticky <code>footer</code> slot for action buttons and a <code>dismissOnBackdrop</code> flag to control whether clicking outside closes it.
                </Typography>
                <Block label="Sides & sizes">
                  <PreviewCode
                    preview={<DrawerExample />}
                    code={`const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open drawer</Button>

<Drawer
  open={open}
  onClose={() => setOpen(false)}
  side="right"
  size="md"
  title="Edit profile"
  description="Update your public information."
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={() => setOpen(false)}>Save changes</Button>
    </>
  }
>
  <Col gap={4}>
    <Input label="Name" defaultValue="Maya Lin" />
    <Input label="Email" type="email" defaultValue="maya@example.com" />
  </Col>
</Drawer>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── POPOVER ── */}
              <Section id="popover" title="Popover">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Floating content panel anchored to a trigger element. Unlike <code>Tooltip</code>, the content can be interactive (forms, pickers, rich text). Supports eight placements and both controlled and uncontrolled open state.
                </Typography>
                <Block label="Placements">
                  <PreviewCode
                    preview={
                      <Row gap={4} wrap style={{ padding: 'var(--space-4) 0' }}>
                        {(['bottom', 'bottom-start', 'top', 'right'] as const).map(p => (
                          <Popover
                            key={p}
                            placement={p}
                            trigger={<Button variant="secondary" size="sm">{p}</Button>}
                            content={`Popover content placed ${p}.`}
                          />
                        ))}
                      </Row>
                    }
                    code={`<Popover
  placement="bottom"
  trigger={<Button>Open popover</Button>}
  content={
    <div style={{ padding: 'var(--space-3)' }}>
      <p>Popover content goes here.</p>
    </div>
  }
/>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── MENU ── */}
              <Section id="menu" title="Menu">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Dropdown list of actions anchored to a trigger. Supports icons, keyboard shortcuts, section labels, separators, and danger items. Keyboard navigable (arrow keys, Enter, Escape).
                </Typography>
                <Block label="Default">
                  <PreviewCode
                    preview={<MenuExample />}
                    code={`const items: MenuItem[] = [
  { label: 'Edit',    icon: <EditIcon />,  onClick: () => {} },
  { label: 'Duplicate', onClick: () => {} },
  { type: 'separator' },
  { label: 'Delete',  danger: true, onClick: () => {} },
];

<Menu
  trigger={<Button variant="secondary">Actions</Button>}
  items={items}
/>`}
                  />
                </Block>
                <Block label="With labels & shortcuts">
                  <PreviewCode
                    preview={<MenuWithLabelsExample />}
                    code={`const items: MenuItem[] = [
  { type: 'label', label: 'Text' },
  { label: 'Bold',      shortcut: '⌘B', onClick: () => {} },
  { label: 'Italic',    shortcut: '⌘I', onClick: () => {} },
  { label: 'Underline', shortcut: '⌘U', onClick: () => {} },
  { type: 'separator' },
  { type: 'label', label: 'Insert' },
  { label: 'Image',  onClick: () => {} },
  { label: 'Table',  onClick: () => {} },
  { label: 'Code block', onClick: () => {} },
];

<Menu
  trigger={<Button variant="ghost" size="sm">Format ▾</Button>}
  items={items}
/>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── CONTEXTMENU ── */}
              <Section id="contextmenu" title="ContextMenu">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Right-click menu that appears at the cursor position. Wraps any element as the trigger area. Shares the same <code>MenuItem</code> type as <code>Menu</code>, so items are fully interchangeable.
                </Typography>
                <Block label="Right-click trigger">
                  <PreviewCode
                    preview={<ContextMenuExample />}
                    code={`const items: MenuItem[] = [
  { label: 'Open',          onClick: () => {} },
  { label: 'Open in tab',   onClick: () => {} },
  { type: 'separator' },
  { label: 'Copy link',     onClick: () => {} },
  { label: 'Copy path',     onClick: () => {} },
  { type: 'separator' },
  { label: 'Delete',  danger: true, onClick: () => {} },
];

<ContextMenu
  trigger={<div>Right-click anywhere here</div>}
  items={items}
/>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── TOAST ── */}
              <Section id="toast" title="Toast">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Transient notification that auto-dismisses after a configurable duration. Requires <code>&lt;ToastProvider&gt;</code> once at the app root. Dispatch toasts from anywhere in the tree via <code>useToast()</code>. Set <code>duration: 0</code> for a persistent toast.
                </Typography>
                <Block label="Tones">
                  <PreviewCode
                    preview={<ToastExample />}
                    code={`// Wrap your app once:
<ToastProvider>
  <App />
</ToastProvider>

// Then anywhere inside:
const toast = useToast();

toast({ title: 'File saved', tone: 'success' });
toast({ title: 'Update available', description: 'Refresh to see changes.', tone: 'info' });
toast({ title: 'Low storage', description: '90% of quota used.', tone: 'warning' });
toast({ title: 'Upload failed', description: 'Check your connection.', tone: 'danger' });

// Persistent (no auto-dismiss):
toast({ title: 'Background task running…', duration: 0 });`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── ALERT ── */}
              <Section id="alert" title="Alert">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Persistent inline message for communicating status or feedback within the page. Unlike <code>Toast</code>, it stays in the document flow and is always visible. Provide <code>onClose</code> to make it dismissible.
                </Typography>
                <Block label="Tones">
                  <PreviewCode
                    preview={
                      <Col gap={3}>
                        <Alert tone="info" title="Info"    >Your session will expire in 5 minutes.</Alert>
                        <Alert tone="success" title="Success" >Profile updated successfully.</Alert>
                        <Alert tone="warning" title="Warning" >Two-factor authentication is not enabled.</Alert>
                        <Alert tone="danger" title="Error"   >Failed to save changes. Please try again.</Alert>
                      </Col>
                    }
                    code={`// tone: info | success | warning | danger
<Alert tone="info"    title="Info">Your session expires in 5 min.</Alert>
<Alert tone="success" title="Success">Profile updated.</Alert>
<Alert tone="warning" title="Warning">2FA is not enabled.</Alert>
<Alert tone="danger"  title="Error">Failed to save changes.</Alert>`}
                  />
                </Block>
                <Block label="Dismissible">
                  <PreviewCode
                    preview={<AlertExample />}
                    code={`const [visible, setVisible] = useState(true);

{visible && (
  <Alert
    tone="warning"
    title="Action required"
    onClose={() => setVisible(false)}
  >
    Please verify your email address within 24 hours.
  </Alert>
)}`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── SPINNER ── */}
              <Section id="spinner" title="Spinner">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Animated loading indicator for signalling async work in progress. Use <code>color="current"</code> to inherit the parent's color, making it suitable for placement inside buttons and other tinted containers.
                </Typography>
                <Block label="Sizes">
                  <PreviewCode
                    preview={
                      <Row gap={6} align="center">
                        {(['sm', 'md', 'lg'] as const).map(s => (
                          <Col key={s} gap={2} align="center">
                            <Spinner size={s} />
                            <Typography variant="caption" color="muted" as="span">{s}</Typography>
                          </Col>
                        ))}
                      </Row>
                    }
                    code={`<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />`}
                  />
                </Block>
                <Block label="Inside a button">
                  <PreviewCode
                    preview={
                      <Row gap={3}>
                        <Button variant="secondary" leading={<Spinner size="sm" color="current" />}>
                          Saving…
                        </Button>
                        <Button disabled>
                          <Spinner size="sm" color="current" />
                          Loading
                        </Button>
                      </Row>
                    }
                    code={`<Button variant="secondary" leading={<Spinner size="sm" color="current" />}>
  Saving…
</Button>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── SKELETON ── */}
              <Section id="skeleton" title="Skeleton">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Placeholder content shown while real data is loading. Three variants — <code>text</code>, <code>circle</code>, and <code>rect</code> — cover most layouts. Combine them to mirror the shape of the content that will appear.
                </Typography>
                <Block label="Variants">
                  <PreviewCode
                    preview={
                      <Col gap={4} style={{ maxWidth: 360 }}>
                        <Skeleton variant="text" lines={3} />
                        <Row gap={3} align="center">
                          <Skeleton variant="circle" width={48} height={48} />
                          <Col gap={2} style={{ flex: 1 }}>
                            <Skeleton variant="text" lines={1} />
                            <Skeleton variant="rect" height={12} />
                          </Col>
                        </Row>
                        <Skeleton variant="rect" height={120} />
                      </Col>
                    }
                    code={`// Text lines
<Skeleton variant="text" lines={3} />

// Circle (avatar placeholder)
<Skeleton variant="circle" width={48} height={48} />

// Rectangle (image / card placeholder)
<Skeleton variant="rect" height={120} />`}
                  />
                </Block>
                <Block label="Card skeleton">
                  <PreviewCode
                    preview={<SkeletonCardExample />}
                    code={`<Card style={{ maxWidth: 320 }}>
  <Skeleton variant="rect" height={160} />
  <CardBody>
    <Col gap={3}>
      <Row gap={3} align="center">
        <Skeleton variant="circle" width={40} height={40} />
        <Col gap={1} style={{ flex: 1 }}>
          <Skeleton variant="text" lines={1} />
          <Skeleton variant="rect" height={10} width="60%" />
        </Col>
      </Row>
      <Skeleton variant="text" lines={3} />
    </Col>
  </CardBody>
</Card>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── PROGRESS ── */}
              <Section id="progress" title="Progress">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Visualizes a completion percentage. The <code>bar</code> variant suits linear workflows (file uploads, multi-step forms); the <code>circular</code> variant suits compact metric displays in dashboards and stat cards.
                </Typography>
                <Block label="Bar">
                  <PreviewCode
                    preview={
                      <Col gap={4} style={{ maxWidth: 400 }}>
                        <Progress value={72} label="Storage" showValue />
                        <Progress value={45} tone="warning" label="CPU" showValue />
                        <Progress value={90} tone="danger" label="Memory" showValue />
                        <Progress value={100} tone="success" label="Upload complete" showValue />
                      </Col>
                    }
                    code={`// tone: accent (default) | success | warning | danger
<Progress value={72}  label="Storage" showValue />
<Progress value={45}  tone="warning" label="CPU" showValue />
<Progress value={90}  tone="danger"  label="Memory" showValue />
<Progress value={100} tone="success" label="Upload complete" showValue />`}
                  />
                </Block>
                <Block label="Circular">
                  <PreviewCode
                    preview={
                      <Row gap={6} wrap>
                        <Progress variant="circular" value={68} tone="accent" size="md" showValue label="Overall" />
                        <Progress variant="circular" value={92} tone="success" size="md" showValue label="Tests" />
                        <Progress variant="circular" value={34} tone="warning" size="md" showValue label="Coverage" />
                        <Progress variant="circular" value={12} tone="danger" size="md" showValue label="Budget" />
                      </Row>
                    }
                    code={`<Progress variant="circular" value={68} tone="accent"  showValue label="Overall" />
<Progress variant="circular" value={92} tone="success" showValue label="Tests" />
<Progress variant="circular" value={34} tone="warning" showValue label="Coverage" />
<Progress variant="circular" value={12} tone="danger"  showValue label="Budget" />`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── STAT ── */}
              <Section id="stat" title="Stat">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Displays a key metric alongside an optional change indicator. The <code>trend</code> prop (<code>up</code>, <code>down</code>, <code>neutral</code>) controls the arrow icon and color — note that "down" is not always negative depending on the metric.
                </Typography>
                <Block label="Trend indicators">
                  <PreviewCode
                    preview={
                      <Row gap={4} wrap>
                        <Stat label="Revenue" value="$48,295" change="+12.5%" trend="up" description="vs last month" />
                        <Stat label="Active users" value="3,842" change="-2.1%" trend="down" description="vs last week" />
                        <Stat label="Uptime" value="99.97%" change="0.0%" trend="neutral" description="last 30 days" />
                        <Stat label="Open tickets" value="17" change="+4" trend="down" description="needs attention" />
                      </Row>
                    }
                    code={`// trend: 'up' | 'down' | 'neutral'
<Stat
  label="Revenue"
  value="$48,295"
  change="+12.5%"
  trend="up"
  description="vs last month"
/>

<Stat
  label="Active users"
  value="3,842"
  change="-2.1%"
  trend="down"
  description="vs last week"
/>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── TIMELINE ── */}
              <Section id="timeline" title="Timeline">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Vertical sequence of events or steps. Each item has a <code>label</code>, optional <code>description</code>, optional <code>time</code> stamp, an optional custom <code>icon</code>, and a <code>tone</code> for the dot color.
                </Typography>
                <Block label="Default">
                  <PreviewCode
                    preview={
                      <Timeline
                        items={[
                          { label: 'Order placed', description: 'Your order #8421 was confirmed.', time: '9:00 AM', tone: 'success' },
                          { label: 'Payment received', description: 'Payment of $249 processed.', time: '9:05 AM', tone: 'success' },
                          { label: 'Processing', description: 'Items are being prepared for shipping.', time: '10:30 AM', tone: 'accent' },
                          { label: 'Shipped', description: 'Package handed to carrier.', time: 'Pending', tone: 'neutral' },
                          { label: 'Delivered', description: 'Expected by Friday.', time: 'Pending', tone: 'neutral' },
                        ]}
                      />
                    }
                    code={`<Timeline
  items={[
    {
      label: 'Order placed',
      description: 'Your order #8421 was confirmed.',
      time: '9:00 AM',
      tone: 'success',
    },
    {
      label: 'Processing',
      description: 'Items are being prepared.',
      time: '10:30 AM',
      tone: 'accent',
    },
    {
      label: 'Delivered',
      description: 'Expected by Friday.',
      time: 'Pending',
      tone: 'neutral',
    },
  ]}
/>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── EMPTYSTATE ── */}
              <Section id="emptystate" title="EmptyState">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Placeholder for views with no content — empty inboxes, zero search results, first-time user screens. Accepts an <code>icon</code>, <code>title</code>, <code>description</code>, and an <code>action</code> slot for a primary call to action.
                </Typography>
                <Block label="Default">
                  <PreviewCode
                    preview={
                      <Col gap={6}>
                        <EmptyState
                          icon={<InboxIcon />}
                          title="No messages"
                          description="When you receive messages they'll appear here."
                          action={<Button variant="secondary" size="sm">Invite teammates</Button>}
                        />
                      </Col>
                    }
                    code={`<EmptyState
  icon={<InboxIcon />}
  title="No messages"
  description="When you receive messages they'll appear here."
  action={
    <Button variant="secondary" size="sm">
      Invite teammates
    </Button>
  }
/>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── TABLE ── */}
              <Section id="table" title="Table">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Semantic HTML table primitives (<code>Table</code>, <code>TableHead</code>, <code>TableBody</code>, <code>TableRow</code>, <code>Th</code>, <code>Td</code>) for full manual control, plus a <code>DataTable</code> component for data-driven tables with built-in column sorting and row selection.
                </Typography>
                <Block label="Primitives">
                  <PreviewCode
                    preview={<TablePrimitivesExample />}
                    code={`<Table>
  <TableHead>
    <TableRow>
      <Th>Name</Th>
      <Th>Role</Th>
      <Th>Status</Th>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <Td>Maya Lin</Td>
      <Td>Owner</Td>
      <Td><Badge tone="success">Active</Badge></Td>
    </TableRow>
  </TableBody>
</Table>`}
                  />
                </Block>
                <Block label="DataTable — sortable + selectable">
                  <PreviewCode
                    preview={<DataTableExample />}
                    code={`const columns: DataTableColumn[] = [
  { key: 'name',   header: 'Name',   cell: row => row.name,   sortable: true },
  { key: 'role',   header: 'Role',   cell: row => row.role },
  { key: 'status', header: 'Status', cell: row => (
    <Badge tone={row.status === 'Active' ? 'success' : 'neutral'}>
      {row.status}
    </Badge>
  )},
];

<DataTable
  columns={columns}
  data={users}
  rowKey={row => row.id}
  selectable
/>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── BREADCRUMB ── */}
              <Section id="breadcrumb" title="Breadcrumb">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Navigation trail showing the user's location within the site hierarchy. The last item represents the current page — rendered as plain text with <code>aria-current="page"</code>. Accepts a custom <code>separator</code>.
                </Typography>
                <Block label="Default">
                  <PreviewCode
                    preview={
                      <Col gap={4}>
                        <Breadcrumb
                          items={[
                            { label: 'Home', href: '#' },
                            { label: 'Projects', href: '#' },
                            { label: 'Design System' },
                          ]}
                        />
                        <Breadcrumb
                          separator="›"
                          items={[
                            { label: 'Docs', href: '#' },
                            { label: 'Components', href: '#' },
                            { label: 'Breadcrumb' },
                          ]}
                        />
                      </Col>
                    }
                    code={`<Breadcrumb
  items={[
    { label: 'Home',     href: '/home' },
    { label: 'Projects', href: '/projects' },
    { label: 'Design System' }, // last item = current page
  ]}
/>

// Custom separator
<Breadcrumb
  separator="›"
  items={[...]}
/>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── PAGINATION ── */}
              {/* ── TYPOGRAPHY ── */}
              <Section id="typography" title="Typography">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Renders semantic text at any scale. The <code>variant</code> prop controls visual style while <code>as</code> overrides the HTML tag when needed. Supports color, alignment, weight, gutterBottom, and noWrap modifiers.
                </Typography>
                <Block label="Headings">
                  <PreviewCode
                    preview={
                      <Col gap={2}>
                        {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map(v => (
                          <Typography key={v} variant={v}>{v.toUpperCase()} — The quick brown fox</Typography>
                        ))}
                      </Col>
                    }
                    code={`<Typography variant="h1">H1 — The quick brown fox</Typography>
<Typography variant="h2">H2 — The quick brown fox</Typography>
<Typography variant="h3">H3 — The quick brown fox</Typography>
<Typography variant="h4">H4 — The quick brown fox</Typography>
<Typography variant="h5">H5 — The quick brown fox</Typography>
<Typography variant="h6">H6 — The quick brown fox</Typography>`}
                  />
                </Block>
                <Block label="Subtitles">
                  <PreviewCode
                    preview={
                      <Col gap={2}>
                        <Typography variant="subtitle1">Subtitle 1 — Section introduction text</Typography>
                        <Typography variant="subtitle2">Subtitle 2 — Supporting descriptive copy</Typography>
                      </Col>
                    }
                    code={`<Typography variant="subtitle1">Subtitle 1 — Section introduction text</Typography>
<Typography variant="subtitle2">Subtitle 2 — Supporting descriptive copy</Typography>`}
                  />
                </Block>
                <Block label="Body">
                  <PreviewCode
                    preview={
                      <Col gap={3}>
                        <Typography variant="body1">Body 1 — Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Typography>
                        <Typography variant="body2">Body 2 — Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Typography>
                      </Col>
                    }
                    code={`<Typography variant="body1">
  Body 1 — default paragraph text at 16px.
</Typography>

<Typography variant="body2">
  Body 2 — secondary paragraph text at 14px.
</Typography>`}
                  />
                </Block>
                <Block label="Caption, Overline & Label">
                  <PreviewCode
                    preview={
                      <Col gap={3}>
                        <Typography variant="overline">Overline — category label</Typography>
                        <Typography variant="label">Label — form field or UI label</Typography>
                        <Typography variant="caption">Caption — supplementary metadata or timestamps</Typography>
                      </Col>
                    }
                    code={`// Rendered as <span> by default
<Typography variant="overline">Overline — category label</Typography>
<Typography variant="label">Label — form field or UI label</Typography>
<Typography variant="caption">Caption — supplementary metadata</Typography>`}
                  />
                </Block>
                <Block label="Colors">
                  <PreviewCode
                    preview={
                      <Col gap={2}>
                        {(['default', 'muted', 'subtle', 'accent', 'danger', 'success', 'warning'] as const).map(c => (
                          <Typography key={c} variant="body2" color={c}>
                            color="{c}" — The quick brown fox jumps over the lazy dog.
                          </Typography>
                        ))}
                      </Col>
                    }
                    code={`<Typography color="default">Default</Typography>
<Typography color="muted">Muted</Typography>
<Typography color="subtle">Subtle</Typography>
<Typography color="accent">Accent</Typography>
<Typography color="danger">Danger</Typography>
<Typography color="success">Success</Typography>
<Typography color="warning">Warning</Typography>`}
                  />
                </Block>
                <Block label="Utilities">
                  <PreviewCode
                    preview={
                      <Col gap={4} style={{ maxWidth: 360 }}>
                        <Typography variant="body1" gutterBottom>With gutterBottom — adds 0.5em margin below.</Typography>
                        <Typography variant="body1" noWrap>noWrap — this text is clipped with an ellipsis and will not wrap to the next line no matter how long it gets.</Typography>
                        <Typography variant="h4" align="center">Centered heading</Typography>
                        <Typography variant="body2" weight="semibold">weight="semibold" override on body2</Typography>
                        <Typography variant="h3" as="p">h3 variant rendered as a &lt;p&gt; tag</Typography>
                      </Col>
                    }
                    code={`// gutterBottom adds 0.5em margin-bottom
<Typography gutterBottom>Paragraph with gutter.</Typography>

// noWrap clips overflow text with ellipsis
<Typography noWrap>Very long text that would normally wrap...</Typography>

// align overrides text-align
<Typography align="center">Centered</Typography>

// weight overrides font-weight independent of variant
<Typography variant="body2" weight="semibold">Bold body text</Typography>

// as prop changes the HTML tag while keeping variant styles
<Typography variant="h3" as="p">Styled h3, rendered as p</Typography>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── LINK ── */}
              <Section id="link" title="Link">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Anchor element with two variants: <code>inline</code> for text links within prose, and <code>nav</code> for block navigation items with a hover background. Supports an <code>as</code> prop to swap in any router link without losing styles.
                </Typography>
                <Block label="Inline — underline modes">
                  <PreviewCode
                    preview={
                      <Col gap={3}>
                        <Typography variant="body2">underline=<code>"hover"</code> (default) — <Link href="#">Visit the documentation</Link> for more details.</Typography>
                        <Typography variant="body2">underline=<code>"always"</code> — <Link href="#" underline="always">Always underlined link</Link> in body text.</Typography>
                        <Typography variant="body2">underline=<code>"none"</code> — <Link href="#" underline="none">No underline ever</Link> useful in tight UI.</Typography>
                      </Col>
                    }
                    code={`// default: underline appears on hover
<Link href="/docs">Visit the documentation</Link>

// always underlined
<Link href="/docs" underline="always">Always underlined</Link>

// never underlined
<Link href="/docs" underline="none">No underline</Link>`}
                  />
                </Block>
                <Block label="Colors">
                  <PreviewCode
                    preview={
                      <Col gap={2}>
                        {(['accent', 'default', 'muted', 'subtle', 'danger', 'success', 'warning'] as const).map(c => (
                          <Typography key={c} variant="body2">
                            <Link href="#" color={c} underline="always">color="{c}"</Link> — The quick brown fox jumps over the lazy dog.
                          </Typography>
                        ))}
                      </Col>
                    }
                    code={`<Link href="#" color="accent">Accent (default)</Link>
<Link href="#" color="muted">Muted</Link>
<Link href="#" color="danger">Danger</Link>
<Link href="#" color="success">Success</Link>`}
                  />
                </Block>
                <Block label="Nav variant">
                  <PreviewCode
                    preview={
                      <div style={{ width: 180, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3)', background: 'var(--color-bg-subtle)' }}>
                        <Col gap={1}>
                          {['Overview', 'Components', 'Tokens', 'Changelog'].map(item => (
                            <Link key={item} variant="nav" href="#">{item}</Link>
                          ))}
                        </Col>
                      </div>
                    }
                    code={`// variant="nav" — block item with hover background
// color defaults to "muted", hover changes to fg
// aria-current="page" highlights the active item

{navItems.map(item => (
  <Link
    key={item.href}
    variant="nav"
    href={item.href}
    aria-current={isActive(item.href) ? 'page' : undefined}
  >
    {item.label}
  </Link>
))}`}
                  />
                </Block>
                <Block label="Polymorphic — as prop">
                  <PreviewCode
                    preview={
                      <Col gap={3}>
                        <Typography variant="body2"><Link href="#" underline="hover">Default — renders as &lt;a&gt;</Link></Typography>
                        <Typography variant="body2"><Link as="button" onClick={() => {}} underline="always" color="accent" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>as="button" — same styles, no href needed</Link></Typography>
                      </Col>
                    }
                    code={`// Default <a>
<Link href="/about">About us</Link>

// React Router / Next.js — pass their Link as \`as\`
import { Link as RouterLink } from 'react-router-dom';

<Link as={RouterLink} to="/about">About us</Link>

// Button element (no href)
<Link as="button" onClick={handleClick}>Trigger action</Link>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── STICKYNOTE ── */}
              <Section id="stickynote" title="StickyNote">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Controlled sticky-note surface with five pastel colors and three sizes. Renders a <code>textarea</code> in edit mode and markdown in read mode — toggle between them by flipping <code>readOnly</code>. Markdown is rendered via <code>react-markdown</code> (XSS-safe, no <code>dangerouslySetInnerHTML</code>).
                </Typography>
                <Block label="Colors">
                  <PreviewCode
                    preview={
                      <Row gap={4} wrap>
                        {(['yellow', 'green', 'pink', 'blue', 'purple'] as const).map(c => (
                          <StickyNote
                            key={c}
                            color={c}
                            size="sm"
                            readOnly
                            value={`**${c.charAt(0).toUpperCase() + c.slice(1)}**\nA sticky note.`}
                          />
                        ))}
                      </Row>
                    }
                    code={`// color: yellow (default) | green | pink | blue | purple
<StickyNote color="yellow" readOnly value="**Yellow** note." />
<StickyNote color="green"  readOnly value="**Green** note." />
<StickyNote color="pink"   readOnly value="**Pink** note." />
<StickyNote color="blue"   readOnly value="**Blue** note." />
<StickyNote color="purple" readOnly value="**Purple** note." />`}
                  />
                </Block>
                <Block label="Sizes">
                  <PreviewCode
                    preview={
                      <Row gap={4} align="flex-end" wrap>
                        {(['sm', 'md', 'lg'] as const).map(s => (
                          <StickyNote
                            key={s}
                            size={s}
                            color="blue"
                            readOnly
                            value={`size=**"${s}"**`}
                          />
                        ))}
                      </Row>
                    }
                    code={`// size: sm (160px) | md (220px, default) | lg (280px)
<StickyNote size="sm" value="Small note." />
<StickyNote size="md" value="Medium note." />
<StickyNote size="lg" value="Large note." />`}
                  />
                </Block>
                <Block label="Click-to-edit with markdown">
                  <PreviewCode
                    preview={<StickyNoteEditExample />}
                    code={`const [text, setText] = useState('Click to edit.\\n\\nTry **bold** or *italic*.');
const [editing, setEditing] = useState(false);

<StickyNote
  value={text}
  onChange={setText}
  color="pink"
  readOnly={!editing}
  onClick={() => setEditing(true)}
  onBlur={() => setEditing(false)}
/>`}
                  />
                </Block>
              </Section>

              <Divider />

              {/* ── LIQUID GLASS ── */}
              <Section id="liquid-glass" title="Liquid Glass">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  A frosted-glass container inspired by Apple visionOS. Uses{' '}
                  <code>backdrop-filter: blur(20px) saturate(180%)</code> for real-time background
                  blurring with a saturation boost, a semi-transparent tint, and a specular
                  highlight that simulates refracted light from above. The vivid content
                  underneath bleeds through visually.
                </Typography>
                <Block label="Default">
                  <PreviewCode
                    preview={<LiquidGlassExample />}
                    code={`<LiquidGlass style={{ padding: 'var(--space-6)', maxWidth: 300, textAlign: 'center' }}>
  <Typography variant="h4" style={{ marginBottom: 'var(--space-2)' }}>
    Liquid Glass
  </Typography>
  <Typography variant="body2" style={{ marginBottom: 'var(--space-4)' }}>
    Background bleeds through the frosted surface.
  </Typography>
  <Button size="sm">Get started</Button>
</LiquidGlass>`}
                  />
                </Block>
              </Section>

              <Divider />

              <Section id="pagination" title="Pagination">
                <Typography variant="body2" color="muted" style={{ marginBottom: 'var(--space-2)' }}>
                  Controls for navigating between pages of a data set. Automatically collapses middle pages into an ellipsis when the page count is large. Fully controlled via <code>page</code> and <code>onChange</code>.
                </Typography>
                <Block label="Default">
                  <PreviewCode
                    preview={<PaginationExample />}
                    code={`const [page, setPage] = useState(1);

<Pagination
  page={page}
  pageCount={12}
  onChange={setPage}
/>`}
                  />
                </Block>
              </Section>

            </Col>
          </main>
        </div>
        {/* ── Mobile nav drawer ── */}
        <Drawer
          open={isMobile && navOpen}
          onClose={() => setNavOpen(false)}
          side="left"
          size="sm"
          title="Navigation"
        >
          <NavContent onLinkClick={() => setNavOpen(false)} />
        </Drawer>
        <Customizer />
      </div>
    </ToastProvider>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function HamburgerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="3" y="6" width="26" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 20h8l2 3h6l2-3h8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Sub-examples ─────────────────────────────────────────────────────────────

function StickyNoteEditExample() {
  const [text, setText] = useState('Click to edit this note.\n\nTry **bold**, *italic*, or `code`.');
  const [editing, setEditing] = useState(false);
  return (
    <StickyNote
      value={text}
      onChange={setText}
      color="pink"
      size="md"
      readOnly={!editing}
      onClick={() => setEditing(true)}
      onBlur={() => setEditing(false)}
      style={{ cursor: editing ? 'text' : 'pointer' }}
    />
  );
}


function ModalExample({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>{size.toUpperCase()}</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size={size}
        title="Confirm action"
        description="This will permanently delete the item. This action cannot be undone."
        footer={
          <Row gap={2}>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => setOpen(false)}>Delete</Button>
          </Row>
        }
      >
        <Typography variant="body2" color="muted">
          Are you sure? All associated data will be removed from our servers within 24 hours.
        </Typography>
      </Modal>
    </>
  );
}

function ChipToggleExample() {
  const tags = ['Design', 'Engineering', 'Product', 'Marketing', 'Operations'];
  const [selected, setSelected] = useState<Set<string>>(new Set(['Design', 'Engineering']));
  const toggle = (t: string) => setSelected(prev => {
    const next = new Set(prev);
    next.has(t) ? next.delete(t) : next.add(t);
    return next;
  });
  return (
    <Row gap={2} wrap>
      {tags.map(t => (
        <Chip key={t} selected={selected.has(t)} onClick={() => toggle(t)} tone="accent">{t}</Chip>
      ))}
    </Row>
  );
}

function ChipRemoveExample() {
  const initial = ['React', 'TypeScript', 'CSS Modules', 'Vite', 'Accessibility'];
  const [chips, setChips] = useState(initial);
  return (
    <Row gap={2} wrap>
      {chips.map(c => (
        <Chip key={c} onRemove={() => setChips(prev => prev.filter(x => x !== c))}>{c}</Chip>
      ))}
      {chips.length === 0 && (
        <Button variant="ghost" size="sm" onClick={() => setChips(initial)}>Reset</Button>
      )}
    </Row>
  );
}

function CheckboxPermissionsExample() {
  const [perms, setPerms] = useState({ read: true, write: false, admin: false });
  const toggle = (k: keyof typeof perms) => setPerms(p => ({ ...p, [k]: !p[k] }));
  const allChecked = Object.values(perms).every(Boolean);
  const someChecked = Object.values(perms).some(Boolean) && !allChecked;
  const toggleAll = () => { const next = !allChecked; setPerms({ read: next, write: next, admin: next }); };
  return (
    <Col gap={3}>
      <Checkbox label="All permissions" checked={allChecked} indeterminate={someChecked} onChange={toggleAll} />
      <div style={{ paddingLeft: 'var(--space-5)', borderLeft: '2px solid var(--color-border)' }}>
        <Col gap={3}>
          <Checkbox label="Read" checked={perms.read} onChange={() => toggle('read')} />
          <Checkbox label="Write" checked={perms.write} onChange={() => toggle('write')} />
          <Checkbox label="Admin" checked={perms.admin} onChange={() => toggle('admin')} />
        </Col>
      </div>
    </Col>
  );
}

function NotificationsExample() {
  const [state, setState] = useState({ email: true, push: false, marketing: false, security: true });
  const toggle = (k: keyof typeof state) => setState(p => ({ ...p, [k]: !p[k] }));
  const labels: Record<keyof typeof state, { title: string; desc: string }> = {
    email: { title: 'Email notifications', desc: 'Receive updates by email' },
    push: { title: 'Push notifications', desc: 'Browser and mobile alerts' },
    marketing: { title: 'Marketing emails', desc: 'Product news and offers' },
    security: { title: 'Security alerts', desc: 'Login attempts and changes' },
  };
  return (
    <Col gap={4}>
      {(Object.keys(state) as (keyof typeof state)[]).map((k) => (
        <Row key={k} justify="space-between" align="center">
          <Col gap={1}>
            <Typography variant="label" as="span">{labels[k].title}</Typography>
            <Typography variant="caption" color="muted" as="span">{labels[k].desc}</Typography>
          </Col>
          <Switch checked={state[k]} onChange={() => toggle(k)} />
        </Row>
      ))}
    </Col>
  );
}

function TeamListExample() {
  const team = [
    { name: 'Maya Lin', role: 'Owner', status: 'online' as const, tone: 'success' as const },
    { name: 'Alex Ray', role: 'Admin', status: 'busy' as const, tone: 'neutral' as const },
    { name: 'Sam Torres', role: 'Editor', status: 'away' as const, tone: 'neutral' as const },
    { name: 'Jamie Kim', role: 'Viewer', status: 'offline' as const, tone: 'neutral' as const },
  ];
  return (
    <Col gap={3}>
      {team.map(m => (
        <Row key={m.name} align="center" gap={3} justify="space-between">
          <Row align="center" gap={3}>
            <Avatar name={m.name} size="md" status={m.status} />
            <Col gap={1}>
              <Typography variant="label" as="span">{m.name}</Typography>
              <Typography variant="caption" color="muted" as="span">{m.role}</Typography>
            </Col>
          </Row>
          <Badge tone={m.tone}>{m.status}</Badge>
        </Row>
      ))}
    </Col>
  );
}

function TabsExample() {
  const [tab, setTab] = useState('preview');
  return (
    <Tabs value={tab} onChange={setTab}>
      <TabList>
        <Tab value="preview">Preview</Tab>
        <Tab value="code">Code</Tab>
        <Tab value="props">Props</Tab>
        <Tab value="disabled" disabled>Disabled</Tab>
      </TabList>
      <TabPanel value="preview">
        <Typography variant="body2" color="muted">This is the preview panel.</Typography>
      </TabPanel>
      <TabPanel value="code">
        <Textarea variant="code" value={`<Button variant="primary">\n  Save changes\n</Button>`} />
      </TabPanel>
      <TabPanel value="props">
        <Typography variant="body2" color="muted">Props documentation would live here.</Typography>
      </TabPanel>
    </Tabs>
  );
}

function SettingsTabsExample() {
  const [tab, setTab] = useState('profile');
  return (
    <Tabs value={tab} onChange={setTab}>
      <TabList>
        <Tab value="profile">Profile</Tab>
        <Tab value="security">Security</Tab>
        <Tab value="billing">Billing</Tab>
      </TabList>
      <TabPanel value="profile">
        <Col gap={4} style={{ maxWidth: 360 }}>
          <Input label="Display name" defaultValue="Maya Lin" />
          <Input label="Email" type="email" defaultValue="maya@example.com" />
          <Row justify="flex-end"><Button size="sm">Save profile</Button></Row>
        </Col>
      </TabPanel>
      <TabPanel value="security">
        <Col gap={4} style={{ maxWidth: 360 }}>
          <Input label="Current password" type="password" />
          <Input label="New password" type="password" />
          <Row justify="flex-end"><Button size="sm" variant="danger">Change password</Button></Row>
        </Col>
      </TabPanel>
      <TabPanel value="billing">
        <Typography variant="body2" color="muted">
          You are on the <Badge tone="accent">Pro</Badge> plan. Next billing: July 1, 2026.
        </Typography>
      </TabPanel>
    </Tabs>
  );
}

function RadioGroupExample() {
  const [plan, setPlan] = useState('pro');
  return (
    <RadioGroup label="Billing plan" value={plan} onChange={setPlan}>
      <Radio value="free" label="Free — up to 3 projects" />
      <Radio value="pro" label="Pro — unlimited projects" />
      <Radio value="team" label="Team — collaboration tools" />
    </RadioGroup>
  );
}

function RadioHorizontalExample() {
  const [size, setSize] = useState('md');
  return (
    <RadioGroup label="Size" value={size} onChange={setSize} orientation="horizontal">
      <Radio value="sm" label="SM" />
      <Radio value="md" label="MD" />
      <Radio value="lg" label="LG" />
    </RadioGroup>
  );
}

function FormFieldExample() {
  return (
    <Col gap={4} style={{ maxWidth: 400 }}>
      <FormField label="Username" helperText="Only letters, numbers, and underscores." required>
        <input
          type="text"
          placeholder="e.g. maya_lin"
          style={{
            width: '100%',
            height: 'var(--control-height-md)',
            padding: '0 var(--space-3)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-bg)',
            color: 'var(--color-fg)',
            fontFamily: 'inherit',
            fontSize: 'var(--text-sm)',
            boxSizing: 'border-box',
          }}
        />
      </FormField>
    </Col>
  );
}

function DrawerExample() {
  const [side, setSide] = useState<'left' | 'right'>('right');
  const [open, setOpen] = useState(false);
  return (
    <Row gap={3} wrap>
      {(['left', 'right'] as const).map(s => (
        <Button
          key={s}
          variant="secondary"
          onClick={() => { setSide(s); setOpen(true); }}
        >
          Open {s}
        </Button>
      ))}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side={side}
        size="md"
        title="Edit profile"
        description="Update your public information."
        footer={
          <Row gap={2}>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Save changes</Button>
          </Row>
        }
      >
        <Col gap={4}>
          <Input label="Name" defaultValue="Maya Lin" />
          <Input label="Email" type="email" defaultValue="maya@example.com" />
          <Textarea label="Bio" placeholder="Tell us about yourself…" rows={4} />
        </Col>
      </Drawer>
    </Row>
  );
}

function MenuExample() {
  const items: MenuItem[] = [
    { label: 'Edit', icon: <EditIcon />, onClick: () => { } },
    { label: 'Duplicate', onClick: () => { } },
    { label: 'Archive', onClick: () => { } },
    { type: 'separator' },
    { label: 'Delete', danger: true, onClick: () => { } },
  ];
  return (
    <Row gap={3}>
      <Menu trigger={<Button variant="secondary">Actions</Button>} items={items} />
      <Menu trigger={<Button variant="ghost" size="sm">More ▾</Button>} items={items} placement="bottom-end" />
    </Row>
  );
}

function MenuWithLabelsExample() {
  const items: MenuItem[] = [
    { type: 'label', label: 'Text' },
    { label: 'Bold', shortcut: '⌘B', onClick: () => { } },
    { label: 'Italic', shortcut: '⌘I', onClick: () => { } },
    { label: 'Underline', shortcut: '⌘U', onClick: () => { } },
    { type: 'separator' },
    { type: 'label', label: 'Insert' },
    { label: 'Image', onClick: () => { } },
    { label: 'Table', onClick: () => { } },
    { label: 'Code block', onClick: () => { } },
  ];
  return (
    <Menu trigger={<Button variant="ghost" size="sm">Format ▾</Button>} items={items} />
  );
}

function ContextMenuExample() {
  const items: MenuItem[] = [
    { label: 'Open', onClick: () => { } },
    { label: 'Open in tab', onClick: () => { } },
    { type: 'separator' },
    { label: 'Copy link', onClick: () => { } },
    { label: 'Copy path', onClick: () => { } },
    { type: 'separator' },
    { label: 'Rename', onClick: () => { } },
    { label: 'Delete', danger: true, onClick: () => { } },
  ];
  return (
    <ContextMenu
      trigger={
        <div style={{
          padding: 'var(--space-6)',
          border: '2px dashed var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          color: 'var(--color-fg-muted)',
          fontSize: 'var(--text-sm)',
          userSelect: 'none',
          cursor: 'context-menu',
        }}>
          Right-click anywhere in this area
        </div>
      }
      items={items}
    />
  );
}

function ToastExample() {
  const { toast } = useToast();
  return (
    <Row gap={2} wrap>
      <Button variant="secondary" size="sm" onClick={() => toast({ title: 'Changes saved', tone: 'success' })}>
        Success
      </Button>
      <Button variant="secondary" size="sm" onClick={() => toast({ title: 'Update available', description: 'Refresh to see changes.', tone: 'info' })}>
        Info
      </Button>
      <Button variant="secondary" size="sm" onClick={() => toast({ title: 'Storage almost full', description: '90% of quota used.', tone: 'warning' })}>
        Warning
      </Button>
      <Button variant="secondary" size="sm" onClick={() => toast({ title: 'Upload failed', description: 'Check your connection and try again.', tone: 'danger' })}>
        Error
      </Button>
      <Button variant="ghost" size="sm" onClick={() => toast({ title: 'Background sync running…', duration: 0 })}>
        Persistent
      </Button>
    </Row>
  );
}

function AlertExample() {
  const [visible, setVisible] = useState(true);
  return (
    <Col gap={3}>
      {visible ? (
        <Alert tone="warning" title="Action required" onClose={() => setVisible(false)}>
          Please verify your email address within 24 hours to avoid losing access.
        </Alert>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => setVisible(true)}>Show alert</Button>
      )}
    </Col>
  );
}

function SkeletonCardExample() {
  return (
    <Card style={{ maxWidth: 320 }}>
      <Skeleton variant="rect" height={160} />
      <CardBody>
        <Col gap={3}>
          <Row gap={3} align="center">
            <Skeleton variant="circle" width={40} height={40} />
            <Col gap={1} style={{ flex: 1 }}>
              <Skeleton variant="text" lines={1} />
              <Skeleton variant="rect" height={10} />
            </Col>
          </Row>
          <Skeleton variant="text" lines={3} />
        </Col>
      </CardBody>
    </Card>
  );
}

function TablePrimitivesExample() {
  const rows = [
    { name: 'Maya Lin', role: 'Owner', status: 'Active' as const },
    { name: 'Alex Ray', role: 'Admin', status: 'Active' as const },
    { name: 'Sam Torres', role: 'Editor', status: 'Inactive' as const },
  ];
  return (
    <Table>
      <TableHead>
        <TableRow>
          <Th>Name</Th>
          <Th>Role</Th>
          <Th>Status</Th>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(r => (
          <TableRow key={r.name}>
            <Td>{r.name}</Td>
            <Td>{r.role}</Td>
            <Td><Badge tone={r.status === 'Active' ? 'success' : 'neutral'}>{r.status}</Badge></Td>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function DataTableExample() {
  const data: Record<string, unknown>[] = [
    { id: '1', name: 'Maya Lin', role: 'Owner', status: 'Active', joined: 'Jan 2024' },
    { id: '2', name: 'Alex Ray', role: 'Admin', status: 'Active', joined: 'Mar 2024' },
    { id: '3', name: 'Sam Torres', role: 'Editor', status: 'Inactive', joined: 'Jun 2024' },
    { id: '4', name: 'Jamie Kim', role: 'Viewer', status: 'Active', joined: 'Aug 2024' },
  ];

  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string, dir: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDir(dir);
  };

  const sorted = [...data].sort((a, b) => {
    const av = String(a[sortKey] ?? '');
    const bv = String(b[sortKey] ?? '');
    return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  return (
    <DataTable
      columns={[
        { key: 'name', header: 'Name', cell: row => row.name as string, sortable: true },
        { key: 'role', header: 'Role', cell: row => row.role as string },
        {
          key: 'status', header: 'Status', cell: row => (
            <Badge tone={(row.status as string) === 'Active' ? 'success' : 'neutral'}>
              {row.status as string}
            </Badge>
          )
        },
        { key: 'joined', header: 'Joined', cell: row => row.joined as string, sortable: true },
      ]}
      data={sorted}
      rowKey={row => row.id as string}
      selectable
      sortKey={sortKey}
      sortDir={sortDir}
      onSort={handleSort}
    />
  );
}

function LiquidGlassExample() {
  return (
    <div
      style={{
        position: 'relative',
        height: 320,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 40%, #a78bfa 70%, #f472b6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Blob 1 — warm orange, top-left */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -40, left: -20,
          width: 180, height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251,146,60,0.85) 0%, rgba(251,146,60,0) 70%)',
        }}
      />
      {/* Blob 2 — violet, bottom-right */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: -30, right: -10,
          width: 200, height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.90) 0%, rgba(139,92,246,0) 70%)',
        }}
      />
      {/* Blob 3 — cyan, bottom-left */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 10, left: 20,
          width: 140, height: 140,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.80) 0%, rgba(34,211,238,0) 70%)',
        }}
      />
      {/* Blob 4 — hot pink, top-right */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 10, right: 30,
          width: 120, height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.75) 0%, rgba(236,72,153,0) 70%)',
        }}
      />

      <LiquidGlass
        style={{
          padding: 'var(--space-6)',
          maxWidth: 300,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h4"
          style={{ marginBottom: 'var(--space-2)', color: 'rgba(0,0,0,0.80)' }}
        >
          Liquid Glass
        </Typography>
        <Typography
          variant="body2"
          style={{ marginBottom: 'var(--space-4)', color: 'rgba(0,0,0,0.55)' }}
        >
          Background bleeds through the frosted surface.
        </Typography>
        <Button size="sm">Get started</Button>
      </LiquidGlass>
    </div>
  );
}

function PaginationExample() {
  const [page, setPage] = useState(1);
  return (
    <Col gap={3} align="center">
      <Pagination page={page} pageCount={12} onChange={setPage} />
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)' }}>
        Page {page} of 12
      </span>
    </Col>
  );
}
