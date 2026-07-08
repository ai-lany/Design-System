import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  // NOTE: tsup/esbuild extract *.module.css but export an empty class map, so
  // consumers of the built package get unstyled components. The library JS + CSS
  // are built with Vite library mode instead (see vite.lib.config.ts); tsup is
  // kept only for reference / declaration experiments.
});
