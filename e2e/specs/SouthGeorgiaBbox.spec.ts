import { test } from '@playwright/test';

import { runAccessibilityCheck, testSnapshot, waitForMapReady } from '../config/test.utils';

const bboxes = [
  [-38.643677, -55.200717, -35.271423, -53.641972],
  [-37.5, -54.8, -36.4, -54.0],
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
