import type { WebTileLayerProperties } from '@arcgis/core/layers/WebTileLayer';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcWebTileLayer = createLayer<
  typeof WebTileLayer,
  WebTileLayerProperties,
  WebTileLayer
>(WebTileLayer);
