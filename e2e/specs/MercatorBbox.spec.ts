import { test } from '@playwright/test';

import { runAccessibilityCheck, testSnapshot, waitForMapReady } from '../config/test.utils';

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
