import { useMemo } from 'react';

import { type MapCommand } from '@/lib/arcgis/typings/commandtypes';
import { BBox, MapPoint } from '@/lib/config/schema';

import { AddAssetLayerCommand } from '../commands/AddAssetLayerCommand';
import { AddBboxVisualizationCommand } from '../commands/AddBboxVisualizationCommand';
import { AddPointsLayerCommand } from '../commands/AddPointsLayerCommand';
import { SetupGlobeMapCommand } from '../commands/SetupGlobeMapCommand';

interface UseMapCommandsProps {
  initialAssetIds?: string[];
  initialBbox?: BBox[];
  initialPoints?: MapPoint[];
  initialAssetTypes?: string[];
}

export function useMapCommands({
  initialAssetIds,
  initialBbox,
  initialPoints,
  initialAssetTypes,
}: UseMapCommandsProps): MapCommand[] {
  return useMemo((): MapCommand[] => {
    const commands: MapCommand[] = [new SetupGlobeMapCommand()];

    if (
      (initialAssetIds && initialAssetIds.length) ||
      (initialAssetTypes && initialAssetTypes.length)
    ) {
      commands.push(
        new AddAssetLayerCommand({ assetIds: initialAssetIds, assetTypes: initialAssetTypes }),
      );
    }

    if (initialBbox) {
      commands.push(new AddBboxVisualizationCommand(initialBbox));
    }

    if (initialPoints) {
      commands.push(new AddPointsLayerCommand(initialPoints));
    }
    return commands;
  }, [initialAssetIds, initialAssetTypes, initialBbox, initialPoints]);
}
