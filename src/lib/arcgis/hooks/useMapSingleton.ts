import EsriMap from '@arcgis/core/Map';
import { useEffect, useState } from 'react';

import { useMapCommandExecuter } from '@/lib/arcgis/hooks/useMapCommandExecuter';
import type { MapCommand, ViewCommand } from '@/lib/arcgis/typings/commandtypes';
import { MapSingleton } from '@/lib/arcgis/util/mapSingleton';

interface UseMapSingletonResult {
  map: EsriMap | null;
  postInitCommands: ViewCommand[];
  isMapLoading: boolean;
  error: Error | null;
}

export function useMapSingleton(
  commands: MapCommand[],
  initialMap?: EsriMap | __esri.WebMap,
  id?: string,
): UseMapSingletonResult {
  const { error, isExecuting, executeCommands } = useMapCommandExecuter();
  const mapInstance = MapSingleton.getInstance(id);

  const [map, setMap] = useState<EsriMap | null>(() => mapInstance.getMap());
  const [postInitCommands, setPostInitCommands] = useState<ViewCommand[]>(() =>
    mapInstance.getPostInitCommands(),
  );
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (map) return; // Already have a map

    let isCancelled = false;

    const initializeMap = async () => {
      setIsInitializing(true);

      try {
        const result = await mapInstance.getOrCreateMap(commands, executeCommands, initialMap);

        if (!isCancelled) {
          setMap(result.map);
          setPostInitCommands(result.postInitCommands);
        }
      } catch (initError) {
        if (!isCancelled) {
          console.error('Map initialization error:', initError);
        }
      } finally {
        if (!isCancelled) {
          setIsInitializing(false);
        }
      }
    };

    initializeMap();

    return () => {
      isCancelled = true;
    };
  }, [map, commands, executeCommands, initialMap, mapInstance]);

  return {
    map,
    postInitCommands,
    isMapLoading: isExecuting || isInitializing,
    error,
  };
}
