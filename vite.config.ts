import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';


export default defineConfig({
  plugins: [react()],

  // Configure absolute imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // Production build optimizations
  build: {
    sourcemap: false, // Disable source maps in production for security and smaller bundle size
    minify: 'terser', // Optional: 'esbuild' is default and faster, 'terser' can yield slightly smaller bundles
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunks for better caching
          react: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          ui: ['framer-motion', 'lucide-react', 'react-icons', 'react-hot-toast'],
          utils: ['axios', 'date-fns', 'zod', '@hookform/resolvers', 'dompurify'],
        },
      },
    },
  },

  // Vitest configuration for unit/integration testing
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },

  // Optional: Configure server for local development
  server: {
    port: 3000,
    open: true,
  },
});