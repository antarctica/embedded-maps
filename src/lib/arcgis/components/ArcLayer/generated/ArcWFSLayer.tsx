import type { WFSLayerProperties } from '@arcgis/core/layers/WFSLayer';
import WFSLayer from '@arcgis/core/layers/WFSLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcWFSLayer = createLayer<typeof WFSLayer, WFSLayerProperties, WFSLayer>(WFSLayer);
