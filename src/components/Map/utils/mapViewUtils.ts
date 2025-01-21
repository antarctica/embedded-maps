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

export async function applyPolarHeadingCorrection(
  mapView: __esri.MapView,
  mapProjection: MapProjection,
) {
  if (mapProjection === MapProjection.WORLD || mapProjection === MapProjection.SOUTH_GEORGIA) {
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
