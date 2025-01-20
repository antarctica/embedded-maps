import EsriMap from '@arcgis/core/Map';
import { useEffect, useRef } from 'react';

import { MapCommand, PostInitCommand } from '@/arcgis/typings/commandtypes';
import { FindAssetCommand } from '@/components/Map/commands/FindAssetCommand';
import { InitializeMapCommand } from '@/components/Map/commands/InitializeMapCommand';

import { useMapCommandExecuter } from '../../../arcgis/hooks/useMapCommandExecuter';
import { AddBboxCommand } from '../commands/AddBboxCommand';

interface UseMapInitializationProps {
  initialAssetId?: string;
  initialCenter?: [number, number];
  initialBbox?: [number, number, number, number];
  onViewReady?: (view: __esri.MapView) => void;
}

interface UseMapInitializationResult {
  map: EsriMap | null;
  error: Error | null;
  isLoading: boolean;
  handleViewReady: (view: __esri.MapView) => void;
}

export function useMapInitialization({
  initialAssetId,
  initialCenter,
  initialBbox,
  onViewReady,
}: UseMapInitializationProps): UseMapInitializationResult {
  const { map, setMap, error, isExecuting, executeCommands } = useMapCommandExecuter();
  const postInitCommandsRef = useRef<PostInitCommand[]>([]);

  useEffect(() => {
    if (!map) {
      const mapInstance = new EsriMap();
      setMap(mapInstance);
      const commands: MapCommand[] = [new InitializeMapCommand(mapInstance, initialCenter)];

      if (initialAssetId && !initialBbox) {
        commands.push(new FindAssetCommand(mapInstance, initialAssetId));
      }
      if (initialBbox) {
        commands.push(new AddBboxCommand(mapInstance, initialBbox));
      }

      executeCommands(commands).then((results) => {
        const postInitCommands = results.filter(
          (result): result is PostInitCommand => result != null,
        );
        postInitCommandsRef.current = postInitCommands;
      });
    }
  }, [map, initialCenter, initialAssetId, initialBbox, executeCommands, setMap]);

  const handleViewReady = (view: __esri.MapView) => {
    // Execute any pending post-init commands
    postInitCommandsRef.current.forEach((cmd) => cmd.execute(view));

    onViewReady?.(view);
  };

  return {
    map,
    error,
    isLoading: isExecuting,
    handleViewReady,
  };
}
