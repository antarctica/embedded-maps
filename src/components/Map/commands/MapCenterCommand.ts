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

    let [longitude, latitude] = this.center;
    if (latitude === 90 || latitude === -90) {
      // bump the latitude by a tiny amount to prevent polar projection issues
      latitude += 0.1;
    }
    if (longitude === 180 || longitude === -180) {
      // bump the longitude by a tiny amount to prevent polar projection issues
      longitude += 0.1;
    }

    const mapCenter = new Point({
      longitude,
      latitude,
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
