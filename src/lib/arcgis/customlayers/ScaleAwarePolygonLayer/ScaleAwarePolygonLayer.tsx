import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import { Point } from '@arcgis/core/geometry';
import * as labelPointOperator from '@arcgis/core/geometry/operators/labelPointOperator.js';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';

import { isDefined } from '@/lib/types/typeGuards';

export interface ScaleAwarePolygonLayerProperties extends __esri.GraphicsLayerProperties {
  pixelThreshold?: number;
  defaultPointSymbol?: SimpleMarkerSymbol;
}

interface PolygonDisplayOptions {
  polygon: Graphic;
  center: Graphic;
}

@subclass('custom.ScaleAwarePolygonLayer')
export class ScaleAwarePolygonLayer extends GraphicsLayer {
  @property()
  pixelThreshold: number = 10;

  @property()
  defaultPointSymbol: SimpleMarkerSymbol = new SimpleMarkerSymbol({
    color: '#CC0033',
    outline: {
      width: 1,
      color: 'white',
    },
    size: 6,
  });

  private _polygonDisplayMap: Map<Graphic, PolygonDisplayOptions> = new Map();
  private _scaleWatcher: __esri.Handle | undefined;

  constructor(properties?: ScaleAwarePolygonLayerProperties) {
    super(properties);

    if (properties?.pixelThreshold) {
      this.pixelThreshold = properties.pixelThreshold;
    }

    if (properties?.defaultPointSymbol) {
      this.defaultPointSymbol = properties.defaultPointSymbol;
    }

    this.addHandles([
      this.on('layerview-create', (event) => {
        const view = event.view as __esri.MapView | __esri.SceneView;
        this._scaleWatcher = reactiveUtils.watch(
          () => view.scale,
          () => {
            for (const polygonGraphic of this._polygonDisplayMap.keys()) {
              this.handleGraphicDisplay(polygonGraphic, view);
            }
          },
          { initial: true },
        );
      }),
      this.on('layerview-destroy', () => {
        if (this._scaleWatcher) {
          this._scaleWatcher.remove();
          this._scaleWatcher = undefined;
        }
      }),
    ]);
  }

  private calculatePolygonPixelDiagonal(
    polygon: Graphic,
    mapView: __esri.MapView | __esri.SceneView,
  ): number {
    const extent = polygon.geometry?.extent;
    if (!isDefined(extent)) {
      return 0;
    }

    const topRightPoint = new Point({
      x: extent.xmax,
      y: extent.ymax,
      spatialReference: mapView.spatialReference,
    });

    const bottomLeftPoint = new Point({
      x: extent.xmin,
      y: extent.ymin,
      spatialReference: mapView.spatialReference,
    });

    const topRightScreenPoint = mapView.toScreen(topRightPoint);
    const bottomLeftScreenPoint = mapView.toScreen(bottomLeftPoint);

    if (!isDefined(topRightScreenPoint) || !isDefined(bottomLeftScreenPoint)) {
      return 0;
    }

    return Math.sqrt(
      Math.pow(topRightScreenPoint.x - bottomLeftScreenPoint.x, 2) +
        Math.pow(topRightScreenPoint.y - bottomLeftScreenPoint.y, 2),
    );
  }

  private shouldShowPolygon(
    polygonGraphic: Graphic,
    mapView: __esri.MapView | __esri.SceneView,
  ): boolean {
    const pixelDiagonal = this.calculatePolygonPixelDiagonal(polygonGraphic, mapView);
    return pixelDiagonal >= this.pixelThreshold;
  }

  private handleGraphicDisplay(
    polygonGraphic: Graphic,
    mapView: __esri.MapView | __esri.SceneView,
  ): void {
    const polygonDisplayOptions = this._polygonDisplayMap.get(polygonGraphic);
    if (!polygonDisplayOptions) {
      return;
    }

    const shouldShow = this.shouldShowPolygon(polygonGraphic, mapView);

    if (!shouldShow) {
      super.remove(polygonDisplayOptions.polygon);
      if (!this.graphics.find((graphic) => graphic === polygonDisplayOptions.center)) {
        super.add(polygonDisplayOptions.center);
      }
    } else {
      super.remove(polygonDisplayOptions.center);
      if (!this.graphics.find((graphic) => graphic === polygonDisplayOptions.polygon)) {
        super.add(polygonDisplayOptions.polygon);
      }
    }
  }

  public add(polygonGraphic: Graphic, fallBackPointSymbol?: SimpleMarkerSymbol): void {
    if (!isDefined(polygonGraphic.geometry)) {
      return;
    }

    const pointGraphic = new Graphic({
      geometry: labelPointOperator.execute(polygonGraphic.geometry),
      symbol: fallBackPointSymbol ?? this.defaultPointSymbol,
    });

    this._polygonDisplayMap.set(polygonGraphic, {
      polygon: polygonGraphic,
      center: pointGraphic,
    });

    super.add(polygonGraphic);
  }

  public remove(polygonGraphic: Graphic): void {
    this._polygonDisplayMap.delete(polygonGraphic);
    super.remove(polygonGraphic);
  }
}
