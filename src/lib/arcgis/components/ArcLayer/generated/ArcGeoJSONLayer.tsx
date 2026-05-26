import type { GeoJSONLayerProperties } from '@arcgis/core/layers/GeoJSONLayer';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcGeoJSONLayer = createLayer<
  typeof GeoJSONLayer,
  GeoJSONLayerProperties,
  GeoJSONLayer
>(GeoJSONLayer);
