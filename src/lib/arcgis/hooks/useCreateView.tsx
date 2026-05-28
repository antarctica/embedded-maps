import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';
import { useCallback, useContext, useEffect, useId, useState } from 'react';

import { ArcViewContext } from '../contexts/ArcViewContext/ArcViewContext';

export function useCreateView(id?: string) {
  const [view, setView] = useState<MapView | SceneView>();

  const internalId = useId();
  const mapId = id ?? internalId;

  const mountedViewsContext = useContext(ArcViewContext);
  const { onViewMount, onViewUnmount } = mountedViewsContext ?? {};

  const onViewReady = useCallback(
    (view: MapView | SceneView) => {
      setView(view);
      onViewMount?.(view, mapId);
    },
    [mapId, onViewMount],
  );

  useEffect(
    () => () => {
      onViewUnmount?.(mapId);
    },
    [mapId, onViewUnmount],
  );

  return { view, mapId, onViewReady };
}
