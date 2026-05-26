import type { KMLLayerProperties } from '@arcgis/core/layers/KMLLayer';
import KMLLayer from '@arcgis/core/layers/KMLLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcKMLLayer = createLayer<typeof KMLLayer, KMLLayerProperties, KMLLayer>(KMLLayer);
