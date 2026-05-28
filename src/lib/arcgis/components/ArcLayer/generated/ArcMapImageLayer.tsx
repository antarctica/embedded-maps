import type { MapImageLayerProperties } from '@arcgis/core/layers/MapImageLayer';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcMapImageLayer = createLayer<
  typeof MapImageLayer,
  MapImageLayerProperties,
  MapImageLayer
>(MapImageLayer);
