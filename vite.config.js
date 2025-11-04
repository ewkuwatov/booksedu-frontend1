import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// --- HTTPS для локалки ---
// подготовьте локальный сертификат (см. инструкцию в конце) и пропишите пути ниже
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve('./certs/localhost-key.pem')),
      cert: fs.readFileSync(path.resolve('./certs/localhost.pem')),
    },
    port: 5173,
    host: true,
  },
})
