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
  await page.waitForSelector('arcgis-map:not([updating])', {
    state: 'visible',
    timeout: options?.timeout ?? 20000,
  });

  // Wait for the mapview container to signal it's ready via React state
  await page.waitForSelector('[data-testid="map-container"][data-ready="true"]', {
    state: 'visible',
    timeout: options?.timeout ?? 20000,
  });

  // If additional delay is provided, wait for that amount of time
  if (options?.additionalDelay) {
    await page.waitForTimeout(options.additionalDelay);
  }
}

export async function waitForSceneReady(
  page: Page,
  options?: { timeout?: number; additionalDelay?: number },
) {
  await page.waitForSelector('arcgis-scene', { state: 'visible' });
  await page.waitForSelector('arcgis-scene:not([updating])', {
    state: 'visible',
    timeout: options?.timeout ?? 20000,
  });

  // If additional delay is provided, wait for that amount of time
  if (options?.additionalDelay) {
    await page.waitForTimeout(options.additionalDelay);
  }
}

export async function testSnapshot(page: Page, name: string) {
  await expect(page).toHaveScreenshot(`${name.replace(/\s+/g, '-')}.png`, {
    fullPage: true,
    maxDiffPixels: 50,
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
