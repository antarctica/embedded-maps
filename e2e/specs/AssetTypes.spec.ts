import { test } from '@playwright/test';

import {
  getHarPath,
  runAccessibilityCheck,
  testSnapshot,
  waitForMapReady,
} from '../config/test.utils';

const assetTypeTestCases = [
  {
    name: 'snowmobile',
    params: '?asset-type=98&zoom=6',
    typeCode: '98',
  },
  {
    name: 'aeroplane',
    params: '?asset-type=62&globe-overview',
    typeCode: '62',
  },
];

test.describe('Asset Types', () => {
  for (const testCase of assetTypeTestCases) {
    test.describe(testCase.name, () => {
      test.beforeEach(async ({ page }) => {
        const harPath = getHarPath(`asset-types/${testCase.name}.har`);
        await page.routeFromHAR(harPath, {
          url: '**/tPxy1hrFDhJfZ0Mf/arcgis/rest/services/ats_latest_assets_position/FeatureServer/0/*',
          update: process.env.UPDATE_HARS === 'true',
        });
        await page.goto(`/${testCase.params}`);
        await waitForMapReady(page, { additionalDelay: 10000 });
      });

      test('snapshot', async ({ page }) => {
        await testSnapshot(page, `asset-type-${testCase.name}`);
      });

      test('should not have any automatically detectable accessibility issues', async ({
        page,
      }) => {
        await runAccessibilityCheck(page);
      });
    });
  }
});
