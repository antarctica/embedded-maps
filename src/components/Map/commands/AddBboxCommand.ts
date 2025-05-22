import Graphic from '@arcgis/core/Graphic';
import EsriMap from '@arcgis/core/Map';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';

import { ScaleAwarePolygonLayer } from '@/lib/arcgis/customlayers/ScaleAwarePolygonLayer/ScaleAwarePolygonLayer';
import { MapCommand, ViewCommand } from '@/lib/arcgis/typings/commandtypes';
import {
  calculateEnvelopeBbox,
  getBasemapConfigForMapProjection,
  getMapProjectionFromBbox,
} from '@/lib/config/basemap';

import { BBox, createGeometryFromBBox } from '../utils/bboxUtils';
import { applyBasemapConstraints } from '../utils/mapViewUtils';
export class AddBboxCommand implements MapCommand {
  private bboxGraphicsLayer = new ScaleAwarePolygonLayer();

  constructor(
    private bbox: BBox[],
    private showRegion?: boolean,
  ) {}

  async executeOnMap(map: EsriMap): Promise<ViewCommand | void> {
    const envelopeBbox = calculateEnvelopeBbox(this.bbox);
    const mapProjection = getMapProjectionFromBbox(envelopeBbox);
    const basemapConfig = getBasemapConfigForMapProjection(mapProjection);
    map.basemap = basemapConfig.basemap;

    for (const bbox of this.bbox) {
      const bboxPolygonGraphic = new Graphic({
        geometry: createGeometryFromBBox(bbox, mapProjection),
        symbol: new SimpleFillSymbol({
          color: [204, 0, 51, 0.2], // #CC0033 @ 80% opacity
          outline: {
            color: [204, 0, 51, 1], // #CC0033
            width: 1,
          },
        }),
      });

      this.bboxGraphicsLayer.add(bboxPolygonGraphic);
    }

    map.add(this.bboxGraphicsLayer);

    return {
      executeOnView: async (mapView: __esri.MapView) => {
        mapView.set('rotation', basemapConfig.rotation);
        applyBasemapConstraints(mapView, basemapConfig);
        if (this.showRegion) {
          await mapView.goTo({ target: basemapConfig.viewExtent }, { animate: false });
        } else {
          const bboxGeometry = createGeometryFromBBox(envelopeBbox, mapProjection);
          await mapView.goTo({ target: bboxGeometry }, { animate: false });
        }
      },
    };
  }
}
