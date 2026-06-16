import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://codex-iter.in',
      dynamicRoutes: [
        '/',
        '/blogs',
        '/events',
        '/team'
      ],
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    chunkSizeWarningLimit: 800, // optional (default 500)

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'react-vendor'
            }
            if (id.includes('react-router')) {
              return 'router'
            }
            return 'vendor'
          }
        }
      }
    }
  }
})