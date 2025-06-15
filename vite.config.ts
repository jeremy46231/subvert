import { defineConfig } from 'vite'

export default defineConfig({
  root: 'demo',
  esbuild: {
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
  },
  server: {
    host: true,
    allowedHosts: ['mac.sole-peacock.ts.net'],
  },
})
