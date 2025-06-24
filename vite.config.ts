/// <reference types="vite/client" />
import { defineConfig } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'

const htmlFiles = await fg.async('./**/*.html', {
  cwd: dirname(fileURLToPath(import.meta.url)),
  absolute: true,
  ignore: ['**/node_modules/**', '**/dist/**', '**/.vite/**'],
})
console.log('HTML files found:', htmlFiles)

export default defineConfig({
  build: {
    rollupOptions: {
      input: htmlFiles,
    },
  },
  esbuild: {
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
  },
  server: {
    host: true,
    allowedHosts: ['mac.sole-peacock.ts.net'],
  },
})
