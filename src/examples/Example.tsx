import { type ReactNode, useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card, CardBody, CardFooter, CardHeader,
  Checkbox,
  Chip,
  Col,
  Container,
  Divider,
  Input,
  Modal,
  Row,
  Select,
  Switch,
  Tab, TabList, TabPanel, Tabs,
  Tooltip,
} from '../index';
import { Customizer } from './Customizer';

// ─── Syntax highlight ─────────────────────────────────────────────────────────

// Groups: 1=lineComment 2=blockComment 3=string 4=tag 5=keyword 6=number
const TOKEN_RE = /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|(\"(?:[^\"\\]|\\.)*\"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\/?>|<\/?[A-Za-z][A-Za-z0-9]*(?:\.[A-Za-z][A-Za-z0-9]*)*)|\b(const|let|var|function|return|import|export|default|from|if|else|true|false|null|undefined|new|type|interface|async|await|of|for|while|class|extends)\b|(\b\d+(?:\.\d+)?\b)/g;

function highlight(code: string) {
  const out: JSX.Element[] = [];
  let last = 0;
  TOKEN_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  const push = (color: string | null, text: string) => {
    out.push(color
      ? <span key={key++} style={{ color }}>{text}</span>
      : <span key={key++}>{text}</span>
    );
  };
  while ((m = TOKEN_RE.exec(code)) !== null) {
    if (m.index > last) push(null, code.slice(last, m.index));
    const [full, lc, bc, str, tag, kw, num] = m;
    if (lc || bc)  push('#6b7c85', full);
    else if (str)  push('#d97706', full);
    else if (tag)  push('#3b82f6', full);
    else if (kw)   push('#8b5cf6', full);
    else if (num)  push('#059669', full);
    last = m.index + full.length;
  }
  if (last < code.length) push(null, code.slice(last));
  return out;
}

// ─── PreviewCode ──────────────────────────────────────────────────────────────

function PreviewCode({ preview, code }: { preview: ReactNode; code: string }) {
  const [active, setActive] = useState<'preview' | 'code'>('preview');
  const isPreview = active === 'preview';
  const tab: React.CSSProperties = {
    padding: 'var(--space-2) var(--space-4)',
    fontSize: 'var(--text-xs)',
    fontWeight: 'var(--weight-medium)',
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    color: 'var(--color-fg-muted)',
    borderBottom: '2px solid transparent',
    transition: 'color 120ms, border-color 120ms',
  };
  const activeTab: React.CSSProperties = {
    ...tab,
    color: 'var(--color-fg)',
    borderBottomColor: 'var(--color-accent)',
  };
  return (
    <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-subtle)', paddingLeft: 'var(--space-2)' }}>
        <button style={isPreview ? activeTab : tab} onClick={() => setActive('preview')}>Preview</button>
        <button style={!isPreview ? activeTab : tab} onClick={() => setActive('code')}>Code</button>
      </div>
      {isPreview ? (
        <div style={{ padding: 'var(--space-5)', background: 'var(--color-bg)' }}>{preview}</div>
      ) : (
        <pre style={{
          margin: 0,
          padding: 'var(--space-5)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          lineHeight: 'var(--leading-loose)',
          color: 'var(--color-fg)',
          background: 'var(--color-bg-muted)',
          overflowX: 'auto',
          whiteSpace: 'pre',
        }}>{highlight(code.trim())}</pre>
      )}
    </div>
  );
}

// ─── Layout helpers ──────────────────────────────────────────────────────────

