import type { LineOfSightLayerProperties } from '@arcgis/core/layers/LineOfSightLayer';
import LineOfSightLayer from '@arcgis/core/layers/LineOfSightLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcLineOfSightLayer = createLayer<
  typeof LineOfSightLayer,
  LineOfSightLayerProperties,
  LineOfSightLayer
>(LineOfSightLayer);
