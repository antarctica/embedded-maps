import type { GroupLayerProperties } from '@arcgis/core/layers/GroupLayer';
import GroupLayer from '@arcgis/core/layers/GroupLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcGroupLayer = createLayer<typeof GroupLayer, GroupLayerProperties, GroupLayer>(
  GroupLayer,
);
