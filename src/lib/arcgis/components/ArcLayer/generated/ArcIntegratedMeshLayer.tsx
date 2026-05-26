import type { IntegratedMeshLayerProperties } from '@arcgis/core/layers/IntegratedMeshLayer';
import IntegratedMeshLayer from '@arcgis/core/layers/IntegratedMeshLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcIntegratedMeshLayer = createLayer<
  typeof IntegratedMeshLayer,
  IntegratedMeshLayerProperties,
  IntegratedMeshLayer
>(IntegratedMeshLayer);
