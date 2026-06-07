import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; 
import path from 'path';


export default defineConfig({
  plugins: [
            react(),
            tailwindcss(),
  ],

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
        // Use function syntax for type-safe, robust code splitting
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@reduxjs/toolkit') || id.includes('react-redux') || id.includes('redux-persist')) {
              return 'redux-vendor';
            }
            if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('react-icons') || id.includes('react-hot-toast')) {
              return 'ui-vendor';
            }
            if (id.includes('axios') || id.includes('date-fns') || id.includes('zod') || id.includes('@hookform/resolvers') || id.includes('dompurify') || id.includes('@sentry')) {
              return 'utils-vendor';
            }
            // Fallback for any other node_modules
            return 'vendor';
          }
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