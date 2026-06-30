# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # run the example/docs page locally (Vite dev server)
npm run build        # build the library (tsup → dist/index.js + dist/index.cjs + dist/index.d.ts + dist/index.css)
npm run build:docs   # build the static example/docs site (Vite → dist/)
npm run typecheck    # run tsc --noEmit (strict mode — must pass before pushing)
```

There are no tests. There is no lint script. The default branch is `master`.

Fonts are not in the repo. If you get font-related build warnings, clone the Funnel typeface:

```bash
git clone https://github.com/Dicotype/Funnel.git fonts/Funnel
# then move fonts/Funnel/fonts/Funnel_1001, fonts/Funnel/fonts/Funnel_Display,
# and fonts/Funnel/fonts/Funnel_Sans into fonts/
```

## Architecture

### Two build targets

| Target | Tool | Entry | Output |
|--------|------|-------|--------|
| Component library | tsup | `src/index.ts` | `dist/index.{js,cjs,d.ts}` + `dist/index.css` |
| Docs/example site | Vite | `index.html` → `src/examples/Example.tsx` | `dist/` (static) |

The same `dist/` folder is used for both outputs — run them sequentially, not simultaneously.

CI runs `npm ci` then `npm run build:docs` and deploys `dist/` to GitHub Pages on every push to `master`.

### Design token system (`src/styles/tokens.css`)

Two-layer architecture — **never use primitive tokens in components**:

- **Primitives** (`--gray-*`, `--accent-*`, `--red-*`, etc.): raw values, never referenced in components.
- **Semantic tokens** (`--color-bg`, `--color-fg`, `--color-accent`, `--color-border`, `--space-*`, `--radius-*`, `--shadow-*`, `--text-*`, `--weight-*`, `--control-height-*`, `--duration-*`, `--ease-*`): the only tokens components may use.

Dark mode is enabled by adding `data-theme="dark"` to any ancestor element. The semantic layer is redefined under `[data-theme="dark"]` in `tokens.css` — no component-level dark mode logic needed.

### Component pattern

Each component lives in `src/components/<Name>/` with three files:

- `<Name>.tsx` — React component (TypeScript strict mode)
- `<Name>.module.css` — scoped styles (CSS Modules)
- `index.ts` — barrel export

Components follow these conventions:

- Use `forwardRef` for any DOM-wrapping component so refs work in consumer apps.
- Extend the appropriate HTML attributes interface (e.g., `ButtonHTMLAttributes<HTMLButtonElement>`), using `Omit<...>` when a native prop conflicts with a custom one (e.g., `Omit<HTMLAttributes<HTMLDivElement>, 'title'>`).
- Pass behavioral variants via HTML `data-*` attributes (`data-variant`, `data-size`, `data-loading`, etc.) so CSS selectors like `.button[data-variant='primary']` handle styling without JS logic.
- Use `cn()` from `src/lib/cn.ts` to merge classNames — it's a tiny homegrown utility, not clsx/twMerge.
- Spread `...rest` onto the root DOM element so consumers can pass any standard HTML attributes.

### CSS Modules pattern

Variant/state styling uses `data-*` attribute selectors rather than additional CSS classes:

```css
.button[data-variant='primary'] { ... }
.button[data-size='sm'] { ... }
.button[data-loading] { ... }
```

This keeps the JSX attribute list clean and avoids generating variant-specific class combinations.

### Docs/example page (`src/examples/Example.tsx`)

One large file that demonstrates every component. It uses internal helper components (`Section`, `Block`, `PreviewCode`) defined at the bottom of the file. To add a demo for a new component: import it, add a `<Section>` block in the appropriate place in the JSX, and add a demo function (named `<ComponentName>Example`) at the bottom.

The page has a left nav (`NAV_GROUPS`) that links to section IDs — update it when adding a new section.

### Library exports (`src/index.ts`)

All public API is exported from this single barrel. CSS imports (`fonts.css`, `tokens.css`, `reset.css`) are also imported here so consumers get tokens and reset automatically from a single `import '@your-org/design-system/dist/index.css'`.
