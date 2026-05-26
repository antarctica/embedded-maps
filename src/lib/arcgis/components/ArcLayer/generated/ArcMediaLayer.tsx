import type { MediaLayerProperties } from '@arcgis/core/layers/MediaLayer';
import MediaLayer from '@arcgis/core/layers/MediaLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcMediaLayer = createLayer<typeof MediaLayer, MediaLayerProperties, MediaLayer>(
  MediaLayer,
);
