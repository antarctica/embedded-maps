import type { VoxelLayerProperties } from '@arcgis/core/layers/VoxelLayer';
import VoxelLayer from '@arcgis/core/layers/VoxelLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcVoxelLayer = createLayer<typeof VoxelLayer, VoxelLayerProperties, VoxelLayer>(
  VoxelLayer,
);
