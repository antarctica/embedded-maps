import type Extent from '@arcgis/core/geometry/Extent';
import type Point from '@arcgis/core/geometry/Point';
import type Polygon from '@arcgis/core/geometry/Polygon';
import type Polyline from '@arcgis/core/geometry/Polyline';
import type { GeometryUnion } from '@arcgis/core/geometry/types';

// type gaurd to narrow down a geometry to a specific type
export function isEsriPoint(geometry: GeometryUnion): geometry is Point {
  return geometry.type === 'point';
}
export function isEsriPolygon(geometry: GeometryUnion): geometry is Polygon {
  return geometry.type === 'polygon';
}

export function isEsriPolyline(geometry: GeometryUnion): geometry is Polyline {
  return geometry.type === 'polyline';
}

export function isEsriExtent(geometry: GeometryUnion): geometry is Extent {
  return geometry.type === 'extent';
}

export function isValid2DCoordinate(
  coordinate: (number | null | undefined)[],
): coordinate is [number, number] {
  if (coordinate.length !== 2) {
    return false;
  }
  if (typeof coordinate[0] !== 'number' || typeof coordinate[1] !== 'number') {
    return false;
  }
  return true;
}
