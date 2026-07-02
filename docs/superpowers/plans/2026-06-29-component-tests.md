# Component Tests Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full Vitest + React Testing Library test suite covering all seven design-system components (Button, Input, Card, Badge, Avatar, Switch, Modal).

**Architecture:** Tests are co-located with their components under `src/components/`. A shared setup file in `src/test/setup.ts` extends Vitest's `expect` with jest-dom matchers and patches `HTMLDialogElement` methods that jsdom does not implement. A `vitest.config.ts` at the project root wires everything together.

**Tech Stack:** Vitest 2, @testing-library/react 16, @testing-library/user-event 14, @testing-library/jest-dom 6, jsdom 25, @vitejs/plugin-react (already installed)

## Global Constraints

- React 18 only — do not use React 19 APIs
- All test files must live inside `src/` (enforced by `rootDir: "src"` in tsconfig)
- CSS modules are disabled in tests (`css: false`) — never assert on CSS class names, only on `data-*` attributes and semantic roles
- Use `globals: true` in vitest config — test files must NOT import `describe`, `it`, `expect`, or `vi` from vitest
- The `vi` global is available without import when `globals: true` is set
- Run tests with: `npm test`

---

### Task 1: Install dependencies and configure Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Modify: `package.json`
- Modify: `tsconfig.json`

**Interfaces:**
- Produces: `npm test` command that runs vitest in run mode; `npm run test:watch` for watch mode

- [ ] **Step 1: Install dev dependencies**

```bash
npm install --save-dev vitest@^2.0.0 @testing-library/react@^16.0.0 @testing-library/user-event@^14.0.0 @testing-library/jest-dom@^6.0.0 jsdom@^25.0.0
```

Expected: packages added to `node_modules`, `package.json` devDependencies updated.

- [ ] **Step 2: Create vitest.config.ts**

Create `vitest.config.ts` at the project root:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
});
```

- [ ] **Step 3: Create src/test/setup.ts**

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom';

// jsdom does not implement HTMLDialogElement.showModal() or .close().
// These stubs let Modal's useEffect run without throwing.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };
}
if (!HTMLDialogElement.prototype.close) {
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
}
```

- [ ] **Step 4: Add test scripts to package.json**

In `package.json`, add to the `"scripts"` object:

```json
"test": "vitest run",
"test:watch": "vitest"
```

The scripts object becomes:

```json
"scripts": {
  "dev": "vite",
  "build": "tsup",
  "build:watch": "tsup --watch",
  "build:docs": "vite build",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 5: Update tsconfig.json types**

In `tsconfig.json`, update the `"types"` array inside `compilerOptions` to include the Vitest globals and jest-dom type declarations:

```json
"types": ["react", "react-dom", "vite/client", "vitest/globals", "@testing-library/jest-dom"]
```

- [ ] **Step 6: Verify the toolchain works with no tests**

```bash
npm test
```

Expected output contains:
```
No test files found, exiting with code 0
```
or similar zero-test pass. No errors.

- [ ] **Step 7: Commit**

```bash
git add vitest.config.ts src/test/setup.ts package.json package-lock.json tsconfig.json
git commit -m "chore: add Vitest + Testing Library test infrastructure"
```

---

### Task 2: Button tests

**Files:**
- Create: `src/components/Button/Button.test.tsx`

**Interfaces:**
- Consumes: `Button`, `ButtonProps`, `ButtonVariant`, `ButtonSize` from `./Button`

- [ ] **Step 1: Create Button.test.tsx**

Create `src/components/Button/Button.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('has default data-variant="primary" and data-size="md"', () => {
    render(<Button>x</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('data-variant', 'primary');
    expect(btn).toHaveAttribute('data-size', 'md');
  });

  it.each(['primary', 'secondary', 'ghost', 'danger'] as const)(
    'sets data-variant="%s"',
    (variant) => {
      render(<Button variant={variant}>x</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('data-variant', variant);
    },
  );

  it.each(['sm', 'md', 'lg'] as const)('sets data-size="%s"', (size) => {
    render(<Button size={size}>x</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-size', size);
  });

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>x</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows spinner, disables button, and sets data-loading when loading', () => {
    render(<Button loading>Save</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('data-loading');
    // spinner has aria-hidden="true"
    expect(btn.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('hides leading and trailing icons when loading', () => {
    render(
      <Button
        loading
        leading={<span data-testid="leading" />}
        trailing={<span data-testid="trailing" />}
      >
        x
      </Button>,
    );
    expect(screen.queryByTestId('leading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('trailing')).not.toBeInTheDocument();
  });

  it('renders leading icon when not loading', () => {
    render(<Button leading={<span data-testid="leading" />}>x</Button>);
    expect(screen.getByTestId('leading')).toBeInTheDocument();
  });

  it('renders trailing icon when not loading', () => {
    render(<Button trailing={<span data-testid="trailing" />}>x</Button>);
    expect(screen.getByTestId('trailing')).toBeInTheDocument();
  });

  it('sets data-icon-only when iconOnly prop is set', () => {
    render(<Button iconOnly aria-label="close" />);
    expect(screen.getByRole('button')).toHaveAttribute('data-icon-only');
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>x</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>x</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards ref to the button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>x</Button>);
    expect(ref.current?.tagName).toBe('BUTTON');
  });

  it('applies custom className alongside module class', () => {
    render(<Button className="custom">x</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom');
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npm test
```

Expected: all Button tests pass. Example output:
```
✓ src/components/Button/Button.test.tsx (14)
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Button/Button.test.tsx
git commit -m "test: add Button component tests"
```

---

### Task 3: Input tests

**Files:**
- Create: `src/components/Input/Input.test.tsx`

**Interfaces:**
- Consumes: `Input` from `./Input`

- [ ] **Step 1: Create Input.test.tsx**

Create `src/components/Input/Input.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Input } from './Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders a label connected to the input', () => {
    render(<Input label="Email" />);
    // getByLabelText finds the input via the label's htmlFor
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders required asterisk and sets required on input when required prop set', () => {
    render(<Input label="Email" required />);
    expect(screen.getByRole('textbox')).toBeRequired();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders helperText', () => {
    render(<Input helperText="Enter your email address" />);
    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
  });

  it('links input to helper via aria-describedby when helperText provided', () => {
    render(<Input helperText="hint" />);
    const helper = screen.getByText('hint');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', helper.id);
  });

  it('sets aria-invalid when error is boolean true', () => {
    render(<Input error />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets data-error on the field wrapper when error is boolean true', () => {
    const { container } = render(<Input error />);
    const field = container.querySelector('[data-error]');
    expect(field).toBeInTheDocument();
  });

  it('shows error string in place of helperText when error is a string', () => {
    render(<Input helperText="hint" error="This field is required" />);
    expect(screen.queryByText('hint')).not.toBeInTheDocument();
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('sets aria-invalid when error is a string', () => {
    render(<Input error="Bad value" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when no error', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });

  it('renders leadingIcon', () => {
    render(<Input leadingIcon={<span data-testid="lead" />} />);
    expect(screen.getByTestId('lead')).toBeInTheDocument();
  });

  it('renders trailingIcon', () => {
    render(<Input trailingIcon={<span data-testid="trail" />} />);
    expect(screen.getByTestId('trail')).toBeInTheDocument();
  });

  it('disables the input when disabled prop set', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('sets data-disabled on field wrapper when disabled', () => {
    const { container } = render(<Input disabled />);
    expect(container.querySelector('[data-disabled]')).toBeInTheDocument();
  });

  it('uses explicit id for label/input association', () => {
    render(<Input id="my-email" label="Email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'my-email');
    expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'my-email');
  });

  it('auto-generates id linking label and input when no id provided', () => {
    render(<Input label="Name" />);
    const input = screen.getByRole('textbox');
    const inputId = input.getAttribute('id');
    expect(inputId).toBeTruthy();
    expect(screen.getByLabelText('Name')).toHaveAttribute('id', inputId);
  });

  it('forwards ref to the input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current?.tagName).toBe('INPUT');
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npm test
```

Expected: all Button and Input tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/Input/Input.test.tsx
git commit -m "test: add Input component tests"
```

---

### Task 4: Card tests

**Files:**
- Create: `src/components/Card/Card.test.tsx`

**Interfaces:**
- Consumes: `Card`, `CardHeader`, `CardBody`, `CardFooter` from `./Card`

- [ ] **Step 1: Create Card.test.tsx**

Create `src/components/Card/Card.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Card, CardBody, CardFooter, CardHeader } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Content</Card>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('has default data-elevation="raised"', () => {
    const { container } = render(<Card>x</Card>);
    expect(container.firstChild).toHaveAttribute('data-elevation', 'raised');
  });

  it.each(['flat', 'raised', 'floating'] as const)(
    'sets data-elevation="%s"',
    (elevation) => {
      const { container } = render(<Card elevation={elevation}>x</Card>);
      expect(container.firstChild).toHaveAttribute('data-elevation', elevation);
    },
  );

  it('sets data-unpadded attribute when unpadded prop is set', () => {
    const { container } = render(<Card unpadded>x</Card>);
    expect(container.firstChild).toHaveAttribute('data-unpadded');
  });

  it('does not set data-unpadded by default', () => {
    const { container } = render(<Card>x</Card>);
    expect(container.firstChild).not.toHaveAttribute('data-unpadded');
  });

  it('sets data-interactive attribute when interactive prop is set', () => {
    const { container } = render(<Card interactive>x</Card>);
    expect(container.firstChild).toHaveAttribute('data-interactive');
  });

  it('does not set data-interactive by default', () => {
    const { container } = render(<Card>x</Card>);
    expect(container.firstChild).not.toHaveAttribute('data-interactive');
  });

  it('forwards ref to the div element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref}>x</Card>);
    expect(ref.current?.tagName).toBe('DIV');
  });
});

describe('CardHeader', () => {
  it('renders children', () => {
    render(<CardHeader>Header content</CardHeader>);
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<CardHeader ref={ref}>x</CardHeader>);
    expect(ref.current?.tagName).toBe('DIV');
  });
});

describe('CardBody', () => {
  it('renders children', () => {
    render(<CardBody>Body content</CardBody>);
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<CardBody ref={ref}>x</CardBody>);
    expect(ref.current?.tagName).toBe('DIV');
  });
});

describe('CardFooter', () => {
  it('renders children', () => {
    render(<CardFooter>Footer content</CardFooter>);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<CardFooter ref={ref}>x</CardFooter>);
    expect(ref.current?.tagName).toBe('DIV');
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npm test
```

Expected: all Button, Input, and Card tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/Card/Card.test.tsx
git commit -m "test: add Card component tests"
```

---

### Task 5: Badge tests

**Files:**
- Create: `src/components/Badge/Badge.test.tsx`

**Interfaces:**
- Consumes: `Badge` from `./Badge`

- [ ] **Step 1: Create Badge.test.tsx**

Create `src/components/Badge/Badge.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('has default data-tone="neutral", data-variant="soft", data-size="sm"', () => {
    render(<Badge>x</Badge>);
    const badge = screen.getByText('x');
    expect(badge).toHaveAttribute('data-tone', 'neutral');
    expect(badge).toHaveAttribute('data-variant', 'soft');
    expect(badge).toHaveAttribute('data-size', 'sm');
  });

  it.each(['neutral', 'accent', 'success', 'warning', 'danger'] as const)(
    'sets data-tone="%s"',
    (tone) => {
      render(<Badge tone={tone}>x</Badge>);
      expect(screen.getByText('x')).toHaveAttribute('data-tone', tone);
    },
  );

  it.each(['soft', 'solid', 'outline'] as const)(
    'sets data-variant="%s"',
    (variant) => {
      render(<Badge variant={variant}>x</Badge>);
      expect(screen.getByText('x')).toHaveAttribute('data-variant', variant);
    },
  );

  it.each(['sm', 'md'] as const)('sets data-size="%s"', (size) => {
    render(<Badge size={size}>x</Badge>);
    expect(screen.getByText('x')).toHaveAttribute('data-size', size);
  });

  it('applies custom className', () => {
    render(<Badge className="custom">x</Badge>);
    expect(screen.getByText('x')).toHaveClass('custom');
  });

  it('forwards ref to the span element', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Badge ref={ref}>x</Badge>);
    expect(ref.current?.tagName).toBe('SPAN');
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npm test
```

Expected: all previous tests plus Badge tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/Badge/Badge.test.tsx
git commit -m "test: add Badge component tests"
```

---

### Task 6: Avatar tests

**Files:**
- Create: `src/components/Avatar/Avatar.test.tsx`

**Interfaces:**
- Consumes: `Avatar` from `./Avatar`

- [ ] **Step 1: Create Avatar.test.tsx**

Create `src/components/Avatar/Avatar.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  describe('image', () => {
    it('renders an img with the provided src and name as alt', () => {
      render(<Avatar src="/photo.jpg" name="Jane Doe" />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', '/photo.jpg');
      expect(img).toHaveAttribute('alt', 'Jane Doe');
    });

    it('falls back to initials when image fails to load', () => {
      render(<Avatar src="/photo.jpg" name="Jane Doe" />);
      fireEvent.error(screen.getByRole('img'));
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('resets to showing the image when src changes after a load error', () => {
      const { rerender } = render(<Avatar src="/old.jpg" name="Jane" />);
      fireEvent.error(screen.getByRole('img'));
      expect(screen.queryByRole('img')).not.toBeInTheDocument();

      rerender(<Avatar src="/new.jpg" name="Jane" />);
      expect(screen.getByRole('img')).toHaveAttribute('src', '/new.jpg');
    });
  });

  describe('initials derivation', () => {
    it('derives 2-char uppercase initials from a single-word name', () => {
      render(<Avatar name="Jane" />);
      expect(screen.getByText('JA')).toBeInTheDocument();
    });

    it('derives first+last initials from a two-word name', () => {
      render(<Avatar name="Jane Doe" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('derives first+last initials from a three-word name', () => {
      render(<Avatar name="Jane Marie Doe" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('renders empty initials without crashing when name is empty', () => {
      const { container } = render(<Avatar name="" />);
      expect(container).toBeInTheDocument();
    });

    it('renders empty initials without crashing when name is omitted', () => {
      const { container } = render(<Avatar />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('status', () => {
    it('renders a status dot with the correct data-status attribute', () => {
      const { container } = render(<Avatar name="Jane" status="online" />);
      expect(container.querySelector('[data-status="online"]')).toBeInTheDocument();
    });

    it('renders status dot for every valid status value', () => {
      (['online', 'offline', 'busy', 'away'] as const).forEach((status) => {
        const { container } = render(<Avatar name="x" status={status} />);
        expect(container.querySelector(`[data-status="${status}"]`)).toBeInTheDocument();
      });
    });

    it('does not render a status dot when status prop is absent', () => {
      const { container } = render(<Avatar name="Jane" />);
      expect(container.querySelector('[data-status]')).not.toBeInTheDocument();
    });

    it('status dot has aria-hidden="true"', () => {
      const { container } = render(<Avatar name="Jane" status="busy" />);
      expect(container.querySelector('[data-status]')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('size', () => {
    it.each(['sm', 'md', 'lg', 'xl'] as const)('sets data-size="%s"', (size) => {
      const { container } = render(<Avatar size={size} />);
      expect(container.firstChild).toHaveAttribute('data-size', size);
    });
  });

  it('forwards ref to the outer span element', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Avatar ref={ref} name="Jane" />);
    expect(ref.current?.tagName).toBe('SPAN');
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npm test
```

Expected: all previous tests plus Avatar tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/Avatar/Avatar.test.tsx
git commit -m "test: add Avatar component tests"
```

---

### Task 7: Switch tests

**Files:**
- Create: `src/components/Switch/Switch.test.tsx`

**Interfaces:**
- Consumes: `Switch` from `./Switch`

- [ ] **Step 1: Create Switch.test.tsx**

Create `src/components/Switch/Switch.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders a checkbox input with role="switch"', () => {
    render(<Switch />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('renders label text', () => {
    render(<Switch label="Enable notifications" />);
    expect(screen.getByText('Enable notifications')).toBeInTheDocument();
  });

  it('associates label with input so getByRole finds it by name', () => {
    render(<Switch label="Dark mode" />);
    // The label wraps the input, so the accessible name comes from the label text
    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeInTheDocument();
  });

  it('defaults data-label-position to "end"', () => {
    const { container } = render(<Switch />);
    expect(container.firstChild).toHaveAttribute('data-label-position', 'end');
  });

  it('sets data-label-position="start" when labelPosition="start"', () => {
    const { container } = render(<Switch labelPosition="start" />);
    expect(container.firstChild).toHaveAttribute('data-label-position', 'start');
  });

  it('sets data-size from switchSize prop', () => {
    const { container } = render(<Switch switchSize="sm" />);
    expect(container.firstChild).toHaveAttribute('data-size', 'sm');
  });

  it('defaults data-size to "md"', () => {
    const { container } = render(<Switch />);
    expect(container.firstChild).toHaveAttribute('data-size', 'md');
  });

  it('disables the input when disabled prop is set', () => {
    render(<Switch disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('sets data-disabled on root label when disabled', () => {
    const { container } = render(<Switch disabled />);
    expect(container.firstChild).toHaveAttribute('data-disabled');
  });

  it('does not set data-disabled when not disabled', () => {
    const { container } = render(<Switch />);
    expect(container.firstChild).not.toHaveAttribute('data-disabled');
  });

  it('fires onChange when toggled', async () => {
    const onChange = vi.fn();
    render(<Switch onChange={onChange} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('does not fire onChange when disabled', async () => {
    const onChange = vi.fn();
    render(<Switch disabled onChange={onChange} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('respects defaultChecked', () => {
    render(<Switch defaultChecked />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('forwards ref to the input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Switch ref={ref} />);
    expect(ref.current?.tagName).toBe('INPUT');
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npm test
```

Expected: all previous tests plus Switch tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/Switch/Switch.test.tsx
git commit -m "test: add Switch component tests"
```

---

### Task 8: Modal tests

**Files:**
- Create: `src/components/Modal/Modal.test.tsx`

**Interfaces:**
- Consumes: `Modal` from `./Modal`
- Note: `HTMLDialogElement.prototype.showModal` and `.close` are patched in `src/test/setup.ts` to set/remove the `open` attribute and dispatch a `close` event. Spy on `HTMLDialogElement.prototype.showModal` and `.close` within tests that need to verify call counts; always call `mockRestore()` after.

- [ ] **Step 1: Create Modal.test.tsx**

Create `src/components/Modal/Modal.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { Modal } from './Modal';

describe('Modal', () => {
  describe('open/close lifecycle', () => {
    it('calls showModal when open=true on mount', () => {
      const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal');
      render(<Modal open onClose={() => {}} />);
      expect(showModal).toHaveBeenCalledTimes(1);
      showModal.mockRestore();
    });

    it('does not call showModal when open=false on mount', () => {
      const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal');
      render(<Modal open={false} onClose={() => {}} />);
      expect(showModal).not.toHaveBeenCalled();
      showModal.mockRestore();
    });

    it('calls close when open changes from true to false', () => {
      const close = vi.spyOn(HTMLDialogElement.prototype, 'close');
      const { rerender } = render(<Modal open onClose={() => {}} />);
      close.mockClear(); // clear any calls from setup
      rerender(<Modal open={false} onClose={() => {}} />);
      expect(close).toHaveBeenCalledTimes(1);
      close.mockRestore();
    });
  });

  describe('content slots', () => {
    it('renders title in an h2 element', () => {
      render(<Modal open onClose={() => {}} title="Confirm deletion" />);
      expect(screen.getByRole('heading', { name: 'Confirm deletion' })).toBeInTheDocument();
    });

    it('sets aria-labelledby pointing to the title element', () => {
      render(<Modal open onClose={() => {}} title="Confirm" />);
      const dialog = document.querySelector('dialog')!;
      const titleId = dialog.getAttribute('aria-labelledby')!;
      expect(titleId).toBeTruthy();
      expect(document.getElementById(titleId)).toHaveTextContent('Confirm');
    });

    it('renders description', () => {
      render(<Modal open onClose={() => {}} description="This cannot be undone." />);
      expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
    });

    it('sets aria-describedby pointing to the description element', () => {
      render(<Modal open onClose={() => {}} description="Are you sure?" />);
      const dialog = document.querySelector('dialog')!;
      const descId = dialog.getAttribute('aria-describedby')!;
      expect(descId).toBeTruthy();
      expect(document.getElementById(descId)).toHaveTextContent('Are you sure?');
    });

    it('does not set aria-labelledby when no title provided', () => {
      render(<Modal open onClose={() => {}} />);
      expect(document.querySelector('dialog')).not.toHaveAttribute('aria-labelledby');
    });

    it('does not set aria-describedby when no description provided', () => {
      render(<Modal open onClose={() => {}} />);
      expect(document.querySelector('dialog')).not.toHaveAttribute('aria-describedby');
    });

    it('renders footer slot', () => {
      render(
        <Modal open onClose={() => {}} footer={<button>Confirm</button>} />,
      );
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });

    it('renders children in the body', () => {
      render(<Modal open onClose={() => {}}>Body content</Modal>);
      expect(screen.getByText('Body content')).toBeInTheDocument();
    });
  });

  describe('close behaviour', () => {
    it('calls onClose when the native close event fires', () => {
      const onClose = vi.fn();
      render(<Modal open onClose={onClose} />);
      fireEvent(document.querySelector('dialog')!, new Event('close'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when the backdrop (dialog element itself) is clicked', () => {
      const onClose = vi.fn();
      render(<Modal open onClose={onClose} />);
      fireEvent.click(document.querySelector('dialog')!);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose on backdrop click when dismissOnBackdrop=false', () => {
      const onClose = vi.fn();
      render(<Modal open onClose={onClose} dismissOnBackdrop={false} />);
      fireEvent.click(document.querySelector('dialog')!);
      expect(onClose).not.toHaveBeenCalled();
    });

    it('does not call onClose when clicking inside the panel content', () => {
      const onClose = vi.fn();
      render(<Modal open onClose={onClose}>Inner text</Modal>);
      fireEvent.click(screen.getByText('Inner text'));
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('size', () => {
    it.each(['sm', 'md', 'lg'] as const)('sets data-size="%s"', (size) => {
      render(<Modal open onClose={() => {}} size={size} />);
      expect(document.querySelector('dialog')).toHaveAttribute('data-size', size);
    });
  });

  it('forwards ref to the dialog element', () => {
    const ref = createRef<HTMLDialogElement>();
    render(<Modal open onClose={() => {}} ref={ref} />);
    expect(ref.current?.tagName).toBe('DIALOG');
  });
});
```

- [ ] **Step 2: Run all tests**

```bash
npm test
```

Expected: all 8 tasks' tests pass. Example summary:
```
✓ src/components/Button/Button.test.tsx
✓ src/components/Input/Input.test.tsx
✓ src/components/Card/Card.test.tsx
✓ src/components/Badge/Badge.test.tsx
✓ src/components/Avatar/Avatar.test.tsx
✓ src/components/Switch/Switch.test.tsx
✓ src/components/Modal/Modal.test.tsx

Test Files  7 passed (7)
Tests      XX passed (XX)
```

If any test fails, fix the test (not the component) unless the test reveals an actual bug.

- [ ] **Step 3: Commit**

```bash
git add src/components/Modal/Modal.test.tsx
git commit -m "test: add Modal component tests"
```