const NAV_ITEMS = [
  'Button', 'Input', 'Select', 'Checkbox', 'Switch',
  'Card', 'Modal', 'Badge', 'Chip', 'Avatar',
  'Tabs', 'Tooltip', 'Divider', 'Container', 'Row & Col',
];

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} style={{ scrollMarginTop: '64px' }}>
      <h2 style={{ margin: '0 0 var(--space-5)', fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-fg)' }}>
        {title}
      </h2>
      <Col gap={6}>{children}</Col>
    </section>
  );
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </p>
      {children}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function Example() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.dataset.theme = next ? 'dark' : '';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', position: 'relative' }}>
      {/* ── Header ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        height: 56,
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-bg)',
        display: 'flex', alignItems: 'center',
        padding: '0 var(--space-5)',
        gap: 'var(--space-4)',
      }}>
        <span style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-base)', color: 'var(--color-fg)' }}>
          Design System
        </span>
        <Badge tone="accent" variant="soft">v0.1</Badge>
        <span style={{ flex: 1 }} />
        <Button variant="ghost" size="sm" onClick={toggleDark} aria-label="Toggle dark mode">
          {darkMode ? 'Light mode' : 'Dark mode'}
        </Button>
      </header>

      <div style={{ display: 'flex', maxWidth: 1100, margin: '0 auto' }}>
        {/* ── Sidebar ── */}
        <nav style={{
          width: 180, flexShrink: 0,
          padding: 'var(--space-6) var(--space-4)',
          position: 'sticky', top: 56,
          height: 'calc(100vh - 56px)', overflowY: 'auto',
          borderRight: '1px solid var(--color-border)',
        }}>
          <Col gap={1}>
            {NAV_ITEMS.map((name) => {
              const id = name.toLowerCase().replace(/\s+/g, '-').replace('&', '').replace('--', '-');
              return (
                <a key={name} href={`#${id}`} style={{ display: 'block', padding: 'var(--space-2) var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)', borderRadius: 'var(--radius-md)', textDecoration: 'none', transition: 'background-color 120ms, color 120ms' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-bg-muted)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-fg)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; (e.currentTarget as HTMLElement).style.color = ''; }}
                >
                  {name}
                </a>
              );
            })}
          </Col>
        </nav>

        {/* ── Content ── */}
        <main style={{ flex: 1, padding: 'var(--space-7) var(--space-6)', minWidth: 0 }}>
          <Col gap={8}>

            {/* ── BUTTON ── */}
            <Section id="button" title="Button">
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
                          { value: 'admin',  label: 'Admin' },
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
              <Block label="Elevations">
                <PreviewCode
                  preview={
                    <Row gap={4} wrap align="stretch">
                      {(['flat', 'raised', 'floating'] as const).map(e => (
                        <Card key={e} elevation={e} style={{ flex: '1 1 160px' }}>
                          <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>{e.charAt(0).toUpperCase() + e.slice(1)}</p>
                          <p style={{ margin: 'var(--space-1) 0 0', fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)' }}>elevation="{e}"</p>
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
                      <CardHeader><strong>Account settings</strong></CardHeader>
                      <CardBody>
                        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)' }}>Update your email and notification preferences.</p>
                      </CardBody>
                      <CardFooter>
                        <Button variant="ghost" size="sm">Cancel</Button>
                        <Button size="sm">Save</Button>
                      </CardFooter>
                    </Card>
                  }
                  code={`// CardHeader / CardBody / CardFooter auto-remove Card's
// own padding so each section owns its own spacing.
<Card>
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
                      <p style={{ margin: 0, fontWeight: 'var(--weight-medium)' }}>Clickable card</p>
                      <p style={{ margin: 'var(--space-1) 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)' }}>Hover to see the lift effect.</p>
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
              <Block label="Variants × tones">
                <PreviewCode
                  preview={
                    <Col gap={4}>
                      {(['soft', 'solid', 'outline'] as const).map(v => (
                        <Row key={v} gap={2} wrap align="center">
                          <span style={{ width: 52, fontSize: 'var(--text-xs)', color: 'var(--color-fg-subtle)' }}>{v}</span>
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
              <Block label="Image with fallback">
                <PreviewCode
                  preview={
                    <Row gap={4} align="center">
                      <Avatar src="https://i.pravatar.cc/80?img=1" name="User A" size="md" />
                      <Avatar src="https://i.pravatar.cc/80?img=2" name="User B" size="lg" />
                      <Avatar src="broken-url.jpg" name="Fallback" size="md" />
                    </Row>
                  }
                  code={`// Falls back to initials if src is absent or fails to load
<Avatar src="https://example.com/photo.jpg" name="Maya Lin" size="md" />
<Avatar src="broken-url.jpg" name="Fallback" size="md" />`}
                />
              </Block>
              <Block label="Status dots">
                <PreviewCode
                  preview={
                    <Row gap={4} align="center">
                      {(['online', 'busy', 'away', 'offline'] as const).map(s => (
                        <Col key={s} gap={1} align="center">
                          <Avatar name="User" size="lg" status={s} />
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)' }}>{s}</span>
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
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)' }}>Item A</span>
                      <Divider orientation="vertical" />
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)' }}>Item B</span>
                      <Divider orientation="vertical" />
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)' }}>Item C</span>
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
              <Block label="Max-width presets">
                <PreviewCode
                  preview={
                    <Col gap={3}>
                      {(['sm', 'md', 'lg', 'xl'] as const).map(s => (
                        <Container key={s} maxWidth={s} center style={{ background: 'var(--color-bg-muted)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', border: '1px dashed var(--color-border)' }}>
                          <Row justify="space-between" align="center">
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)' }}>maxWidth="{s}"</span>
                            <Badge variant="outline" tone="neutral">{s === 'sm' ? '640px' : s === 'md' ? '768px' : s === 'lg' ? '1024px' : '1280px'}</Badge>
                          </Row>
                        </Container>
                      ))}
                    </Col>
                  }
                  code={`// maxWidth: 'sm' (640) | 'md' (768) | 'lg' (1024) | 'xl' (1280) | 'full'
// center: true by default (auto left/right margins)
// padding: space token 1–8, defaults to 4 (1rem)

<Container maxWidth="lg">
  <Row gap={4}>
    <Col gap={3}>Left column</Col>
    <Col gap={3}>Right column</Col>
  </Row>
</Container>

// Full width, custom padding
<Container maxWidth="full" padding={6}>
  <p>Edge-to-edge with 2rem sides</p>
</Container>`}
                />
              </Block>
            </Section>

            <Divider />

            {/* ── ROW & COL ── */}
            <Section id="row-col" title="Row & Col">
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
                          <span style={{ fontSize: 'var(--text-sm)', flex: 1 }}>{m.name}</span>
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
              <Block label="Col — gap, align">
                <PreviewCode
                  preview={
                    <Row gap={5} align="flex-start">
                      {[
                        { name: 'Team A', tone: 'success' as const, count: 3 },
                        { name: 'Team B', tone: 'accent' as const, count: 5 },
                        { name: 'Team C', tone: 'warning' as const, count: 2 },
                      ].map(t => (
                        <Col key={t.name} gap={3} align="center" style={{ flex: 1, background: 'var(--color-bg-muted)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                          <Avatar name={t.name} size="lg" />
                          <strong style={{ fontSize: 'var(--text-sm)' }}>{t.name}</strong>
                          <Badge tone={t.tone}>{t.count} members</Badge>
                        </Col>
                      ))}
                    </Row>
                  }
                  code={`<Row gap={5} align="flex-start">
  <Col gap={3} align="center" style={{ flex: 1 }}>
    <Avatar name="Team A" size="lg" />
    <strong>Team A</strong>
    <Badge tone="success">3 members</Badge>
  </Col>
  <Col gap={3} align="center" style={{ flex: 1 }}>
    <Avatar name="Team B" size="lg" />
    <strong>Team B</strong>
    <Badge tone="accent">5 members</Badge>
  </Col>
</Row>`}
                />
              </Block>
            </Section>

          </Col>
        </main>
      </div>
      <Customizer />
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Sub-examples ─────────────────────────────────────────────────────────────

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
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)' }}>
          Are you sure? All associated data will be removed from our servers within 24 hours.
        </p>
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
          <Checkbox label="Read"  checked={perms.read}  onChange={() => toggle('read')} />
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
    email:     { title: 'Email notifications', desc: 'Receive updates by email' },
    push:      { title: 'Push notifications',  desc: 'Browser and mobile alerts' },
    marketing: { title: 'Marketing emails',    desc: 'Product news and offers' },
    security:  { title: 'Security alerts',     desc: 'Login attempts and changes' },
  };
  return (
    <Col gap={4}>
      {(Object.keys(state) as (keyof typeof state)[]).map((k) => (
        <Row key={k} justify="space-between" align="center">
          <Col gap={1}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>{labels[k].title}</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)' }}>{labels[k].desc}</span>
          </Col>
          <Switch checked={state[k]} onChange={() => toggle(k)} />
        </Row>
      ))}
    </Col>
  );
}

function TeamListExample() {
  const team = [
    { name: 'Maya Lin',   role: 'Owner',  status: 'online'  as const, tone: 'success' as const },
    { name: 'Alex Ray',   role: 'Admin',  status: 'busy'    as const, tone: 'neutral' as const },
    { name: 'Sam Torres', role: 'Editor', status: 'away'    as const, tone: 'neutral' as const },
    { name: 'Jamie Kim',  role: 'Viewer', status: 'offline' as const, tone: 'neutral' as const },
  ];
  return (
    <Col gap={3}>
      {team.map(m => (
        <Row key={m.name} align="center" gap={3} justify="space-between">
          <Row align="center" gap={3}>
            <Avatar name={m.name} size="md" status={m.status} />
            <Col gap={1}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>{m.name}</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)' }}>{m.role}</span>
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
        <p style={{ margin: 0, color: 'var(--color-fg-muted)' }}>This is the preview panel.</p>
      </TabPanel>
      <TabPanel value="code">
        <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', background: 'var(--color-bg-muted)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
{`<Button variant="primary">
  Save changes
</Button>`}
        </pre>
      </TabPanel>
      <TabPanel value="props">
        <p style={{ margin: 0, color: 'var(--color-fg-muted)' }}>Props documentation would live here.</p>
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
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)' }}>
          You are on the <Badge tone="accent">Pro</Badge> plan. Next billing: July 1, 2026.
        </p>
      </TabPanel>
    </Tabs>
  );
}
