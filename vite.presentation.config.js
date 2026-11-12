import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  root: fileURLToPath(new URL('./presentation', import.meta.url)),
  base: '/apresentacao/pdn/',
  publicDir: false,
  plugins: [vue()],
  build: {
    outDir: '../dist/apresentacao/pdn',
    emptyOutDir: false,
  },
})
