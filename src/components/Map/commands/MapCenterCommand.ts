import { Point } from '@arcgis/core/geometry';
import EsriMap from '@arcgis/core/Map';

import { MapCommand, ViewCommand } from '@/arcgis/typings/commandtypes';
import { getBasemapConfigForMapProjection, getMapProjectionFromPosition } from '@/config/basemap';

import { applyBasemapConstraints } from '../utils/mapViewUtils';
export class MapCenterCommand implements MapCommand {
  constructor(private center: [number, number]) {}

  async executeOnMap(map: EsriMap): Promise<ViewCommand | void> {
    const mapProjection = getMapProjectionFromPosition(this.center);
    const basemapConfig = getBasemapConfigForMapProjection(mapProjection);
    map.basemap = basemapConfig.basemap;

    const mapCenter = new Point({
      longitude: this.center[0],
      latitude: this.center[1],
    });
    return {
      executeOnView: (mapView: __esri.MapView) => {
        mapView.set('rotation', basemapConfig.rotation);
        applyBasemapConstraints(mapView, basemapConfig);
        mapView.goTo({ target: mapCenter }, { animate: false });
      },
    };
  }
}
