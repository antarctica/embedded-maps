/// <reference types="@arcgis/map-components/types/react" />
import { expect, test } from '@playwright/test';

import { runAccessibilityCheck, testSnapshot, waitForMapReady } from '../config/test.utils';

const baseTestCases = [
  {
    name: 'default',
    // expect default view
    params: '',
  },
  {
    name: 'centre and zoom',
    params: '?centre=[-180,-90]&zoom=6',
  },
  {
    name: 'centre and scale',
    params: '?centre=[24,34.5]&scale=500000',
  },
];

test.describe.parallel('Map View Parameters', () => {
  for (const testCase of baseTestCases) {
    test.describe(testCase.name, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(`/${testCase.params}`);
        await waitForMapReady(page);
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

  test.describe('centre, scale and zoom', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/?centre=[-180,-90]&scale=500000&zoom=6`);
      await waitForMapReady(page);
    });

    test('zoom overrides scale', async ({ page }) => {
      // Check if zoom property equals 6
      const zoomValue = await page.evaluate(() => {
        const mapElement = document.querySelector('arcgis-map');
        return mapElement?.zoom;
      });

      expect(zoomValue).toBe(6);
    });
  });

  test.describe('asset-id', () => {
    test.beforeEach(async ({ page }) => {
      await page.routeFromHAR(`e2e/hars/map-view-params/asset-id/asset-id.har`, {
        url: '**/tPxy1hrFDhJfZ0Mf/arcgis/rest/services/ats_latest_assets_position/FeatureServer/0/*',
        update: false,
      });
      await page.goto(`/?asset-id=01JDRYA29AR6PFGXVCZ40V8C74&zoom=8`);
      await waitForMapReady(page);
    });

    test('snapshot', async ({ page }) => {
      await testSnapshot(page, 'asset-id');
    });

    test('should not have any automatically detectable accessibility issues', async ({ page }) => {
      await runAccessibilityCheck(page);
    });
  });
});
