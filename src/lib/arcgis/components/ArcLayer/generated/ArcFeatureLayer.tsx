import type { FeatureLayerProperties } from '@arcgis/core/layers/FeatureLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcFeatureLayer = createLayer<
  typeof FeatureLayer,
  FeatureLayerProperties,
  FeatureLayer
>(FeatureLayer);
