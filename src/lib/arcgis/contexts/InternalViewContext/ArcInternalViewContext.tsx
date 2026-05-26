import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';
import React from 'react';

export const MapInternalContext = React.createContext<MapView | SceneView | undefined>(undefined);
