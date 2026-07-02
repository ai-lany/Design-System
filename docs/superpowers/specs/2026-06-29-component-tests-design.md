# Component Tests Design

**Date:** 2026-06-29
**Status:** Approved

## Overview

Add a full test suite covering all components in the design system: Button, Input, Card, Badge, Avatar, Switch, and Modal.

## Framework

**Vitest + @testing-library/react + jsdom**

The project already uses Vite/tsup, so Vitest shares the same config pipeline — CSS module mocking, TypeScript transforms, and path aliases all work with minimal extra configuration. React Testing Library provides semantic queries that test components the way users interact with them. `@testing-library/user-event` handles realistic keyboard and mouse events. jsdom has the best `<dialog>` support among headless DOM environments.

## New Dev Dependencies

```
vitest
@testing-library/react
@testing-library/user-event
@testing-library/jest-dom
jsdom
```

## File Structure

Tests are co-located with their components:

```
src/
  test/
    setup.ts                        # jest-dom matchers + dialog polyfill
  components/
    Button/
      Button.test.tsx
    Input/
      Input.test.tsx
    Card/
      Card.test.tsx
    Badge/
      Badge.test.tsx
    Avatar/
      Avatar.test.tsx
    Switch/
      Switch.test.tsx
    Modal/
      Modal.test.tsx
vitest.config.ts
```

## Configuration

### vitest.config.ts

- `environment: 'jsdom'`
- `setupFiles: ['./src/test/setup.ts']`
- CSS modules proxied to identity object (class names pass through as strings)
- `globals: true` so tests don't need to import `describe`/`it`/`expect`

### src/test/setup.ts

- Import `@testing-library/jest-dom` to extend Vitest's `expect` with DOM matchers (`toBeInTheDocument`, `toBeDisabled`, `toHaveAttribute`, etc.)
- Patch `HTMLDialogElement.prototype.showModal` and `.close` — jsdom does not implement these native dialog methods, so we replace them with vi.fn() stubs that toggle the `open` attribute to let the Modal component behave correctly in tests

### package.json scripts

Add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

## Test Coverage Per Component

### Button

| Scenario | What to assert |
|----------|---------------|
| Renders with children | Text visible |
| Default props | `data-variant="primary"`, `data-size="md"` |
| All variants | `data-variant` attr matches prop |
| All sizes | `data-size` attr matches prop |
| `disabled` prop | Button is disabled |
| `loading` prop | Spinner rendered, button disabled, children still in DOM via label span |
| `iconOnly` prop | `data-icon-only` attr set |
| `leading` prop | Leading icon rendered |
| `trailing` prop | Trailing icon rendered |
| Click handler | onClick fires when not disabled |
| No click when disabled | onClick not called |
| Forwarded ref | ref.current is the `<button>` element |
| Custom className | Applied alongside module class |

### Input

| Scenario | What to assert |
|----------|---------------|
| Renders bare (no label/helper) | Input present |
| `label` prop | `<label>` rendered, `htmlFor` links to input `id` |
| `required` prop | Asterisk rendered, `required` attr on input |
| `helperText` prop | Helper `<p>` rendered, `aria-describedby` wired |
| `error` as boolean | `aria-invalid` on input, field `data-error` attr |
| `error` as string | String shown instead of helperText, `aria-invalid` set |
| `leadingIcon` | Icon span rendered |
| `trailingIcon` | Icon span rendered |
| `disabled` prop | Input disabled, field `data-disabled` attr |
| Auto-generated id | label and input linked even without explicit `id` |
| Explicit `id` | label and input use provided id |
| Forwarded ref | ref.current is the `<input>` element |

### Card

| Scenario | What to assert |
|----------|---------------|
| Renders children | Content visible |
| Default elevation | `data-elevation="raised"` |
| Custom elevation values | `data-elevation` attr matches prop |
| `unpadded` prop | `data-unpadded` attr set |
| `interactive` prop | `data-interactive` attr set |
| CardHeader renders | Content visible with correct class |
| CardBody renders | Content visible with correct class |
| CardFooter renders | Content visible with correct class |
| Forwarded ref (Card) | ref.current is the `<div>` |

### Badge

| Scenario | What to assert |
|----------|---------------|
| Renders children | Text visible |
| Default props | `data-tone="neutral"`, `data-variant="soft"`, `data-size="sm"` |
| All tones | `data-tone` attr matches prop |
| All variants | `data-variant` attr matches prop |
| All sizes | `data-size` attr matches prop |
| Custom className | Applied alongside module class |
| Forwarded ref | ref.current is the `<span>` |

### Avatar

| Scenario | What to assert |
|----------|---------------|
| Shows `<img>` when `src` provided | img rendered with correct src and alt |
| Falls back to initials on image error | img gone, initials span shown |
| Initials: single word | 2-char uppercase initials |
| Initials: two words | First char of each word |
| Initials: three+ words | First + last word initials |
| Initials: empty name | Empty string, no crash |
| `status` prop | Status dot rendered with correct `data-status` |
| No `status` | Status dot absent |
| `size` prop | `data-size` attr matches prop |
| `src` change resets fallback | After error, new src restores the image |
| Forwarded ref | ref.current is the outer `<span>` |

### Switch

| Scenario | What to assert |
|----------|---------------|
| Renders without label | Checkbox input present |
| `label` prop | Label text visible, `htmlFor` links to input |
| `role="switch"` | Input has switch role |
| `labelPosition="start"` | `data-label-position="start"` on root |
| `labelPosition="end"` (default) | `data-label-position="end"` on root |
| `switchSize` prop | `data-size` attr matches prop |
| `disabled` prop | Input disabled, `data-disabled` on root |
| `onChange` fires | Handler called when toggled |
| `checked` / `defaultChecked` | Passes through to underlying input |
| Forwarded ref | ref.current is the `<input>` |

### Modal

| Scenario | What to assert |
|----------|---------------|
| `open=true` | `showModal()` called on mount/change |
| `open=false` | `close()` called when changed from true→false |
| `open=false` initially | `showModal()` never called |
| `title` prop | `<h2>` rendered, `aria-labelledby` set |
| `description` prop | `<p>` rendered, `aria-describedby` set |
| Neither title nor description | aria attrs absent |
| `footer` prop | Footer slot rendered |
| `children` prop | Body content rendered |
| Native close event | `onClose` called |
| Backdrop click (`dismissOnBackdrop=true`) | `onClose` called when clicking dialog element |
| `dismissOnBackdrop=false` | `onClose` NOT called on backdrop click |
| Click inside panel | `onClose` NOT called |
| `size` prop | `data-size` attr matches prop |
| Forwarded ref | ref.current is the `<dialog>` element |

## Error Handling

No async data fetching in these components. Error scenarios tested are:
- Avatar image load failure (synchronous `onError` event)
- Input receiving invalid/edge-case prop combinations (error + helperText together)

## Accessibility Focus

Every component test verifies the semantic contract:
- Labels connected to inputs via `htmlFor`/`id`
- `aria-invalid`, `aria-describedby`, `aria-labelledby` set correctly
- `role="switch"` on Switch
- `aria-hidden` on decorative elements (spinner, status dot, required asterisk)
- Buttons disabled when `loading` or `disabled`
