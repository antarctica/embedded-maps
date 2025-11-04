import EsriMap from '@arcgis/core/Map';
import React from 'react';

import { useMapSingleton } from '@/lib/arcgis/hooks/useMapSingleton';
import { SceneViewExecuter } from '@/lib/arcgis/typings/commandtypes';
import { BBox, MapPoint } from '@/lib/config/schema';
import { useCallbackRef } from '@/lib/hooks/useCallbackRef';

import { useMapCommands } from './useMapCommands';

interface UseMapInitializationProps {
  initialAssetIds?: string[];
  initialAssetTypes?: string[];
  initialBbox?: BBox[];
  initialPoints?: MapPoint[];
  postLoadCb?: (view: __esri.SceneView) => void;
}

interface UseMapInitializationResult {
  map: EsriMap | null;
  error: Error | null;
  isMapLoading: boolean;
  handleViewReady: (view: __esri.SceneView) => Promise<void>;
}

export function useMapInitialisation({
  initialAssetIds,
  initialAssetTypes,
  initialBbox,
  initialPoints,
  postLoadCb,
}: UseMapInitializationProps): UseMapInitializationResult {
  const [initialMap] = React.useState(new EsriMap());

  const commands = useMapCommands({
    initialAssetIds,
    initialAssetTypes,
    initialBbox,
    initialPoints,
  });
  const { map, postInitCommands, isMapLoading, error } = useMapSingleton(
    commands,
    initialMap,
    'globe',
  );

  const handleViewReady = useCallbackRef(async (view: __esri.SceneView) => {
    await Promise.all(
      postInitCommands.map((cmd) => (cmd.executeOnView as SceneViewExecuter)(view)),
    );
    postLoadCb?.(view);
  });

  return {
    map,
    error,
    isMapLoading,
    handleViewReady,
  };
}
