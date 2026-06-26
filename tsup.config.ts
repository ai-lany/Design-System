import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  // CSS Modules are extracted to dist/index.css — import it once in your app.
  // Tokens and reset CSS are included automatically via the index.ts imports.
});
