import { useMemo } from 'react';

import { type MapCommand } from '@/lib/arcgis/typings/commandtypes';
import { BBox, MapPoint } from '@/lib/config/schema';

import { AddBboxCommand } from '../commands/AddBboxCommand';
import { AddGraticuleCommand } from '../commands/AddGraticuleCommand';
import { AddMapPointsCommand } from '../commands/AddMapPointsCommand';
import { AddPortalLayersCommand } from '../commands/AddPortalLayersCommand';
import { FindAssetCommand } from '../commands/FindAssetCommand';
import { MapCenterCommand } from '../commands/MapCenterCommand';

interface UseMapCommandsProps {
  initialAssetIds?: string[];
  initialAssetTypes?: string[];
  initialCenter?: [number, number];
  initialBbox?: BBox[];
  initialPoints?: MapPoint[];
  initialPortalItemIds?: string[];
  bboxForceRegionalExtent?: boolean;
  initialShowAssetPopup?: boolean;
  initialShowLayerManager?: boolean;
  initialShowGraticule?: boolean;
}

export function useMapCommands({
  initialAssetIds,
  initialAssetTypes,
  initialCenter,
  initialBbox,
  initialPoints,
  initialPortalItemIds,
  bboxForceRegionalExtent,
  initialShowAssetPopup,
  initialShowGraticule,
}: UseMapCommandsProps): MapCommand[] {
  return useMemo((): MapCommand[] => {
    const commands: MapCommand[] = [];

    if (initialCenter) {
      commands.push(new MapCenterCommand(initialCenter));
    }
    if (
      (initialAssetIds && initialAssetIds.length) ||
      (initialAssetTypes && initialAssetTypes.length)
    ) {
      commands.push(
        new FindAssetCommand({
          assetIds: initialAssetIds,
          assetTypes: initialAssetTypes,
          showAssetPopup: initialShowAssetPopup,
        }),
      );
    }
    if (initialBbox) {
      commands.push(new AddBboxCommand(initialBbox, bboxForceRegionalExtent));
    } else if (initialPoints) {
      commands.push(new AddMapPointsCommand(initialPoints));
    }
    if (initialPortalItemIds && initialPortalItemIds.length > 0) {
      commands.push(new AddPortalLayersCommand(initialPortalItemIds));
    }
    if (initialShowGraticule) {
      commands.push(new AddGraticuleCommand(initialShowGraticule));
    }
    return commands;
  }, [
    initialAssetIds,
    initialAssetTypes,
    initialCenter,
    initialBbox,
    initialPoints,
    initialPortalItemIds,
    bboxForceRegionalExtent,
    initialShowAssetPopup,
    initialShowGraticule,
  ]);
}
