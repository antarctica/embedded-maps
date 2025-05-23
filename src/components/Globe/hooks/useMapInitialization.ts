import EsriMap from '@arcgis/core/Map';
import { useEffect } from 'react';

import { BBox } from '@/components/Map/utils/bboxUtils';
import { useMapCommandExecuter } from '@/lib/arcgis/hooks/useMapCommandExecuter';

import { AddAssetLayerCommand } from '../commands/AddAssetLayerCommand';
import { AddBboxVisualizationCommand } from '../commands/AddBboxVisualizationCommand';
import { SetupGlobeMapCommand } from '../commands/SetupGlobeMapCommand';

interface UseMapInitializationResult {
  map: EsriMap | null;
  error: Error | null;
  isLoading: boolean;
}

interface UseMapInitializationProps {
  initialAssetId?: string;
  initialBbox?: BBox[];
}

export function useMapInitialization({
  initialAssetId,
  initialBbox,
}: UseMapInitializationProps): UseMapInitializationResult {
  const { map, setMap, error, isExecuting, executeCommands } = useMapCommandExecuter();

  useEffect(() => {
    if (!map) {
      const mapInstance = new EsriMap();
      setMap(mapInstance);
      const commands = [new SetupGlobeMapCommand()];

      if (initialAssetId) {
        commands.push(new AddAssetLayerCommand(initialAssetId));
      }

      if (initialBbox) {
        commands.push(new AddBboxVisualizationCommand(initialBbox));
      }

      executeCommands(mapInstance, commands);
    }
  }, [map, initialAssetId, initialBbox, executeCommands, setMap]);

  return {
    map,
    error,
    isLoading: isExecuting,
  };
}
