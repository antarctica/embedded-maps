import type { TileLayerProperties } from '@arcgis/core/layers/TileLayer';
import TileLayer from '@arcgis/core/layers/TileLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcTileLayer = createLayer<typeof TileLayer, TileLayerProperties, TileLayer>(
  TileLayer,
);
