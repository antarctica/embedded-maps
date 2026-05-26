import type { StreamLayerProperties } from '@arcgis/core/layers/StreamLayer';
import StreamLayer from '@arcgis/core/layers/StreamLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcStreamLayer = createLayer<typeof StreamLayer, StreamLayerProperties, StreamLayer>(
  StreamLayer,
);
