import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'public_html',
    emptyOutDir: true
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '../private.key')),
      cert: fs.readFileSync(path.resolve(__dirname, '../certificate.crt')),
      rejectUnauthorized: false
    },
    proxy: {
      '/api': {
        target: 'https://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/twitch': {
        target: 'https://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
