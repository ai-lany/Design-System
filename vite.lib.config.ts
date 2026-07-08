import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

/**
 * Library build (the npm/git package).
 *
 * Vite compiles the components' `*.module.css` as real CSS Modules — scoped
 * class names in the JS export map that match the extracted `dist/index.css`
 * selectors — which tsup/esbuild does not do (it exports an empty map, leaving
 * consumers with unstyled components). Plain `.css` (fonts/tokens/reset) stays
 * global. Fonts referenced via `url()` are emitted into `dist/assets`.
 *
 * The docs/example site uses the separate `vite.config.ts`.
 */
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    sourcemap: true,
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        // Single stylesheet → dist/index.css; fonts → dist/assets/*.
        assetFileNames: (asset) =>
          asset.name && asset.name.endsWith('.css')
            ? 'index.css'
            : 'assets/[name]-[hash][extname]',
      },
    },
  },
});
