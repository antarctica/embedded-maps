import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';
import React from 'react';

type MountedViewsContextValue = {
  views: { [id: string]: MapView | SceneView | undefined };
  onViewMount: (map: MapView | SceneView, id: string) => void;
  onViewUnmount: (id: string) => void;
};

export const ArcViewContext = React.createContext<MountedViewsContextValue | undefined>(undefined);
