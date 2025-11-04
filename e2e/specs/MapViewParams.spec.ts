/// <reference types="@arcgis/map-components/types/react" />
import { expect, test } from '@playwright/test';

import {
  getHarPath,
  runAccessibilityCheck,
  testSnapshot,
  waitForMapReady,
} from '../config/test.utils';

const baseTestCases = [
  {
    name: 'default',
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

test.describe('Map View Parameters', () => {
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
      const harPath = getHarPath('map-view-params/asset-id/asset-id.har');
      await page.routeFromHAR(harPath, {
        url: '**/tPxy1hrFDhJfZ0Mf/arcgis/rest/services/ats_latest_assets_position/FeatureServer/0/*',
        update: process.env.UPDATE_HARS === 'true',
      });
      await page.goto(`/?asset-id=01JDRYA29AR6PFGXVCZ40V8C74&zoom=8`);
      await waitForMapReady(page, { additionalDelay: 4000 });
    });

    test('snapshot', async ({ page }) => {
      await testSnapshot(page, 'asset-id');
    });

    test('should not have any automatically detectable accessibility issues', async ({ page }) => {
      await runAccessibilityCheck(page);
    });
  });

  test.describe('asset-force-popup', () => {
    test.beforeEach(async ({ page }) => {
      // Set a fixed time for consistent testing (31st March 2025, 10:45 GMT+1)
      await page.clock.setFixedTime(new Date('2025-03-31T09:45:00Z'));

      const harPath = getHarPath('map-view-params/asset-force-popup/asset-force-popup.har');
      await page.routeFromHAR(harPath, {
        url: '**/tPxy1hrFDhJfZ0Mf/arcgis/rest/services/ats_latest_assets_position/FeatureServer/0/*',
        update: process.env.UPDATE_HARS === 'true',
      });
      await page.goto(`/?asset-id=01JDRYA33CJZ8FQGAJBTFJS4P7&zoom=8&asset-force-popup`);
      await waitForMapReady(page, { additionalDelay: 10000 });
    });

    test('snapshot', async ({ page }) => {
      await testSnapshot(page, 'asset-force-popup');
    });

    test('should not have any automatically detectable accessibility issues', async ({ page }) => {
      await runAccessibilityCheck(page);
    });
  });
});
