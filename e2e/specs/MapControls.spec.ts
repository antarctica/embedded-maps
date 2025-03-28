import { expect, Page, test } from '@playwright/test';

import { waitForSceneReady } from '../config/test.utils';
import { runAccessibilityCheck, testSnapshot, waitForMapReady } from '../config/test.utils';

const standardTestCases = [
  {
    name: 'default',
    params: '',
    visibleControls: ['zoom', 'home'],
  },
  {
    name: 'hidden UI',
    params: '?centre=[-180,-90]&zoom=6&ctrl-zoom=false&ctrl-reset=false&ctrl-fullscreen=false',
    visibleControls: [],
  },
];

const globeTestCase = {
  name: 'globe overview',
  params: '?centre=[-180,-90]&zoom=6&globe-overview=true',
  visibleControls: ['zoom', 'home'],
};

async function testControlsVisible(page: Page, visibleControls: string[]) {
  const zoomControl = page.locator('button[aria-label="Zoom In"]');
  const homeControl = page.locator('button[aria-label="Home"]');

  if (visibleControls.includes('zoom')) {
    await expect(zoomControl).toBeVisible();
  } else {
    await expect(zoomControl).not.toBeVisible();
  }

  if (visibleControls.includes('home')) {
    await expect(homeControl).toBeVisible();
  } else {
    await expect(homeControl).not.toBeVisible();
  }
}

test.describe.parallel('Map Controls and Parameters', () => {
  // Standard test cases
  for (const testCase of standardTestCases) {
    test.describe(testCase.name, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(`/${testCase.params}`);
        // Wait for the map to be ready
        await waitForMapReady(page);
      });

      test('snapshot', async ({ page }) => {
        await testSnapshot(page, testCase.name);
      });

      test('UI elements visibility', async ({ page }) => {
        await testControlsVisible(page, testCase.visibleControls);
      });

      test('accessibility', async ({ page }) => {
        await runAccessibilityCheck(page);
      });
    });
  }

  // Globe overview specific test case
  test.describe(globeTestCase.name, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${globeTestCase.params}`);

      // Wait for the map to be ready
      await waitForMapReady(page);

      // Wait for the scene to be ready
      await waitForSceneReady(page);

      // wait 5 seconds
      await page.waitForTimeout(5000);
    });

    test('snapshot', async ({ page }) => {
      await testSnapshot(page, globeTestCase.name);
    });
  });
});
