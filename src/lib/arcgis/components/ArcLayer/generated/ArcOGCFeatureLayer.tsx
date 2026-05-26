import type { OGCFeatureLayerProperties } from '@arcgis/core/layers/OGCFeatureLayer';
import OGCFeatureLayer from '@arcgis/core/layers/OGCFeatureLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcOGCFeatureLayer = createLayer<
  typeof OGCFeatureLayer,
  OGCFeatureLayerProperties,
  OGCFeatureLayer
>(OGCFeatureLayer);
