import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative assets work on both user and project GitHub Pages sites.
  base: './',
  plugins: [react()],
})
