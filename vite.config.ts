import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
  },
  server: {
    allowedHosts: ['mac.sole-peacock.ts.net'],
  },
})
