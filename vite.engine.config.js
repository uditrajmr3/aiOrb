import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'packages/mia_orb/assets',
    emptyOutDir: false,
    lib: {
      entry: 'src/engine/orbEngine.js',
      name: 'MiaOrbBundle',
      formats: ['iife'],
      fileName: () => 'orb_engine.bundle.js',
    },
    rollupOptions: {
      output: {
        extend: true,
      },
    },
    minify: 'esbuild',
  },
});
