import type { GraphicsLayerProperties } from '@arcgis/core/layers/GraphicsLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcGraphicsLayer = createLayer<
  typeof GraphicsLayer,
  GraphicsLayerProperties,
  GraphicsLayer
>(GraphicsLayer);
