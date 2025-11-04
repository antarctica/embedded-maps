import { test } from '@playwright/test';

import {
  getHarPath,
  runAccessibilityCheck,
  testSnapshot,
  waitForMapReady,
} from '../config/test.utils';

test.describe.parallel('Asset Arrays', () => {
  test.describe('multiple asset-ids', () => {
    test.beforeEach(async ({ page }) => {
      // Note: Record HAR file for multiple asset IDs query
      // Expected query: asset_id IN ('01JDRYA29AR6PFGXVCZ40V8C74', '01JDRYA33CJZ8FQGAJBTFJS4P7')
      const harPath = getHarPath('asset-arrays/multiple-asset-ids.har');
      await page.routeFromHAR(harPath, {
        url: '**/tPxy1hrFDhJfZ0Mf/arcgis/rest/services/ats_latest_assets_position/FeatureServer/0/*',
        update: false,
      });
      await page.goto(
        `/?asset-id=01JDRYA29AR6PFGXVCZ40V8C74&asset-id=01JDRYA33CJZ8FQGAJBTFJS4P7&zoom=8`,
      );
      await waitForMapReady(page);
    });

    test('snapshot', async ({ page }) => {
      await testSnapshot(page, 'multiple-asset-ids');
    });

    test('should not have any automatically detectable accessibility issues', async ({ page }) => {
      await runAccessibilityCheck(page);
    });
  });
  test.describe('multiple asset-types', () => {
    test.beforeEach(async ({ page }) => {
      // Note: Record HAR file for multiple asset types query
      // Expected query: type_code IN ('98', '62')
      const harPath = getHarPath('asset-arrays/multiple-asset-types.har');
      await page.routeFromHAR(harPath, {
        url: '**/tPxy1hrFDhJfZ0Mf/arcgis/rest/services/ats_latest_assets_position/FeatureServer/0/*',
        update: false,
      });
      await page.goto(`/?asset-type=98&asset-type=62&zoom=6`);
      await waitForMapReady(page);
    });

    test('snapshot', async ({ page }) => {
      await testSnapshot(page, 'multiple-asset-types');
    });

    test('should not have any automatically detectable accessibility issues', async ({ page }) => {
      await runAccessibilityCheck(page);
    });
  });

  test.describe('asset-id and asset-type together (OR condition)', () => {
    test.beforeEach(async ({ page }) => {
      // Note: Record HAR file for OR condition query
      // Expected query: (asset_id IN ('01JDRYA29AR6PFGXVCZ40V8C74') OR type_code IN ('62'))
      const harPath = getHarPath('asset-arrays/asset-id-and-type-or.har');
      await page.routeFromHAR(harPath, {
        url: '**/tPxy1hrFDhJfZ0Mf/arcgis/rest/services/ats_latest_assets_position/FeatureServer/0/*',
        update: false,
      });
      await page.goto(`/?asset-id=01JDRYA29AR6PFGXVCZ40V8C74&asset-type=62&zoom=8`);
      await waitForMapReady(page);
    });

    test('snapshot', async ({ page }) => {
      await testSnapshot(page, 'asset-id-and-type-or');
    });

    test('should not have any automatically detectable accessibility issues', async ({ page }) => {
      await runAccessibilityCheck(page);
    });
  });

  test.describe('multiple asset-ids and asset-types together (OR condition)', () => {
    test.beforeEach(async ({ page }) => {
      // Note: Record HAR file for OR condition with multiple values
      // Expected query: (asset_id IN ('01JDRYA29AR6PFGXVCZ40V8C74', '01JDRYA33CJZ8FQGAJBTFJS4P7') OR type_code IN ('98', '62'))
      const harPath = getHarPath('asset-arrays/multiple-ids-and-types-or.har');
      await page.routeFromHAR(harPath, {
        url: '**/tPxy1hrFDhJfZ0Mf/arcgis/rest/services/ats_latest_assets_position/FeatureServer/0/*',
        update: false,
      });
      await page.goto(
        `/?asset-id=01JDRYA29AR6PFGXVCZ40V8C74&asset-id=01JDRYA33CJZ8FQGAJBTFJS4P7&asset-type=98&asset-type=62&zoom=8`,
      );
      await waitForMapReady(page);
    });

    test('snapshot', async ({ page }) => {
      await testSnapshot(page, 'multiple-ids-and-types-or');
    });

    test('should not have any automatically detectable accessibility issues', async ({ page }) => {
      await runAccessibilityCheck(page);
    });
  });
});
