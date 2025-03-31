import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import EsriMap from '@arcgis/core/Map';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';

import { createGeometryFromBBox } from '@/components/Map/utils/bboxUtils';
import { MapCommand } from '@/lib/arcgis/typings/commandtypes';
import { MapProjection } from '@/lib/config/basemap';

// Below this threshold, we use a point to represent the bbox
const AREA_THRESHOLD = 20; // Square degrees

export class AddBboxVisualizationCommand implements MapCommand {
  constructor(private bbox: [number, number, number, number]) {}

  private calculateArea(): number {
    const [minX, minY, maxX, maxY] = this.bbox;
    return Math.abs((maxX - minX) * (maxY - minY));
  }

  async executeOnMap(map: EsriMap): Promise<void> {
    const area = this.calculateArea();
    const graphicsLayer = new GraphicsLayer({
      id: 'bboxVisualizationLayer',
    });

    let graphic: Graphic;

    if (area > AREA_THRESHOLD) {
      // Create polygon for large areas
      const polygon = createGeometryFromBBox(this.bbox, MapProjection.WORLD);

      const symbol = new SimpleFillSymbol({
        color: [204, 0, 51, 0.3],
        outline: {
          color: [204, 0, 51, 1],
          width: 2,
        },
      });

      graphic = new Graphic({
        geometry: polygon,
        symbol,
      });
    } else {
      // Create center point for small areas
      const [minX, minY, maxX, maxY] = this.bbox;
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

      graphic = new Graphic({
        geometry: point,
        symbol,
      });
    }

    graphicsLayer.add(graphic);
    map.add(graphicsLayer);
  }
}
