import { Point } from '@arcgis/core/geometry';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import EsriMap from '@arcgis/core/Map';

import { MapCommand } from '@/lib/arcgis/typings/commandtypes';
import { DEFAULT_POINT_SYMBOL } from '@/lib/config/layerStyles';
import { isCoordinatePair, MapPoint } from '@/lib/config/schema';

export class AddPointsLayerCommand implements MapCommand {
  private pointGraphicsLayer = new GraphicsLayer();
  constructor(private points: MapPoint[]) {}

  createPointGraphic(point: MapPoint) {
    if (isCoordinatePair(point)) {
      return new Graphic({
        geometry: new Point({
          longitude: point[0],
          latitude: point[1],
        }),
        symbol: DEFAULT_POINT_SYMBOL,
      });
    }

    const symbol = DEFAULT_POINT_SYMBOL.clone();
    if (point.color) {
      symbol.color = point.color;
    }
    if (point.size) {
      symbol.size = point.size;
    }

    return new Graphic({
      geometry: new Point({
        longitude: point.longitude,
        latitude: point.latitude,
      }),
      symbol,
    });
  }

  async executeOnMap(map: EsriMap): Promise<void> {
    this.pointGraphicsLayer.addMany(this.points.map(this.createPointGraphic));
    map.add(this.pointGraphicsLayer);
  }
}
