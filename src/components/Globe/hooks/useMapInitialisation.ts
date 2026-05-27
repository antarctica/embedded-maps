import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import EsriMap from '@arcgis/core/Map';
import type SceneView from '@arcgis/core/views/SceneView';
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
  postLoadCb?: (view: SceneView) => void;
}

interface UseMapInitializationResult {
  map: EsriMap | null;
  error: Error | null;
  isMapLoading: boolean;
  handleViewReady: (view: SceneView) => Promise<void>;
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

  const handleViewReady = useCallbackRef(async (view: SceneView) => {
    const fatalErrorHandler = reactiveUtils.when(
      () => view.fatalError,
      () => {
        // A fatal error can occur if the webgl context is cleaned up, for example when the browser
        // does automatic memory management. There is a built in method to recover from this.
        console.error('Fatal Error! View has lost its WebGL context. Attempting to recover...');
        view.tryFatalErrorRecovery();
      },
    );
    view.addHandles(fatalErrorHandler);
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
