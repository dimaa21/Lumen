import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  plugins: [tailwindcss()],
  publicDir: 'assets',
  // Project site lives at /Lumen/. Dev stays at / so local URLs do not change.
  base: command === 'build' ? '/Lumen/' : '/',
  build: {
    target: 'es2020',
    cssMinify: true,
  },
}))
