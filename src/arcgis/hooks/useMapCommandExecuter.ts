import EsriMap from '@arcgis/core/Map';
import { useCallback, useState } from 'react';

import { MapCommand, PostInitCommand } from '@/arcgis/typings/commandtypes';

export function useMapCommandExecuter() {
  const [map, setMap] = useState<EsriMap | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeCommand = useCallback(async (command: MapCommand) => {
    setIsExecuting(true);
    try {
      const result = await command.execute();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsExecuting(false);
    }
  }, []);

  const executeCommands = useCallback(
    async (commands: MapCommand[]) => {
      const results: PostInitCommand[] = [];
      for (const command of commands) {
        const result = await executeCommand(command);
        if (result) {
          results.push(result);
        }
      }
      return results;
    },
    [executeCommand],
  );

  return {
    map,
    setMap,
    error,
    isExecuting,
    executeCommands,
  };
}
