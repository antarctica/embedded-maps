import '@arcgis/map-components';

import { test } from '@playwright/test';

import { runAccessibilityCheck, testSnapshot, waitForMapReady } from '../config/test.utils';

const testCases = [
  {
    name: 'bbox at zoom 14',
    bbox: [-175, -80.4, -174, -80.3],
    zoom: 14,
  },
  {
    name: 'bbox at zoom 6',
    bbox: [-175, -80.4, -174, -80.3],
    zoom: 6,
  },
];

test.describe.parallel('ScaleAwarePolygon Display Tests', () => {
  for (const testCase of testCases) {
    test.describe(testCase.name, () => {
      test.beforeEach(async ({ page }) => {
        const params = `?bbox=[${testCase.bbox.join(',')}]`;
        await page.goto(`/${params}`);
        await waitForMapReady(page);

        // Set zoom directly on the map element
        await page.evaluate((zoom) => {
          const mapElement = document.querySelector('arcgis-map') as HTMLArcgisMapElement;
          if (mapElement) {
            mapElement.zoom = zoom;
          }
        }, testCase.zoom);

        // Wait for the zoom change to take effect
        await page.waitForTimeout(1000);
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
