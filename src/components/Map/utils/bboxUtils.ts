import Polygon from '@arcgis/core/geometry/Polygon';

import { MapProjection } from '@/config/basemap';

interface RingCoordinates {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
  densificationSteps: number;
}

/**
 * Creates a densified edge between two longitudes at a given latitude.
 * @param startLon - The starting longitude.
 * @param endLon - The ending longitude.
 * @param latitude - The latitude at which to create the edge.
 * @param vertices - The number of vertices to create.
 * @returns An array of coordinates representing the densified edge.
 */
export function createLatitudeParallelPoints(
  startLon: number,
  endLon: number,
  latitude: number,
  vertices: number,
): number[][] {
  const coordinates: number[][] = [];
  for (let i = 0; i < vertices; i++) {
    const fraction = i / (vertices - 1);
    const lon = startLon + (endLon - startLon) * fraction;
    coordinates.push([lon, latitude]);
  }
  return coordinates;
}

function createPolarBbox({
  minLon,
  maxLon,
  minLat,
  maxLat,
  densificationSteps,
}: RingCoordinates): number[][] {
  const ring: number[][] = [];

  // Bottom edge
  ring.push(...createLatitudeParallelPoints(minLon, maxLon, minLat, densificationSteps));

  // Top edge (reverse)
  ring.push(...createLatitudeParallelPoints(minLon, maxLon, maxLat, densificationSteps).reverse());

  ring.push(ring[0]); // Close the ring
  return ring;
}

function createAntimeridianRings({
  minLon,
  maxLon,
  minLat,
  maxLat,
  densificationSteps,
}: RingCoordinates): number[][][] {
  // halve the densification steps and round up to the nearest integer
  const halfDensificationSteps = Math.ceil(densificationSteps / 2);

  // Western polygon (minLon to 180)
  const westRing = createPolarBbox({
    minLon,
    maxLon: 180,
    minLat,
    maxLat,
    densificationSteps: halfDensificationSteps,
  });

  // Eastern polygon (-180 to maxLon)
  const eastRing = createPolarBbox({
    minLon: -180,
    maxLon,
    minLat,
    maxLat,
    densificationSteps: halfDensificationSteps,
  });

  return [westRing, eastRing];
}

function createStandardBbox(bbox: [number, number, number, number]): number[][][] {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  return [
    [
      [minLon, minLat],
      [maxLon, minLat],
      [maxLon, maxLat],
      [minLon, maxLat],
      [minLon, minLat],
    ],
  ];
}

export function createGeometryFromBBox(
  bbox: [number, number, number, number],
  projection: MapProjection,
  densificationSteps: number = 50,
): __esri.Polygon {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const crossesAntimeridian = minLon > maxLon;

  let rings: number[][][] = [];

  if (projection === MapProjection.ANTARCTIC || projection === MapProjection.ARCTIC) {
    const coordinates: RingCoordinates = { minLon, maxLon, minLat, maxLat, densificationSteps };
    rings = crossesAntimeridian
      ? createAntimeridianRings(coordinates)
      : [createPolarBbox(coordinates)];
  } else {
    rings = createStandardBbox(bbox);
  }

  return new Polygon({
    rings,
    spatialReference: { wkid: 4326 }, // WGS 84
  });
}
