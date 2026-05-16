import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 10420,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
  },
});
