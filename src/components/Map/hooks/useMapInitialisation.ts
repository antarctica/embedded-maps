import EsriMap from '@arcgis/core/Map';
import React from 'react';

import { useMapSingleton } from '@/lib/arcgis/hooks/useMapSingleton';
import { MapViewExecuter } from '@/lib/arcgis/typings/commandtypes';
import { BBox, MapPoint } from '@/lib/config/schema';
import { useCallbackRef } from '@/lib/hooks/useCallbackRef';

import { useMapCommands } from './useMapCommands';

interface UseMapInitializationProps {
  initialAssetId?: string;
  initialAssetType?: string;
  initialCenter?: [number, number];
  initialBbox?: BBox[];
  initialPoints?: MapPoint[];
  bboxForceRegionalExtent?: boolean;
  initialShowAssetPopup?: boolean;
  initialShowGraticule?: boolean;
  postLoadCb?: (view?: __esri.MapView) => void;
}

interface UseMapInitializationResult {
  map: EsriMap | null;
  error: Error | null;
  isMapLoading: boolean;
  handleViewReady: (view: __esri.MapView) => Promise<void>;
}

export function useMapInitialisation({
  initialAssetId,
  initialAssetType,
  initialCenter,
  initialBbox,
  initialPoints,
  bboxForceRegionalExtent,
  initialShowAssetPopup,
  initialShowGraticule,
  postLoadCb,
}: UseMapInitializationProps): UseMapInitializationResult {
  const [initialMap] = React.useState(new EsriMap());

  const commands = useMapCommands({
    initialAssetId,
    initialAssetType,
    initialCenter,
    initialBbox,
    initialPoints,
    bboxForceRegionalExtent,
    initialShowAssetPopup,
    initialShowGraticule,
  });
  const { map, postInitCommands, isMapLoading, error } = useMapSingleton(
    commands,
    initialMap,
    'map',
  );

  const handleViewReady = useCallbackRef(async (view: __esri.MapView) => {
    await Promise.all(postInitCommands.map((cmd) => (cmd.executeOnView as MapViewExecuter)(view)));
    postLoadCb?.(view);
  });

  return {
    map,
    error,
    isMapLoading,
    handleViewReady,
  };
}
