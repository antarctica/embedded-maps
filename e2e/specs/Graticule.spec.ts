import { test } from '@playwright/test';

import {
  runAccessibilityCheck,
  testSnapshot,
  waitForMapReady,
  waitForSceneReady,
} from '../config/test.utils';

const testCases = [
  {
    name: 'default view with graticule',
    params: '?graticule=true',
  },
  {
    name: 'arctic view with graticule',
    params: '?bbox=[-180,60,180,90]&graticule=true',
  },
  {
    name: 'antarctic view with graticule',
    params: '?bbox=[-180,-90,180,-60]&graticule=true',
  },
  {
    name: 'mercator view with graticule',
    params: '?bbox=[24,34.5,28,39]&graticule=true',
  },
  {
    name: 'globe overview with graticule',
    params: '?globe-overview=true&graticule=true',
    requiresSceneReady: true,
  },
  {
    name: 'graticule with custom zoom',
    params: '?centre=[-180,-90]&zoom=6&graticule=true',
  },
  {
    name: 'graticule with custom scale',
    params: '?centre=[24,34.5]&scale=500000&graticule=true',
  },
];

test.describe.parallel('Graticule Display Tests', () => {
  for (const testCase of testCases) {
    test.describe(testCase.name, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(`/${testCase.params}`);
        await waitForMapReady(page);

        if (testCase.requiresSceneReady) {
          await waitForSceneReady(page);
        }
      });

      test('snapshot', async ({ page }) => {
        await testSnapshot(page, testCase.name);
      });

      test('should not have any automatically detectable accessibility issues', async ({
        page,
      }) => {
        await runAccessibilityCheck(page);
      });
    });
  }
});
