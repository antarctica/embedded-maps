import AxeBuilder from '@axe-core/playwright';
import { expect, Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

export async function waitForMapReady(page: Page) {
  // Wait for the map container to be present
  await page.waitForSelector('[data-testid="map-container"]', { state: 'visible' });
  await page.waitForSelector('arcgis-map:not([updating])', {
    state: 'visible',
    timeout: 20000,
  });

  // Wait for the map to signal it's ready via React state
  await page.waitForSelector('[data-testid="map-container"][data-ready="true"]', {
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

export function getHarPath(relativePath: string) {
  // Get the directory path of the current module
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFilePath);
  // Go up one directory from config to e2e, then into hars
  return path.join(currentDir, '../hars', relativePath);
}
