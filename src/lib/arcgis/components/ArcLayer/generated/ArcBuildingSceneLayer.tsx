import type { BuildingSceneLayerProperties } from '@arcgis/core/layers/BuildingSceneLayer';
import BuildingSceneLayer from '@arcgis/core/layers/BuildingSceneLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcBuildingSceneLayer = createLayer<
  typeof BuildingSceneLayer,
  BuildingSceneLayerProperties,
  BuildingSceneLayer
>(BuildingSceneLayer);
