import type { WCSLayerProperties } from '@arcgis/core/layers/WCSLayer';
import WCSLayer from '@arcgis/core/layers/WCSLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcWCSLayer = createLayer<typeof WCSLayer, WCSLayerProperties, WCSLayer>(WCSLayer);
