import type { DimensionLayerProperties } from '@arcgis/core/layers/DimensionLayer';
import DimensionLayer from '@arcgis/core/layers/DimensionLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcDimensionLayer = createLayer<
  typeof DimensionLayer,
  DimensionLayerProperties,
  DimensionLayer
>(DimensionLayer);
