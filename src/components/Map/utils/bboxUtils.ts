import Polygon from '@arcgis/core/geometry/Polygon';

import { MapProjection } from '@/config/map';

interface RingCoordinates {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
  densificationSteps: number;
}

function createDensifiedEdge(
  startLon: number,
  endLon: number,
  latitude: number,
  steps: number,
): number[][] {
  const coordinates: number[][] = [];
  for (let i = 0; i <= steps; i++) {
    const fraction = i / steps;
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
  ring.push(...createDensifiedEdge(minLon, maxLon, minLat, densificationSteps));

  // Top edge (reverse)
  ring.push(...createDensifiedEdge(minLon, maxLon, maxLat, densificationSteps).reverse());

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
  // Western polygon (minLon to 180)
  const westRing = createPolarBbox({
    minLon,
    maxLon: 180,
    minLat,
    maxLat,
    densificationSteps,
  });

  // Eastern polygon (-180 to maxLon)
  const eastRing = createPolarBbox({
    minLon: -180,
    maxLon,
    minLat,
    maxLat,
    densificationSteps,
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
