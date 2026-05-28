import type { UnsupportedLayerProperties } from '@arcgis/core/layers/UnsupportedLayer';
import UnsupportedLayer from '@arcgis/core/layers/UnsupportedLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcUnsupportedLayer = createLayer<
  typeof UnsupportedLayer,
  UnsupportedLayerProperties,
  UnsupportedLayer
>(UnsupportedLayer);
