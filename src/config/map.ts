import Basemap from '@arcgis/core/Basemap';
import Polygon from '@arcgis/core/geometry/Polygon';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';

import { generateCircleRings } from '@/components/Map/utils/mapViewUtils';

export enum MapProjection {
  ANTARCTIC = 'antarctic',
  ARCTIC = 'arctic',
  WORLD = 'world',
  SOUTH_GEORGIA = 'south_georgia',
}

export function getMapProjectionFromPosition([longitude, latitude]: [
  number,
  number,
]): MapProjection {
  switch (true) {
    case latitude >= 50:
      return MapProjection.ARCTIC;
    case latitude <= -50:
      if (
        latitude >= -55.200717 &&
        latitude <= -53.641972 &&
        longitude >= -38.643677 &&
        longitude <= -35.271423
      ) {
        return MapProjection.SOUTH_GEORGIA;
      }
      return MapProjection.ANTARCTIC;
    default:
      return MapProjection.WORLD;
  }
}

export function getMapProjectionFromBbox([minX, minY, maxX, maxY]: [
  number,
  number,
  number,
  number,
]): MapProjection {
  switch (true) {
    case minX >= -38.643677 && maxX <= -35.271423 && minY >= -55.200717 && maxY <= -53.641972:
      return MapProjection.SOUTH_GEORGIA;
    case maxY <= -50 && minY <= -50:
      return MapProjection.ANTARCTIC;
    case minY >= 50 && maxY >= 50:
      return MapProjection.ARCTIC;
    default:
      return MapProjection.WORLD;
  }
}

export interface BasemapConfig {
  basemap: Basemap;
  rotation: number;
  viewExtent: Polygon;
  spatialReference: SpatialReference;
}

const ANTARCTIC_BASEMAP_CONFIG: BasemapConfig = {
  basemap: new Basemap({
    portalItem: {
      id: '435e23642bf94b83b07d1d3fc0c5c9d5',
    },
  }),
  rotation: 0,
  viewExtent: new Polygon({
    rings: [generateCircleRings(64, 5000000)],
    spatialReference: new SpatialReference({ wkid: 3031 }),
  }),
  spatialReference: new SpatialReference({ wkid: 3031 }),
};

const ARCTIC_BASEMAP_CONFIG: BasemapConfig = {
  basemap: new Basemap({
    portalItem: {
      id: 'beee46578bc44e0bb47901f04400588a',
    },
  }),
  rotation: 150,
  viewExtent: new Polygon({
    rings: [generateCircleRings(64, 3500000, [2000000, 2000000])],
    spatialReference: new SpatialReference({ wkid: 5936 }),
  }),
  spatialReference: new SpatialReference({ wkid: 5936 }),
};

const WORLD_BASEMAP_CONFIG: BasemapConfig = {
  basemap: new Basemap({
    portalItem: {
      id: '67ab7f7c535c4687b6518e6d2343e8a2',
    },
  }),
  rotation: 0,
  viewExtent: new Polygon({
    rings: [
      [
        [-20026376.39 * 16, -20048966.1],
        [-20026376.39 * 16, 20048966.1],
        [20026376.39 * 16, 20048966.1],
        [20026376.39 * 16, -20048966.1],
        [-20026376.39 * 16, -20048966.1],
      ],
    ],
    spatialReference: new SpatialReference({ wkid: 3857 }),
  }),
  spatialReference: new SpatialReference({ wkid: 3857 }),
};

const SOUTH_GEORGIA_BASEMAP_CONFIG: BasemapConfig = {
  basemap: new Basemap({
    portalItem: {
      id: 'a9d30e0b6f2d47528e3c2f938420f630',
    },
  }),
  rotation: 0,
  viewExtent: new Polygon({
    rings: [
      [
        [-38.643677, -55.200717],
        [-38.643677, -53.641972],
        [-35.271423, -53.641972],
        [-35.271423, -55.200717],
        [-38.643677, -55.200717],
      ],
    ],
    spatialReference: SpatialReference.WGS84,
  }),
  spatialReference: new SpatialReference({ wkid: 3762 }),
};

export function getBasemapConfigForMapProjection(mapProjection: MapProjection): BasemapConfig {
  switch (mapProjection) {
    case MapProjection.ANTARCTIC:
      return ANTARCTIC_BASEMAP_CONFIG;
    case MapProjection.ARCTIC:
      return ARCTIC_BASEMAP_CONFIG;
    case MapProjection.SOUTH_GEORGIA:
      return SOUTH_GEORGIA_BASEMAP_CONFIG;
    case MapProjection.WORLD:
      return WORLD_BASEMAP_CONFIG;
  }
}

/**
 * Calculates the corrected heading based on the map projection.
 * @param {Object} position - The position object with latitude and longitude.
 * @param {number} heading - The original heading in degrees.
 * @param {MapCRS} projection - The map projection to use.
 * @param {number} [symbolRotationToUp=0] - The symbol rotation to up in degrees.
 * @returns {number} The corrected heading in degrees, normalized to 0-360 range.
 */
export function calculateCorrectedHeading(
  position: { latitude: number; longitude: number },
  heading: number,
  projection: MapProjection,
  symbolRotationToUp: number = 0,
): number {
  if (projection === MapProjection.WORLD || projection === MapProjection.SOUTH_GEORGIA) {
    return (heading + symbolRotationToUp) % 360;
  }
  const bearingToPole = calculateProjectedBearingToPole(position, projection);

  return (heading + bearingToPole + 360) % 360;
}

/**
 * Calculates the projected bearing to the pole.
 * @param {Object} position - The position object with latitude and longitude.
 * @param {MapProjection.ANTARCTIC | MapProjection.ARCTIC} projection - The map projection to use.
 * @returns {number} The bearing to the pole in degrees, normalized to 0-360 range.
 */
export function calculateProjectedBearingToPole(
  position: { latitude: number; longitude: number },
  projection: MapProjection.ANTARCTIC | MapProjection.ARCTIC,
): number {
  const bearing = position.longitude;
  const centralMeridianCorrection = projection === MapProjection.ANTARCTIC ? 0 : -45;
  return (bearing + centralMeridianCorrection + 360) % 360; // Normalize to 0-360 range
}

/**
 * Converts radians to degrees.
 * @param {number} radians - The angle in radians.
 * @returns {number} The angle in degrees.
 */
export function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Converts degrees to radians.
 * @param {number} degrees - The angle in degrees.
 * @returns {number} The angle in radians.
 */
export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
