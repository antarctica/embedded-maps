import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const bboxes = [
  [-180.0, 0, 180.0, 20.0],
  [-180.0, -20.0, 180.0, 0.0],
  [24, 34.5, 28, 39],
  [140.0, -40.0, -20.0, -20.0],
];

test.describe.parallel('Mercator Bounding Boxes', () => {
  for (const bbox of bboxes) {
    test.describe(`bbox=${bbox}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(`/?bbox=[${bbox.join(',')}]`);
      });

      test('snapshot', async ({ page }) => {
        // Wait for the ArcGIS map view to be ready
        await page.waitForSelector('arcgis-map', { state: 'visible' });

        // Wait for the map to finish updating
        await page.waitForSelector('arcgis-map:not([updating])', {
          state: 'visible',
          timeout: 5000,
        });

        await expect(page).toHaveScreenshot(`home-bbox-${bbox.join('-')}.png`, { fullPage: true });
      });

      test('should not have any automatically detectable accessibility issues', async ({
        page,
      }) => {
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
        expect(accessibilityScanResults.violations).toEqual([]);
      });
    });
  }
});
