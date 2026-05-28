import type { SubtypeGroupLayerProperties } from '@arcgis/core/layers/SubtypeGroupLayer';
import SubtypeGroupLayer from '@arcgis/core/layers/SubtypeGroupLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcSubtypeGroupLayer = createLayer<
  typeof SubtypeGroupLayer,
  SubtypeGroupLayerProperties,
  SubtypeGroupLayer
>(SubtypeGroupLayer);
