/// <reference types="@arcgis/map-components/types/react" />
import { test } from '@playwright/test';

import {
  runAccessibilityCheck,
  testSnapshot,
  waitForMapReady,
  waitForSceneReady,
} from '../config/test.utils';

function createPointsParam(points: unknown[]): string {
  return `?points=${encodeURIComponent(JSON.stringify(points))}`;
}

const pointTestCases = [
  {
    name: 'single coordinate pair',
    params: createPointsParam([[-90, -0]]),
  },
  {
    name: 'multiple coordinate pairs',
    params: createPointsParam([
      [0, -55],
      [50, -85],
    ]),
  },
  {
    name: 'single styled point',
    params: createPointsParam([{ longitude: 106.8, latitude: -75.1, color: 'green', size: 15 }]),
  },
  {
    name: 'mixed coordinate pairs and styled points',
    params: createPointsParam([
      [0, -55],
      [50, -85],
      { longitude: 106.8, latitude: -75.1, color: 'green', size: 15 },
    ]),
  },
  {
    name: 'multiple styled points with different colors and sizes',
    params: createPointsParam([
      { longitude: 167.15, latitude: -77.53, color: '#ff4400', size: 12 },
      { longitude: -68.125, latitude: -67.567, color: '#0044ff', size: 15 },
    ]),
  },
  {
    name: 'antarctic research stations',
    params: createPointsParam([
      { longitude: 167.15, latitude: -77.53, color: '#ff4400', size: 12 },
      { longitude: -68.125, latitude: -67.567, color: '#0044ff', size: 15 },
      { longitude: 106.8, latitude: -75.1, color: '#44ff00', size: 15 },
    ]),
  },
  {
    name: 'arctic research stations',
    params: createPointsParam([
      { longitude: -62.35, latitude: 82.5, color: '#ff6600', size: 12 }, // Alert Station, Canada
      { longitude: 11.93, latitude: 78.92, color: '#00aaff', size: 15 }, // Ny-Ålesund Station, Svalbard
    ]),
  },
];

test.describe.parallel('Map Points', () => {
  for (const testCase of pointTestCases) {
    test.describe(testCase.name, () => {
      test.describe('default view', () => {
        test.beforeEach(async ({ page }) => {
          await page.goto(`/${testCase.params}&globe-overview`);
          await waitForMapReady(page);
          await waitForSceneReady(page);
        });

        test('snapshot', async ({ page }) => {
          await testSnapshot(page, `${testCase.name}-default`);
        });

        test('should not have any automatically detectable accessibility issues', async ({
          page,
        }) => {
          await runAccessibilityCheck(page);
        });
      });
    });
  }
});
