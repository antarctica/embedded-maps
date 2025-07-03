import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import EsriMap from '@arcgis/core/Map';
import FillSymbol3DLayer from '@arcgis/core/symbols/FillSymbol3DLayer.js';
import MeshSymbol3D from '@arcgis/core/symbols/MeshSymbol3D.js';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';

import { createMeshGeometryFromBBox } from '@/components/Map/utils/bboxUtils';
import { MapCommand } from '@/lib/arcgis/typings/commandtypes';
import { BBox } from '@/lib/config/schema';

// Below this threshold, we use a point to represent the bbox on the globe
const AREA_THRESHOLD = 20; // Square degrees

export class AddBboxVisualizationCommand implements MapCommand {
  constructor(private bbox: BBox[]) {}

  private calculateArea(bbox: BBox): number {
    const [minX, minY, maxX, maxY] = bbox;
    return Math.abs((maxX - minX) * (maxY - minY));
  }

  async executeOnMap(map: EsriMap) {
    const graphicsLayer = new GraphicsLayer({
      id: 'bboxVisualizationLayer',
    });

    let meshGraphic: Graphic;
    let outlineGraphic: Graphic;

    for (const bbox of this.bbox) {
      const area = this.calculateArea(bbox);
      if (area > AREA_THRESHOLD) {
        // Create polygon for large areas
        const { mesh, outline } = createMeshGeometryFromBBox(bbox);

        meshGraphic = new Graphic({
          geometry: mesh,
          symbol: new MeshSymbol3D({
            symbolLayers: [
              new FillSymbol3DLayer({
                material: {
                  color: [255, 0, 0, 0.4],
                },
              }),
            ],
          }),
        });

        outlineGraphic = new Graphic({
          geometry: outline,
          symbol: new SimpleLineSymbol({
            color: 'red',
            width: 3,
          }),
        });

        graphicsLayer.add(meshGraphic);
        graphicsLayer.add(outlineGraphic);
      } else {
        // Create center point for small areas
        const [minX, minY, maxX, maxY] = bbox;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        const point = new Point({
          longitude: centerX,
          latitude: centerY,
        });

        const symbol = new SimpleMarkerSymbol({
          color: '#CC0033',
          outline: {
            width: 1,
            color: 'white',
          },
          size: 6,
        });

        const pointGraphic = new Graphic({
          geometry: point,
          symbol,
        });
        graphicsLayer.add(pointGraphic);
      }
    }

    map.add(graphicsLayer);
  }
}
