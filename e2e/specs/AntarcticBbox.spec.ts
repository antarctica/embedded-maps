import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const bboxes = [
  [-180.0, -90.0, 180.0, -60.0],
  [-68.3359, -67.5894, -68.0677, -67.4869],
  [-180.0, -60.0, 180.0, -50.0],
  [-180.0, -90.0, 180.0, -58.0],
  [-180.0, -90.0, 180.0, -50.0],
  [140.0, -90.0, -60.0, -50.0],
  [140.0, -80.0, -60.0, -50.0],
];

test.describe.parallel('Antarctic Bounding Boxes', () => {
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
          timeout: 20000,
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

test.describe('Antarctic Bounding Box with globe overview', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/?bbox=[-180,-90,180,-60]&globe-overview=true');

    await page.waitForSelector('arcgis-map', { state: 'visible' });

    await page.waitForSelector('arcgis-map:not([updating])', {
      state: 'visible',
      timeout: 20000,
    });

    // wait 5 seconds
    await page.waitForTimeout(5000);

    await expect(page).toHaveScreenshot('bbox-antarctic-globe-overview.png', { fullPage: true });

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
