import type { UnknownLayerProperties } from '@arcgis/core/layers/UnknownLayer';
import UnknownLayer from '@arcgis/core/layers/UnknownLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcUnknownLayer = createLayer<
  typeof UnknownLayer,
  UnknownLayerProperties,
  UnknownLayer
>(UnknownLayer);
