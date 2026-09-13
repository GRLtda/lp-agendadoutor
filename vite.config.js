import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { imagetools } from 'vite-imagetools'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    imagetools(),
    vue(),
  ],
  ssgOptions: {
    dirStyle: 'nested',
    formatting: 'minify',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
