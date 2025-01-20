import { Point } from '@arcgis/core/geometry';
import EsriMap from '@arcgis/core/Map';

import { MapCommand, PostInitCommand } from '@/arcgis/typings/commandtypes';
import { getBasemapConfigForMapProjection, getMapProjectionFromPosition } from '@/config/map';

import { applyBasemapConstraints } from '../utils';
export class InitializeMapCommand implements MapCommand {
  constructor(
    private map: EsriMap,
    private center?: [number, number],
  ) {}

  async execute(): Promise<PostInitCommand | void> {
    if (this.center) {
      const mapProjection = getMapProjectionFromPosition(this.center);
      const basemapConfig = getBasemapConfigForMapProjection(mapProjection);
      this.map.basemap = basemapConfig.basemap;

      const mapCenter = new Point({
        longitude: this.center[0],
        latitude: this.center[1],
      });
      return {
        execute: (mapView: __esri.MapView) => {
          mapView.set('rotation', basemapConfig.rotation);
          applyBasemapConstraints(mapView, basemapConfig);
          mapView.goTo({ target: mapCenter }, { animate: false });
        },
      };
    }
  }
}
