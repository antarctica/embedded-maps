import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const bboxes = [
  [-38.643677, -55.200717, -35.271423, -53.641972],
  [-37.5, -54.8, -36.4, -54.0],
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

        await expect(page).toHaveScreenshot(`bbox-${bbox.join('-')}.png`, { fullPage: true });
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
