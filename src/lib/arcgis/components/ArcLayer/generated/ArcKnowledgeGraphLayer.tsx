import type { KnowledgeGraphLayerProperties } from '@arcgis/core/layers/KnowledgeGraphLayer';
import KnowledgeGraphLayer from '@arcgis/core/layers/KnowledgeGraphLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcKnowledgeGraphLayer = createLayer<
  typeof KnowledgeGraphLayer,
  KnowledgeGraphLayerProperties,
  KnowledgeGraphLayer
>(KnowledgeGraphLayer);
