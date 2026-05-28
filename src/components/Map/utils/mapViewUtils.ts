import type FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import TileLayer from '@arcgis/core/layers/TileLayer';
import type Renderer from '@arcgis/core/renderers/Renderer';
import type SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import type UniqueValueRenderer from '@arcgis/core/renderers/UniqueValueRenderer';
import type RotationVariable from '@arcgis/core/renderers/visualVariables/RotationVariable';
import type MapView from '@arcgis/core/views/MapView';

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
  featureLayer: FeatureLayer,
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
  featureLayer: FeatureLayer,
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
  renderer: Renderer,
): renderer is SimpleRenderer | UniqueValueRenderer {
  return renderer.type === 'simple' || renderer.type === 'unique-value';
}

/**
 * Finds the rotation variable in the renderer
 */
function findRotationVariable(
  renderer: SimpleRenderer | UniqueValueRenderer,
): RotationVariable | undefined {
  return (renderer.visualVariables ?? []).find((visVar) => visVar.type === 'rotation') as
    | RotationVariable
    | undefined;
}

/**
 * Updates the rotation settings for the visual variable
 */
function updateRotationSettings(
  rotationVisualVariable: RotationVariable,
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

export function applyBasemapConstraints(mapView: MapView, basemapConfig: BasemapConfig) {
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
