import EsriMap from '@arcgis/core/Map';
import React from 'react';

import { FindAssetCommand } from '@/components/Map/commands/FindAssetCommand';
import { MapCenterCommand } from '@/components/Map/commands/MapCenterCommand';
import { useMapCommandExecuter } from '@/lib/arcgis/hooks/useMapCommandExecuter';
import { MapCommand, ViewCommand } from '@/lib/arcgis/typings/commandtypes';
import { BBox, MapPoint } from '@/lib/config/schema';

import { AddBboxCommand } from '../commands/AddBboxCommand';
import { AddMapPointsCommand } from '../commands/AddMapPointsCommand';

interface UseMapInitializationProps {
  initialAssetId?: string;
  initialAssetType?: string;
  initialCenter?: [number, number];
  initialBbox?: BBox[];
  initialPoints?: MapPoint[];
  bboxForceRegionalExtent?: boolean;
  initialShowAssetPopup?: boolean;
  onViewReady?: (view: __esri.MapView) => void;
}

interface UseMapInitializationResult {
  map: EsriMap | null;
  error: Error | null;
  isMapLoading: boolean;
  isViewReady: boolean;
  handleViewReady: (view: __esri.MapView) => Promise<void>;
}

export function useMapInitialization({
  initialAssetId,
  initialAssetType,
  initialCenter,
  initialBbox,
  initialPoints,
  bboxForceRegionalExtent,
  initialShowAssetPopup,
}: UseMapInitializationProps): UseMapInitializationResult {
  const { map, setMap, error, isExecuting, executeCommands } = useMapCommandExecuter();
  const postInitCommandsRef = React.useRef<ViewCommand[]>([]);
  const [isViewReady, setIsViewReady] = React.useState(false);

  React.useEffect(() => {
    if (!map) {
      const mapInstance = new EsriMap();
      setMap(mapInstance);
      const commands: MapCommand[] = [];

      if (initialCenter) {
        commands.push(new MapCenterCommand(initialCenter));
      }
      if (initialAssetId || initialAssetType) {
        commands.push(
          new FindAssetCommand({
            assetId: initialAssetId,
            assetType: initialAssetType,
            showAssetPopup: initialShowAssetPopup,
          }),
        );
      }
      if (initialBbox) {
        commands.push(new AddBboxCommand(initialBbox, bboxForceRegionalExtent));
      } else if (initialPoints) {
        commands.push(new AddMapPointsCommand(initialPoints));
      }
      executeCommands(mapInstance, commands).then((results) => {
        const postInitCommands = results.filter((result): result is ViewCommand => result != null);
        postInitCommandsRef.current = postInitCommands;
      });
    }
  }, [
    map,
    initialCenter,
    initialAssetId,
    initialAssetType,
    initialBbox,
    initialPoints,
    bboxForceRegionalExtent,
    initialShowAssetPopup,
    executeCommands,
    setMap,
  ]);

  const handleViewReady = React.useCallback(async (view: __esri.MapView) => {
    // Execute any pending post-init commands
    await Promise.all(postInitCommandsRef.current.map((cmd) => cmd.executeOnView(view)));
    setIsViewReady(true);
  }, []);

  return {
    map,
    error,
    isMapLoading: isExecuting,
    isViewReady,
    handleViewReady,
  };
}
