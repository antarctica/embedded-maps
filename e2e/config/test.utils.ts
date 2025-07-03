import AxeBuilder from '@axe-core/playwright';
import { expect, Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

export async function waitForMapReady(
  page: Page,
  options?: { timeout?: number; additionalDelay?: number },
) {
  // Wait for the map container to be present
  await page.waitForSelector('[data-testid="map-container"]', { state: 'visible' });

  // Wait for the mapview to have finished its network requests and initialisation
  await page.waitForSelector('arcgis-map:not([updating])', {
    state: 'visible',
    timeout: options?.timeout ?? 20000,
  });

  // Wait for the mapview container to signal it's ready via React state
  // this accounts for the fact that the mapview is technically ready before all layers are loaded
  await page.waitForSelector('arcgis-map[data-ready="true"]', {
    state: 'visible',
    timeout: options?.timeout ?? 20000,
  });

  // wait for very short time to tick over to when all layers are happy.
  await page.waitForTimeout(100);

  // If additional delay is provided, wait for that amount of time
  if (options?.additionalDelay) {
    await page.waitForTimeout(options.additionalDelay);
  }
}

export async function waitForSceneReady(
  page: Page,
  options?: { timeout?: number; additionalDelay?: number },
) {
  // Wait for the scene  to be present
  await page.waitForSelector('arcgis-scene', { state: 'visible' });

  // Wait for the scene to have finished its network requests and initialisation
  await page.waitForSelector('arcgis-scene:not([updating])', {
    state: 'visible',
    timeout: options?.timeout ?? 20000,
  });

  // Wait for the scene to signal it's ready via React state
  // this accounts for the fact that the scene is technically ready before all layers are loaded
  await page.waitForSelector('arcgis-scene[data-ready="true"]', {
    state: 'visible',
    timeout: options?.timeout ?? 20000,
  });

  await page.waitForTimeout(100);

  // If additional delay is provided, wait for that amount of time
  if (options?.additionalDelay) {
    await page.waitForTimeout(options.additionalDelay);
  }
}

export async function testSnapshot(page: Page, name: string) {
  await expect(page).toHaveScreenshot(`${name.replace(/\s+/g, '-')}.png`, {
    fullPage: true,
    maxDiffPixels: 200,
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
