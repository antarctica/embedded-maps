import EsriMap from '@arcgis/core/Map';
import { useEffect } from 'react';

import { useMapCommandExecuter } from '@/lib/arcgis/hooks/useMapCommandExecuter';
import { BBox, MapPoint } from '@/lib/config/schema';

import { AddAssetLayerCommand } from '../commands/AddAssetLayerCommand';
import { AddBboxVisualizationCommand } from '../commands/AddBboxVisualizationCommand';
import { AddPointsLayerCommand } from '../commands/AddPointsLayerCommand';
import { SetupGlobeMapCommand } from '../commands/SetupGlobeMapCommand';

interface UseMapInitializationResult {
  map: EsriMap | null;
  error: Error | null;
  isLoading: boolean;
}

interface UseMapInitializationProps {
  initialAssetId?: string;
  initialBbox?: BBox[];
  initialPoints?: MapPoint[];
}

export function useMapInitialization({
  initialAssetId,
  initialBbox,
  initialPoints,
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

      if (initialPoints) {
        commands.push(new AddPointsLayerCommand(initialPoints));
      }

      executeCommands(mapInstance, commands);
    }
  }, [map, initialAssetId, initialBbox, initialPoints, executeCommands, setMap]);

  return {
    map,
    error,
    isLoading: isExecuting,
  };
}
