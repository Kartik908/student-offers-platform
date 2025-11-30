import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import { imagetools } from 'vite-imagetools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Image optimization
    imagetools({
      defaultDirectives: (url) => {
        if (url.searchParams.has('responsive')) {
          return new URLSearchParams({
            format: 'webp;avif',
            w: '400;800;1200',
            as: 'srcset',
          })
        }
        return new URLSearchParams()
      },
    }),
    // Bundle analyzer - generates stats.html
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
    // Gzip compression
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024, // Only compress files > 1KB
    }),
    // Brotli compression
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    minify: 'terser', // Use terser for better compression than esbuild
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
    cssCodeSplit: true,
    target: 'es2020',
    chunkSizeWarningLimit: 500, // Stricter limit to encourage smaller chunks
    cssMinify: true, // Use default CSS minification
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI Libraries
          'radix-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-tooltip',
          ],
          // Form & Validation
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Data & State
          'data': ['@tanstack/react-query', '@supabase/supabase-js'],
          // Animation & Motion
          'motion': ['framer-motion'],
          // Utilities
          'utils': ['fuse.js', 'date-fns', 'clsx', 'tailwind-merge'],
        },
        // Optimize chunk naming for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
    ],
    exclude: ['posthog-js'], // Load PostHog on demand
  },
  server: {
    port: 5173,
    host: true,
    hmr: {
      port: 5173,
    },
    proxy: {
      // Proxy PostHog requests through your domain to bypass ad blockers
      '/ingest': {
        target: 'https://us.i.posthog.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/ingest/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('PostHog proxy error:', err.message);
          });
        },
      },
      '/decide': {
        target: 'https://us.i.posthog.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/decide/, '/decide'),
      },
      // Add proxy for PostHog events endpoint
      '/i': {
        target: 'https://us.i.posthog.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
      }
    }
  }
})