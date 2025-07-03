import { useMemo } from 'react';

import { type MapCommand } from '@/lib/arcgis/typings/commandtypes';
import { BBox, MapPoint } from '@/lib/config/schema';

import { AddAssetLayerCommand } from '../commands/AddAssetLayerCommand';
import { AddBboxVisualizationCommand } from '../commands/AddBboxVisualizationCommand';
import { AddPointsLayerCommand } from '../commands/AddPointsLayerCommand';
import { SetupGlobeMapCommand } from '../commands/SetupGlobeMapCommand';

interface UseMapCommandsProps {
  initialAssetId?: string;
  initialBbox?: BBox[];
  initialPoints?: MapPoint[];
  initialAssetType?: string;
}

export function useMapCommands({
  initialAssetId,
  initialBbox,
  initialPoints,
  initialAssetType,
}: UseMapCommandsProps): MapCommand[] {
  return useMemo((): MapCommand[] => {
    const commands: MapCommand[] = [new SetupGlobeMapCommand()];

    if (initialAssetId || initialAssetType) {
      commands.push(
        new AddAssetLayerCommand({ assetId: initialAssetId, assetType: initialAssetType }),
      );
    }

    if (initialBbox) {
      commands.push(new AddBboxVisualizationCommand(initialBbox));
    }

    if (initialPoints) {
      commands.push(new AddPointsLayerCommand(initialPoints));
    }
    return commands;
  }, [initialAssetId, initialAssetType, initialBbox, initialPoints]);
}
