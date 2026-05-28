import type { GeoRSSLayerProperties } from '@arcgis/core/layers/GeoRSSLayer';
import GeoRSSLayer from '@arcgis/core/layers/GeoRSSLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcGeoRSSLayer = createLayer<typeof GeoRSSLayer, GeoRSSLayerProperties, GeoRSSLayer>(
  GeoRSSLayer,
);
