/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' makes the built site work from any folder, including
// GitHub Pages' https://<user>.github.io/<repo>/ address.
export default defineConfig({
  base: './',
  plugins: [react()],
  test: { include: ['test/**/*.test.ts'] },
});
