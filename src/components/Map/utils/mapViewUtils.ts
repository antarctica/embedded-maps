import TileLayer from '@arcgis/core/layers/TileLayer';

import { ASSETHEADINGFIELD, ASSETLONGITUDEFIELD } from '@/lib/config/assetLayer';
import { BasemapConfig, MapProjection } from '@/lib/config/basemap';
import { generateArcadeHeadingScript } from '@/lib/config/generateArcadeHeadingScript';
/**
 * Applies heading correction for assets in polar map projections
 * @param featureLayer - The ESRI FeatureLayer instance
 * @param mapProjection - The current map projection
 * @throws {Error} If feature layer is not found
 */
export async function applyPolarHeadingCorrection(
  featureLayer: __esri.FeatureLayer,
  mapProjection: MapProjection,
): Promise<void> {
  if (!requiresHeadingCorrection(mapProjection)) {
    return;
  }

  await applyRotationToRenderer(featureLayer, mapProjection);
}

/**
 * Type guard to check if projection requires heading correction
 * @param mapProjection - The map projection to check
 * @returns Type narrowed projection if it requires heading correction
 */
function requiresHeadingCorrection(
  mapProjection: MapProjection,
): mapProjection is MapProjection.ANTARCTIC | MapProjection.ARCTIC {
  return mapProjection === MapProjection.ANTARCTIC || mapProjection === MapProjection.ARCTIC;
}

/**
 * Applies rotation settings to the renderer if applicable
 */
async function applyRotationToRenderer(
  featureLayer: __esri.FeatureLayer,
  mapProjection: MapProjection.ANTARCTIC | MapProjection.ARCTIC,
): Promise<void> {
  const { renderer } = featureLayer;

  if (!renderer || !isCompatibleRenderer(renderer)) {
    return;
  }

  const rotationVisualVariable = findRotationVariable(renderer);
  if (rotationVisualVariable) {
    updateRotationSettings(rotationVisualVariable, mapProjection);
  }
}

/**
 * Checks if the renderer is compatible for rotation
 */
function isCompatibleRenderer(
  renderer: __esri.Renderer,
): renderer is __esri.SimpleRenderer | __esri.UniqueValueRenderer {
  return renderer.type === 'simple' || renderer.type === 'unique-value';
}

/**
 * Finds the rotation variable in the renderer
 */
function findRotationVariable(
  renderer: __esri.SimpleRenderer | __esri.UniqueValueRenderer,
): __esri.RotationVariable | undefined {
  return (renderer.visualVariables ?? []).find((visVar) => visVar.type === 'rotation') as
    | __esri.RotationVariable
    | undefined;
}

/**
 * Updates the rotation settings for the visual variable
 */
function updateRotationSettings(
  rotationVisualVariable: __esri.RotationVariable,
  mapProjection: MapProjection.ANTARCTIC | MapProjection.ARCTIC,
): void {
  rotationVisualVariable.valueExpression = generateArcadeHeadingScript({
    longitudeField: ASSETLONGITUDEFIELD,
    headingField: ASSETHEADINGFIELD,
    projection: mapProjection,
  });
  rotationVisualVariable.valueExpressionTitle = 'Heading Correction';
  rotationVisualVariable.rotationType = 'geographic';
}

export function applyBasemapConstraints(mapView: __esri.MapView, basemapConfig: BasemapConfig) {
  if (!mapView.map?.basemap) {
    return;
  }

  // turn on resampling for basemap layers
  for (const layer of mapView.map.basemap.baseLayers) {
    if (layer instanceof TileLayer) {
      layer.set('resampling', true);
    }
  }

  mapView.constraints = {
    geometry: basemapConfig.viewExtent,
    snapToZoom: true,
    rotationEnabled: false,
  };
}
