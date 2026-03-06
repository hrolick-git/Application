import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  allowedHosts: [
    'frontend-production-0751.up.railway.app'
  ],
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0'
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
