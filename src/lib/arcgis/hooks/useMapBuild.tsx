import type EsriMap from '@arcgis/core/Map';
import * as React from 'react';

import { useCallbackRef } from '@/lib/hooks/useCallbackRef';

import type { MapCommand, ViewCommand } from '../typings/commandtypes';
import { executeMapCommands } from '../util/executeMapCommands';

interface MapBuild {
  key: string;
  map: EsriMap;
  postInitCommands: ViewCommand[];
  error: Error | null;
}

export interface UseMapBuildResult {
  map: EsriMap | null;
  /** Commands still waiting for a view. */
  postInitCommands: ViewCommand[];
  isMapLoading: boolean;
  error: Error | null;
}

const NO_COMMANDS: ViewCommand[] = [];

/**
 * Builds a map by running commands against it, once per rebuild key. Pass whatever
 * the map depends on as the key; a build already in flight for that key is never
 * started twice. The map goes to a view, which destroys it, so callers do not own it.
 */
export function useMapBuild(
  commands: MapCommand[] | undefined,
  createMap: () => EsriMap,
  rebuildKey: string = 'default',
): UseMapBuildResult {
  const [build, setBuild] = React.useState<MapBuild | null>(null);
  const buildingKey = React.useRef<string | null>(null);
  const create = useCallbackRef(createMap);

  React.useEffect(() => {
    if (!commands || buildingKey.current === rebuildKey) return;
    buildingKey.current = rebuildKey;

    const map = create();
    executeMapCommands(map, commands).then(({ viewCommands, errors }) => {
      // Superseded by a later key
      if (buildingKey.current !== rebuildKey) return;

      setBuild({
        key: rebuildKey,
        map,
        postInitCommands: viewCommands,
        error: errors[0] ?? null,
      });
    });
  }, [commands, rebuildKey, create]);

  const current = build?.key === rebuildKey ? build : null;

  return {
    map: current?.map ?? null,
    postInitCommands: current?.postInitCommands ?? NO_COMMANDS,
    error: current?.error ?? null,
    isMapLoading: current === null,
  };
}
