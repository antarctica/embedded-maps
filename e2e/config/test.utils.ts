import AxeBuilder from '@axe-core/playwright';
import { expect, Page } from '@playwright/test';

export async function waitForMapReady(page: Page) {
  await page.waitForSelector('arcgis-map', { state: 'visible' });
  await page.waitForSelector('arcgis-map:not([updating])', {
    state: 'visible',
    timeout: 20000,
  });
}

export async function waitForSceneReady(page: Page) {
  await page.waitForSelector('arcgis-scene', { state: 'visible' });
  await page.waitForSelector('arcgis-scene:not([updating])', {
    state: 'visible',
    timeout: 20000,
  });
}

export async function testSnapshot(page: Page, name: string) {
  await expect(page).toHaveScreenshot(`${name.replace(/\s+/g, '-')}.png`, {
    fullPage: true,
  });
}

export async function runAccessibilityCheck(page: Page) {
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
}
