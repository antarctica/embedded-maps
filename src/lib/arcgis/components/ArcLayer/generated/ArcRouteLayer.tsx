import type { RouteLayerProperties } from '@arcgis/core/layers/RouteLayer';
import RouteLayer from '@arcgis/core/layers/RouteLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcRouteLayer = createLayer<typeof RouteLayer, RouteLayerProperties, RouteLayer>(
  RouteLayer,
);
