import Polygon from '@arcgis/core/geometry/Polygon';

import { ASSETHEADINGFIELD, ASSETLAYERMAPID, ASSETLONGITUDEFIELD } from '@/config/assetLayer';
import { generateArcadeHeadingScript } from '@/config/generateArcadeHeadingScript';
import { BasemapConfig, MapProjection } from '@/config/map';

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

export async function applyPolarHeadingCorrection(
  mapView: __esri.MapView,
  mapProjection: MapProjection,
) {
  if (mapProjection === MapProjection.WORLD) {
    return;
  }

  const FeatureLayer = mapView.map.findLayerById(ASSETLAYERMAPID) as __esri.FeatureLayer;
  const featureLayerView = await mapView.whenLayerView(FeatureLayer);

  const { renderer } = featureLayerView.layer;
  if (renderer.type === 'simple' || renderer.type === 'unique-value') {
    const rotationVisualVariable = (
      renderer as __esri.SimpleRenderer | __esri.UniqueValueRenderer
    ).visualVariables.find((visVar) => visVar.type === 'rotation') as
      | __esri.RotationVariable
      | undefined;

    if (rotationVisualVariable) {
      rotationVisualVariable.valueExpression = generateArcadeHeadingScript({
        longitudeField: ASSETLONGITUDEFIELD,
        headingField: ASSETHEADINGFIELD,
        projection: mapProjection,
      });
      rotationVisualVariable.valueExpressionTitle = 'Heading Correction';
      rotationVisualVariable.rotationType = 'geographic';
    }
  }
}

export function applyBasemapConstraints(mapView: __esri.MapView, basemapConfig: BasemapConfig) {
  mapView.constraints = {
    geometry: basemapConfig.viewExtent,
    snapToZoom: false,
    rotationEnabled: false,
  };
}
