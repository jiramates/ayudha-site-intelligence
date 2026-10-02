import { defineConfig } from 'vite'
export default defineConfig({ base: './', define: { __INLINE_STUDY__: 'undefined' }, build: { target: 'es2022' }, test: { include: ['tests/**/*.test.ts'], environment: 'node' } })
