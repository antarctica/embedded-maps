import type { PointCloudLayerProperties } from '@arcgis/core/layers/PointCloudLayer';
import PointCloudLayer from '@arcgis/core/layers/PointCloudLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcPointCloudLayer = createLayer<
  typeof PointCloudLayer,
  PointCloudLayerProperties,
  PointCloudLayer
>(PointCloudLayer);
