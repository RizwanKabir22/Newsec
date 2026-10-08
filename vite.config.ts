import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    // Inline every image as a data: URI so the build can ship as one self-contained HTML file.
    assetsInlineLimit: 50 * 1024 * 1024,
    cssCodeSplit: false,
  },
});
