import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';
import * as React from 'react';

import { ArcViewContext } from '../contexts/ArcViewContext/ArcViewContext';
import { MapInternalContext } from '../contexts/InternalViewContext/ArcInternalViewContext';
type ViewCollection = {
  [id: string]: MapView | SceneView | undefined;
};

export function useViews(): ViewCollection {
  const views = React.useContext(ArcViewContext)?.views;

  if (!views) {
    throw new Error('useView must be used within a valid Provider');
  }

  const viewsSnapshot: ViewCollection = React.useMemo(() => ({ ...views }), [views]);

  return viewsSnapshot;
}

export function useViewById<View extends MapView | SceneView>(id: string): View | undefined {
  const views = useViews();
  return views[id] as View | undefined;
}

export function useCurrentView(defaultView?: MapView | SceneView): MapView | SceneView {
  const view = React.useContext(MapInternalContext);

  if (!view) {
    if (defaultView) return defaultView;
    throw new Error(`useCurrentView must be used in a MapContext`);
  }

  return view;
}

export function useCurrentMapView(): MapView {
  const view = useCurrentView();
  if (view.type === '3d') throw new Error(`useCurrentMapView must be used within a 2D MapContext`);

  return view;
}

export function useCurrentSceneView(): SceneView {
  const view = useCurrentView();
  if (view.type === '2d')
    throw new Error(`useCurrentSceneView must be used within a 3D MapContext`);

  return view;
}
