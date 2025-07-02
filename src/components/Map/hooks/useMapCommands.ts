import { useMemo } from 'react';

import { type MapCommand } from '@/lib/arcgis/typings/commandtypes';
import { BBox, MapPoint } from '@/lib/config/schema';

import { AddBboxCommand } from '../commands/AddBboxCommand';
import { AddMapPointsCommand } from '../commands/AddMapPointsCommand';
import { FindAssetCommand } from '../commands/FindAssetCommand';
import { MapCenterCommand } from '../commands/MapCenterCommand';

interface UseMapCommandsProps {
  initialAssetId?: string;
  initialAssetType?: string;
  initialCenter?: [number, number];
  initialBbox?: BBox[];
  initialPoints?: MapPoint[];
  bboxForceRegionalExtent?: boolean;
  initialShowAssetPopup?: boolean;
  initialShowLayerManager?: boolean;
}

export function useMapCommands({
  initialAssetId,
  initialAssetType,
  initialCenter,
  initialBbox,
  initialPoints,
  bboxForceRegionalExtent,
  initialShowAssetPopup,
}: UseMapCommandsProps): MapCommand[] {
  return useMemo((): MapCommand[] => {
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
    return commands;
  }, [
    initialAssetId,
    initialAssetType,
    initialCenter,
    initialBbox,
    initialPoints,
    bboxForceRegionalExtent,
    initialShowAssetPopup,
  ]);
}
