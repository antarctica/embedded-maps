import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

const isCI = !!process.env.CI;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: '../specs',
  /* Set appropriate timeouts for local and CI environments */
  timeout: 60000, // 60s for both local and CI
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCI,
  /* Retry on CI only */
  retries: isCI ? 2 : 0,
  /* Opt out of parallel tests on CI for stability */
  workers: isCI ? 1 : '75%',

  /* Reporter configuration */
  reporter: isCI
    ? [
        ['list'], // Console output
        ['junit', { outputFile: '../results/junit.xml' }], // GitLab integration
      ]
    : [
        [
          'html',
          {
            open: 'never',
            outputDir: '../results/html-report',
            attachments: true,
            screenshots: true,
            video: 'off',
            trace: 'retain-on-failure',
            theme: 'dark',
            host: process.env.PW_SERVER_HOST || 'localhost',
            port: parseInt(process.env.PW_SERVER_PORT || '9323'),
          },
        ],
      ],

  /* Organize test outputs and snapshots */
  outputDir: '../output',
  snapshotDir: '../snapshots',
  snapshotPathTemplate: '{snapshotDir}/{projectName}/{testFilePath}/{arg}{ext}',

  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://127.0.0.1:5173',

    trace: 'retain-on-failure',

    /* Only screenshot on failure to speed up tests */
    screenshot: isCI ? 'only-on-failure' : 'on',

    /* Visual test specific settings */
    viewport: { width: 1280, height: 720 },
    contextOptions: {
      reducedMotion: 'reduce',
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          headless: true,
          args: ['--ignore-gpu-blocklist', '--use-gl=angle'],
        },
      },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !isCI,
    timeout: 60000, // Match the test timeout
    cwd: rootDir, // Ensure dev server runs from project root
  },
});
