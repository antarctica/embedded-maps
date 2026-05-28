import type { CSVLayerProperties } from '@arcgis/core/layers/CSVLayer';
import CSVLayer from '@arcgis/core/layers/CSVLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcCSVLayer = createLayer<typeof CSVLayer, CSVLayerProperties, CSVLayer>(CSVLayer);
