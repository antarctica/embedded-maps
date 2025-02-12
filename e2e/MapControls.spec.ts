import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const standardTestCases = [
  {
    name: 'center and zoom',
    params: '?center=[-180,-90]&zoom=6',
    expectedControls: true,
  },
  {
    name: 'center and scale',
    params: '?center=[24,34.5]&scale=500000',
    expectedControls: true,
  },
  {
    name: 'hidden UI',
    params: '?center=[-180,-90]&zoom=6&hide-ui=true',
    expectedControls: false,
  },
];

const globeTestCase = {
  name: 'globe overview',
  params: '?center=[-180,-90]&zoom=6&globe-overview=true',
  expectedControls: true,
  expectGlobe: true,
};

test.describe.parallel('Map Controls and Parameters', () => {
  // Standard test cases
  for (const testCase of standardTestCases) {
    test.describe(testCase.name, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(`/${testCase.params}`);
        // Wait for the map to be ready
        await page.waitForSelector('arcgis-map', { state: 'visible' });
        await page.waitForSelector('arcgis-map:not([updating])', {
          state: 'visible',
          timeout: 5000,
        });
      });

      test('snapshot', async ({ page }) => {
        await expect(page).toHaveScreenshot(`${testCase.name.replace(/\s+/g, '-')}.png`, {
          fullPage: true,
        });
      });

      test('UI elements visibility', async ({ page }) => {
        const zoomControl = page.locator('button[aria-label="Zoom In"]');
        const homeControl = page.locator('button[aria-label="Home"]');

        if (testCase.expectedControls) {
          await expect(zoomControl).toBeVisible();
          await expect(homeControl).toBeVisible();
        } else {
          await expect(zoomControl).not.toBeVisible();
          await expect(homeControl).not.toBeVisible();
        }
      });

      test('should not have any automatically detectable accessibility issues', async ({
        page,
      }) => {
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
        expect(accessibilityScanResults.violations).toEqual([]);
      });
    });
  }

  // Globe overview specific test case
  test.describe(globeTestCase.name, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${globeTestCase.params}`);

      // Wait for the map to be ready
      await page.waitForSelector('arcgis-map', { state: 'visible' });
      await page.waitForSelector('arcgis-map:not([updating])', {
        state: 'visible',
        timeout: 5000,
      });

      // Wait for the scene to be ready
      await page.waitForSelector('arcgis-scene', { state: 'visible' });
      await page.waitForSelector('arcgis-scene:not([updating])', {
        state: 'visible',
        timeout: 5000,
      });
    });

    test('snapshot', async ({ page }) => {
      await expect(page).toHaveScreenshot(`${globeTestCase.name.replace(/\s+/g, '-')}.png`, {
        fullPage: true,
      });
    });
  });
});
