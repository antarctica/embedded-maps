import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import EsriMap from '@arcgis/core/Map';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';

import { MapCommand, ViewCommand } from '@/lib/arcgis/typings/commandtypes';
import {
  calculateEnvelopeBbox,
  getBasemapConfigForMapProjection,
  getMapProjectionFromBbox,
} from '@/lib/config/basemap';

import { BBox, createGeometryFromBBox } from '../utils/bboxUtils';
import { applyBasemapConstraints } from '../utils/mapViewUtils';

export class AddBboxCommand implements MapCommand {
  constructor(
    private bbox: BBox[],
    private showRegion?: boolean,
  ) {}

  async executeOnMap(map: EsriMap): Promise<ViewCommand | void> {
    console.log('this.bbox', this.bbox);
    const envelopeBbox = calculateEnvelopeBbox(this.bbox);
    const mapProjection = getMapProjectionFromBbox(envelopeBbox);
    const basemapConfig = getBasemapConfigForMapProjection(mapProjection);
    map.basemap = basemapConfig.basemap;

    const bboxGraphics: __esri.Graphic[] = [];

    for (const bbox of this.bbox) {
      const bboxGraphic = new Graphic({
        geometry: createGeometryFromBBox(bbox, mapProjection),
        symbol: new SimpleFillSymbol({
          color: [204, 0, 51, 0.2], // #CC0033 @ 80% opacity
          outline: {
            color: [204, 0, 51, 1], // #CC0033
            width: 1,
          },
        }),
      });
      bboxGraphics.push(bboxGraphic);
    }
    const bboxGraphicsLayer = new GraphicsLayer({
      graphics: bboxGraphics,
    });
    map.add(bboxGraphicsLayer);

    return {
      executeOnView: async (mapView: __esri.MapView) => {
        mapView.set('rotation', basemapConfig.rotation);
        applyBasemapConstraints(mapView, basemapConfig);
        if (this.showRegion) {
          await mapView.goTo({ target: basemapConfig.viewExtent }, { animate: false });
        } else {
          await mapView.goTo({ target: envelopeBbox }, { animate: false });
        }
      },
    };
  }
}
