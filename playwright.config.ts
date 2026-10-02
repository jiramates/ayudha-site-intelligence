import { defineConfig } from '@playwright/test'
import { existsSync } from 'node:fs'
const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(existsSync)
export default defineConfig({
  testDir: 'tests', testMatch: /.*\.spec\.ts/, timeout: 90000, fullyParallel: true, workers: 3,
  webServer: { command: 'npm run build && npx vite preview --port 4173 --strictPort', url: 'http://localhost:4173', reuseExistingServer: false, timeout: 120000 },
  // the start-up timing tests run one at a time after the rest: parallel pages (moving pictures, in-browser bakes) would skew their clock
  projects: [
    { name: 'main', testIgnore: /art\.spec\.ts/ },
    { name: 'timing', testMatch: /art\.spec\.ts/, dependencies: ['main'], workers: 1 },
  ],
  use: { baseURL: 'http://localhost:4173', viewport: { width: 1280, height: 900 }, launchOptions: { executablePath: exe, args: ['--no-sandbox'] } },
})
