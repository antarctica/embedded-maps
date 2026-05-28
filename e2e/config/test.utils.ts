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
    timeout: options?.timeout ?? 30000,
  });

  // Wait for the mapview container to signal it's ready via React state
  // this accounts for the fact that the mapview is technically ready before all layers are loaded
  await page.waitForSelector('arcgis-map[data-ready="true"]', {
    state: 'visible',
    timeout: options?.timeout ?? 30000,
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
    timeout: options?.timeout ?? 30000,
  });

  // Wait for the scene to signal it's ready via React state
  // this accounts for the fact that the scene is technically ready before all layers are loaded
  await page.waitForSelector('arcgis-scene[data-ready="true"]', {
    state: 'visible',
    timeout: options?.timeout ?? 30000,
  });

  await page.waitForTimeout(100);

  // If additional delay is provided, wait for that amount of time
  if (options?.additionalDelay) {
    await page.waitForTimeout(options.additionalDelay);
  }
}

export async function waitForAttribution(page: Page, options?: { timeout?: number }) {
  await expect(page.getByTestId('map-attribution')).not.toHaveText('', {
    timeout: options?.timeout ?? 30000,
  });
}

/**
 * Waits for the map and any optional companion components (Globe SceneView,
 * attribution) to be ready before a snapshot or accessibility scan. Keeps these
 * checks in one place so callers don't have to remember which waits to apply.
 *
 * `waitForMapReady` is called unconditionally because it gates on the React
 * shell mounting (`[data-testid="map-container"]`). After it resolves, the rest
 * of the tree is in the DOM, so the conditional `count()` checks below are
 * reliable. If we count() first, `page.goto`'s load event can fire before React
 * has rendered, leading to false negatives and blank screenshots.
 */
async function waitForSnapshotReady(page: Page, options?: { timeout?: number }) {
  await waitForMapReady(page, options);
  if ((await page.locator('arcgis-scene').count()) > 0) {
    await waitForSceneReady(page, options);
  }
  if ((await page.getByTestId('map-attribution').count()) > 0) {
    await waitForAttribution(page, options);
  }
}

export async function testSnapshot(page: Page, name: string) {
  await waitForSnapshotReady(page);
  await expect(page).toHaveScreenshot(`${name.replace(/\s+/g, '-')}.png`, {
    fullPage: true,
    maxDiffPixels: 200,
  });
}

export async function runAccessibilityCheck(page: Page) {
  await waitForSnapshotReady(page);
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
