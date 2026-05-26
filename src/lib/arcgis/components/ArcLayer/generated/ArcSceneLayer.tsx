import type { SceneLayerProperties } from '@arcgis/core/layers/SceneLayer';
import SceneLayer from '@arcgis/core/layers/SceneLayer';

import { createLayer } from '../../../util/createLayer';
export const ArcSceneLayer = createLayer<typeof SceneLayer, SceneLayerProperties, SceneLayer>(
  SceneLayer,
);
