import { copyFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    {
      name: 'spa-fallback',
      enforce: 'post',
      closeBundle() {
        const outDir = path.resolve(__dirname, 'dist')
        const indexHtml = path.resolve(outDir, 'index.html')
        const fallbackHtml = path.resolve(outDir, '404.html')
        if (existsSync(indexHtml)) {
          copyFileSync(indexHtml, fallbackHtml)
        }
      },
    },
  ],
  base: '/',
})

