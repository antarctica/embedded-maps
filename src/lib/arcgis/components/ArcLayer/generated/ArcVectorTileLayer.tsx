import type { VectorTileLayerProperties } from '@arcgis/core/layers/VectorTileLayer';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcVectorTileLayer = createLayer<
  typeof VectorTileLayer,
  VectorTileLayerProperties,
  VectorTileLayer
>(VectorTileLayer);
