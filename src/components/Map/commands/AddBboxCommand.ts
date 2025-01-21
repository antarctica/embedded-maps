import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import EsriMap from '@arcgis/core/Map';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';

import { MapCommand, ViewCommand } from '@/arcgis/typings/commandtypes';
import { getBasemapConfigForMapProjection, getMapProjectionFromBbox } from '@/config/map';

import { applyBasemapConstraints, createGeometryFromBBox } from '../utils';
export class AddBboxCommand implements MapCommand {
  constructor(
    private map: EsriMap,
    private bbox?: [number, number, number, number],
  ) {}

  async executeOnMap(map: EsriMap): Promise<ViewCommand | void> {
    if (this.bbox) {
      const mapProjection = getMapProjectionFromBbox(this.bbox);
      const basemapConfig = getBasemapConfigForMapProjection(mapProjection);
      map.basemap = basemapConfig.basemap;

      const bboxGraphic = new Graphic({
        geometry: createGeometryFromBBox(this.bbox, mapProjection),
        symbol: new SimpleFillSymbol({
          color: [204, 0, 51, 0.2], // #CC0033 @ 80% opacity
          outline: {
            color: [204, 0, 51, 1], // #CC0033
            width: 1,
          },
        }),
      });

      const bboxGraphicsLayer = new GraphicsLayer({
        graphics: [bboxGraphic],
      });
      this.map.add(bboxGraphicsLayer);

      return {
        executeOnView: (mapView: __esri.MapView) => {
          mapView.set('rotation', basemapConfig.rotation);
          applyBasemapConstraints(mapView, basemapConfig);
          mapView.goTo({ target: basemapConfig.viewExtent }, { animate: false });
        },
      };
    }
  }
}
