import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import EsriMap from '@arcgis/core/Map';

import { MapCommand } from '@/lib/arcgis/typings/commandtypes';
import { getBasemapConfigForMapProjection, getMapProjectionFromBbox } from '@/lib/config/basemap';
import { DEFAULT_POINT_SYMBOL } from '@/lib/config/layerStyles';
import { BBox, isCoordinatePair, MapPoint } from '@/lib/config/schema';

import { applyBasemapConstraints } from '../utils/mapViewUtils';
export class AddMapPointsCommand implements MapCommand {
  private pointGraphicsLayer = new GraphicsLayer({
    title: 'point-graphics-layer',
  });

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

  calculateEnvelopeBbox(points: Point[]): BBox {
    const minLon = Math.min(...points.map((point) => point.longitude ?? 0));
    const minLat = Math.min(...points.map((point) => point.latitude ?? 0));
    const maxLon = Math.max(...points.map((point) => point.longitude ?? 0));
    const maxLat = Math.max(...points.map((point) => point.latitude ?? 0));
    return [minLon, minLat, maxLon, maxLat];
  }

  async executeOnMap(map: EsriMap) {
    const pointGraphics = this.points.map(this.createPointGraphic);
    const envelopeBbox = this.calculateEnvelopeBbox(
      pointGraphics.map((graphic) => graphic.geometry as Point),
    );
    const mapProjection = getMapProjectionFromBbox(envelopeBbox);
    const basemapConfig = getBasemapConfigForMapProjection(mapProjection);
    map.basemap = basemapConfig.basemap;

    this.pointGraphicsLayer.addMany(pointGraphics);
    map.add(this.pointGraphicsLayer);

    return {
      executeOnView: async (mapView: __esri.MapView) => {
        mapView.set('rotation', basemapConfig.rotation);
        applyBasemapConstraints(mapView, basemapConfig);
        await mapView.goTo({ target: pointGraphics }, { animate: false });
      },
    };
  }
}
