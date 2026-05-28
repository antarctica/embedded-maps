import type { EventNames, EventTypes } from '@arcgis/core/core/Evented';
import type { EventedCallback, EventedMixin } from '@arcgis/core/core/Evented';
import type Point from '@arcgis/core/geometry/Point';
import type Polygon from '@arcgis/core/geometry/Polygon';
import type Polyline from '@arcgis/core/geometry/Polyline';
import type Graphic from '@arcgis/core/Graphic';

export type EventHandlers<T extends EventedMixin> = {
  [K in EventNames<T>]?: EventedCallback<EventTypes<T>[K]>;
};

export interface PointGraphic<T extends object = Record<string, unknown>> extends Graphic {
  attributes: T;
  geometry: Point;
}

export interface LineGraphic<T extends object = Record<string, unknown>> extends Graphic {
  attributes: T;
  geometry: Polyline;
}

export interface PolygonGraphic<T extends object = Record<string, unknown>> extends Graphic {
  attributes: T;
  geometry: Polygon;
}
