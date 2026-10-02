import { defineConfig } from '@playwright/test'
import { existsSync } from 'node:fs'
const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(existsSync)
export default defineConfig({
  testDir: 'tests', testMatch: /.*\.spec\.ts/, timeout: 60000,
  webServer: { command: 'npm run build && npx vite preview --port 4173 --strictPort', url: 'http://localhost:4173', reuseExistingServer: true, timeout: 120000 },
  use: { baseURL: 'http://localhost:4173', viewport: { width: 1280, height: 900 }, launchOptions: { executablePath: exe, args: ['--no-sandbox'] } },
})
