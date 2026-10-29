import type EsriMap from '@arcgis/core/Map';

import type { MapCommand, ViewCommand } from '@/lib/arcgis/typings/commandtypes';

export interface MapCommandResults {
  viewCommands: ViewCommand[];
  errors: Error[];
}

/**
 * Runs each command against the map in order, collecting the commands that still
 * need a view. A failing command is recorded and the remaining commands still run,
 * so one bad layer cannot leave the map unbuilt.
 */
export async function executeMapCommands(
  map: EsriMap,
  commands: MapCommand[],
): Promise<MapCommandResults> {
  const viewCommands: ViewCommand[] = [];
  const errors: Error[] = [];

  for (const command of commands) {
    try {
      const viewCommand = await command.executeOnMap(map);
      if (viewCommand) {
        viewCommands.push(viewCommand);
      }
    } catch (err) {
      errors.push(err instanceof Error ? err : new Error('An error occurred'));
    }
  }

  return { viewCommands, errors };
}
