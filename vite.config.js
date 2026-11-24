import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { imagetools } from 'vite-imagetools'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
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
  build: { manifest: !isSsrBuild },
  ssr: { noExternal: ['vite-ssg'] },
  server: { proxy: { '/blog/media': process.env.BLOG_API_ORIGIN || 'http://localhost:3001' } },
}))
