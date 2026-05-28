import type { WMTSLayerProperties } from '@arcgis/core/layers/WMTSLayer';
import WMTSLayer from '@arcgis/core/layers/WMTSLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcWMTSLayer = createLayer<typeof WMTSLayer, WMTSLayerProperties, WMTSLayer>(
  WMTSLayer,
);
