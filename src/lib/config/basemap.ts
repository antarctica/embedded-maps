import Basemap from '@arcgis/core/Basemap';
import { Polygon, SpatialReference } from '@arcgis/core/geometry';

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
    case latitude >= 60:
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

export interface BasemapConfig {
  basemap: Basemap;
  rotation: number;
  viewExtent: Polygon;
  spatialReference: SpatialReference;
}

/**
 * Generates a circle of points around a center point.
 * @param {number} numVertices - The number of vertices to generate.
 * @param {number} radius - The radius of the circle.
 * @param {Array<number>} [center=[0, 0]] - The center point of the circle.
 * @returns {Array<Array<number>>} An array of points representing the circle.
 */
export function generateCircleRings(
  numVertices: number,
  radius: number,
  center: [number, number] = [0, 0],
): number[][] {
  const points: number[][] = [];
  const [centerX, centerY] = center;

  // Generate points around the circle
  for (let i = 0; i <= numVertices; i++) {
    // Use <= to close the circle by repeating the first point
    const angle = (i * 2 * Math.PI) / numVertices;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push([x, y]);
  }
  return points;
}

export const ANTARCTIC_BASEMAP_CONFIG: BasemapConfig = {
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

export const ARCTIC_BASEMAP_CONFIG: BasemapConfig = {
  basemap: new Basemap({
    portalItem: {
      id: 'beee46578bc44e0bb47901f04400588a',
    },
  }),
  rotation: 150,
  viewExtent: new Polygon({
    rings: [generateCircleRings(64, 5000000, [2000000, 2000000])],
    spatialReference: new SpatialReference({ wkid: 5936 }),
  }),
  spatialReference: new SpatialReference({ wkid: 5936 }),
};

export const WORLD_BASEMAP_CONFIG: BasemapConfig = {
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

export const SOUTH_GEORGIA_BASEMAP_CONFIG: BasemapConfig = {
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

export function isPolarProjection(wkid: number): boolean {
  return (
    wkid === ARCTIC_BASEMAP_CONFIG.spatialReference.wkid ||
    wkid === ANTARCTIC_BASEMAP_CONFIG.spatialReference.wkid
  );
}
