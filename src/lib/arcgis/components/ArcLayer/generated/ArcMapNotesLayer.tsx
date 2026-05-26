import type { MapNotesLayerProperties } from '@arcgis/core/layers/MapNotesLayer';
import MapNotesLayer from '@arcgis/core/layers/MapNotesLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcMapNotesLayer = createLayer<
  typeof MapNotesLayer,
  MapNotesLayerProperties,
  MapNotesLayer
>(MapNotesLayer);
