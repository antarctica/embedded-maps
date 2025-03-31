import EsriMap from '@arcgis/core/Map';

import { MapCommand, ViewCommand } from '@/lib/arcgis/typings/commandtypes';
import {
  getBasemapConfigForMapProjection,
  getMapProjectionFromPosition,
} from '@/lib/config/basemap';

import { applyBasemapConstraints } from '../utils/mapViewUtils';
export class MapCenterCommand implements MapCommand {
  constructor(private center: [number, number]) {}

  async executeOnMap(map: EsriMap): Promise<ViewCommand | void> {
    const mapProjection = getMapProjectionFromPosition(this.center);
    const basemapConfig = getBasemapConfigForMapProjection(mapProjection);
    map.basemap = basemapConfig.basemap;

    return {
      executeOnView: async (mapView: __esri.MapView) => {
        mapView.set('rotation', basemapConfig.rotation);
        applyBasemapConstraints(mapView, basemapConfig);
        await mapView.goTo({ target: this.center }, { animate: false });
      },
    };
  }
}
