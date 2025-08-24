// next.config.mjs
import { defineConfig } from 'next'

export default defineConfig({
  reactStrictMode: true,
  images: {
    domains: ['example.com'],
  },
  modularizeImports: {
    'react-icons': {
      transform: 'react-icons/{{member}}',
    },
  },
  experimental: {
    appDir: true,
  },
})