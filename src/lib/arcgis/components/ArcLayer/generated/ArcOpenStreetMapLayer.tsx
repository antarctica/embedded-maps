import type { OpenStreetMapLayerProperties } from '@arcgis/core/layers/OpenStreetMapLayer';
import OpenStreetMapLayer from '@arcgis/core/layers/OpenStreetMapLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcOpenStreetMapLayer = createLayer<
  typeof OpenStreetMapLayer,
  OpenStreetMapLayerProperties,
  OpenStreetMapLayer
>(OpenStreetMapLayer);
