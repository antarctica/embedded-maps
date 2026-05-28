import type { BingMapsLayerProperties } from '@arcgis/core/layers/BingMapsLayer';
import BingMapsLayer from '@arcgis/core/layers/BingMapsLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcBingMapsLayer = createLayer<
  typeof BingMapsLayer,
  BingMapsLayerProperties,
  BingMapsLayer
>(BingMapsLayer);
