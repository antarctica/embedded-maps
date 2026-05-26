import type { WMSLayerProperties } from '@arcgis/core/layers/WMSLayer';
import WMSLayer from '@arcgis/core/layers/WMSLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcWMSLayer = createLayer<typeof WMSLayer, WMSLayerProperties, WMSLayer>(WMSLayer);
