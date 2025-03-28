import { test } from '@playwright/test';

import { runAccessibilityCheck, testSnapshot, waitForMapReady } from '../config/test.utils';

const bboxes = [
  [-180.0, 60.0, 180.0, 90.0],
  [68.0677, 67.5894, 68.3359, 67.4869],
  [-180.0, 50.0, 180.0, 60.0],
  [-180.0, 58.0, 180.0, 90.0],
  [-180.0, 50.0, 180.0, 90.0],
  [140.0, 60.0, -60.0, 90.0],
  [140.0, 70.0, -60.0, 80.0],
];

test.describe.parallel('Arctic Bounding Boxes', () => {
  for (const bbox of bboxes) {
    test.describe(`bbox=${bbox}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(`/?bbox=[${bbox.join(',')}]`);
        await waitForMapReady(page);
      });

      test('snapshot', async ({ page }) => {
        await testSnapshot(page, `bbox-${bbox.join('-')}`);
      });

      test('should not have any automatically detectable accessibility issues', async ({
        page,
      }) => {
        await runAccessibilityCheck(page);
      });
    });
  }
});
