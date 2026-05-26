import type { ImageryLayerProperties } from '@arcgis/core/layers/ImageryLayer';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcImageryLayer = createLayer<
  typeof ImageryLayer,
  ImageryLayerProperties,
  ImageryLayer
>(ImageryLayer);
