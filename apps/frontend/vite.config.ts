import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    // ПЕРЕНЕСИ СЮДИ:
    allowedHosts: [
      'frontend-production-0751.up.railway.app',
      '.up.railway.app'
    ],
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: '[name]-[hash].js',
        chunkFileNames: '[name]-[hash].js',
      }
    }
  }
});