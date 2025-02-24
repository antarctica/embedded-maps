import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

const isCI = !!process.env.CI;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Set appropriate timeouts for local and CI environments */
  timeout: isCI ? 60000 : 30000, // 60s for CI, 30s for local
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
        ['junit', { outputFile: 'test-results/junit.xml' }], // GitLab integration
      ]
    : [
        [
          'html',
          {
            // Local development gets full HTML report
            outputFolder: 'out/report',
            open: 'on-failure',
            attachments: true,
            screenshots: true,
            video: 'off',
            trace: 'retain-on-failure',
            theme: 'dark',
          },
        ],
      ],

  /* Organize test outputs and snapshots */
  outputDir: '.test/spec/output',
  snapshotDir: isCI ? '.test/spec/ci-snaps' : '.test/spec/local-snaps',
  snapshotPathTemplate: '{snapshotDir}/{projectName}/{testFilePath}/{arg}{ext}',

  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://127.0.0.1:5173',

    /* Collect trace when retrying the failed test. */
    trace: isCI ? 'retain-on-failure' : 'on-first-retry',

    /* Only screenshot on failure to speed up tests */
    screenshot: 'only-on-failure',

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
    timeout: isCI ? 60000 : 30000, // Match the test timeout
  },
});
