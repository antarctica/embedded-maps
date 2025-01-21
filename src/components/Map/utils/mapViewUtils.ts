import { ASSETHEADINGFIELD, ASSETLAYERMAPID, ASSETLONGITUDEFIELD } from '@/config/assetLayer';
import { BasemapConfig, MapProjection } from '@/config/basemap';
import { generateArcadeHeadingScript } from '@/config/generateArcadeHeadingScript';

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
