import EsriMap from '@arcgis/core/Map';
import { useEffect, useRef } from 'react';

import { MapCommand, ViewCommand } from '@/arcgis/typings/commandtypes';
import { FindAssetCommand } from '@/components/Map/commands/FindAssetCommand';
import { MapCenterCommand } from '@/components/Map/commands/MapCenterCommand';

import { useMapCommandExecuter } from '../../../arcgis/hooks/useMapCommandExecuter';
import { AddBboxCommand } from '../commands/AddBboxCommand';

interface UseMapInitializationProps {
  initialAssetId?: string;
  initialCenter?: [number, number];
  initialBbox?: [number, number, number, number];
  bboxForceRegionalExtent?: boolean;
  initialShowAssetPopup?: boolean;
  onViewReady?: (view: __esri.MapView) => void;
}

interface UseMapInitializationResult {
  map: EsriMap | null;
  error: Error | null;
  isLoading: boolean;
  handleViewReady: (view: __esri.MapView) => Promise<void>;
}

export function useMapInitialization({
  initialAssetId,
  initialCenter,
  initialBbox,
  bboxForceRegionalExtent,
  initialShowAssetPopup,
}: UseMapInitializationProps): UseMapInitializationResult {
  const { map, setMap, error, isExecuting, executeCommands } = useMapCommandExecuter();
  const postInitCommandsRef = useRef<ViewCommand[]>([]);

  useEffect(() => {
    if (!map) {
      const mapInstance = new EsriMap();
      setMap(mapInstance);
      const commands: MapCommand[] = [];

      if (initialCenter) {
        commands.push(new MapCenterCommand(initialCenter));
      }
      if (initialAssetId) {
        commands.push(new FindAssetCommand(initialAssetId, initialShowAssetPopup));
      }
      if (initialBbox) {
        commands.push(new AddBboxCommand(initialBbox, bboxForceRegionalExtent));
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
    initialBbox,
    bboxForceRegionalExtent,
    initialShowAssetPopup,
    executeCommands,
    setMap,
  ]);

  const handleViewReady = async (view: __esri.MapView) => {
    // Execute any pending post-init commands
    await Promise.all(postInitCommandsRef.current.map((cmd) => cmd.executeOnView(view)));
  };

  return {
    map,
    error,
    isLoading: isExecuting,
    handleViewReady,
  };
}
