import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If deploying to GitHub Pages under a repo path, set VITE_BASE in .env, e.g. "/repo-name/"
const base = process.env.VITE_BASE || '/'

export default defineConfig({
  base,
  plugins: [react()],
})
