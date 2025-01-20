import EsriMap from '@arcgis/core/Map';
import { useEffect } from 'react';

import { useMapCommandExecuter } from '../../../arcgis/hooks/useMapCommandExecuter';
import { InitializeMapCommand } from '../commands/InitializeMapCommand';

interface UseMapInitializationResult {
  map: EsriMap | null;
  error: Error | null;
  isLoading: boolean;
}

interface UseMapInitializationProps {
  initialAssetId?: string;
}

export function useMapInitialization({
  initialAssetId,
}: UseMapInitializationProps): UseMapInitializationResult {
  const { map, setMap, error, isExecuting, executeCommands } = useMapCommandExecuter();

  useEffect(() => {
    if (!map) {
      const mapInstance = new EsriMap();
      setMap(mapInstance);
      const commands = [new InitializeMapCommand(mapInstance, initialAssetId)];
      executeCommands(commands);
    }
  }, [map, initialAssetId, executeCommands, setMap]);

  return {
    map,
    error,
    isLoading: isExecuting,
  };
}
