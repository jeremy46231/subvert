import { defineConfig } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        blog: resolve(__dirname, 'demo/blog/index.html'),
        github: resolve(__dirname, 'demo/github/index.html'),
        googleForm: resolve(__dirname, 'demo/google-form/index.html'),
        googleFormElement: resolve(
          __dirname,
          'demo/google-form-element/index.html'
        ),
      },
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
