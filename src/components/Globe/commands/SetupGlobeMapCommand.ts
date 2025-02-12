import Basemap from '@arcgis/core/Basemap';
import EsriMap from '@arcgis/core/Map';

import { MapCommand } from '@/arcgis/typings/commandtypes';

export class SetupGlobeMapCommand implements MapCommand {
  async executeOnMap(map: EsriMap): Promise<void> {
    map.basemap = Basemap.fromId('satellite');
  }
}
