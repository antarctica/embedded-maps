import type { ElevationLayerProperties } from '@arcgis/core/layers/ElevationLayer';
import ElevationLayer from '@arcgis/core/layers/ElevationLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcElevationLayer = createLayer<
  typeof ElevationLayer,
  ElevationLayerProperties,
  ElevationLayer
>(ElevationLayer);
