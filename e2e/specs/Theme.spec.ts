import { expect, test } from '@playwright/test';

import { runAccessibilityCheck, testSnapshot, waitForMapReady } from '../config/test.utils';

const testCases = [
  {
    name: 'bsk1 theme',
    params: '?theme=bsk1',
  },
  {
    name: 'bsk2 theme',
    params: '?theme=bsk2',
  },
];

test.describe.parallel('Theme Display Tests', () => {
  for (const testCase of testCases) {
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

      test('should have correct theme applied', async ({ page }) => {
        const theme = await page.evaluate(() =>
          document.documentElement.getAttribute('data-theme'),
        );
        expect(theme).toBe(testCase.name === 'bsk1 theme' ? 'bsk1' : 'bsk2');
      });
    });
  }
});
