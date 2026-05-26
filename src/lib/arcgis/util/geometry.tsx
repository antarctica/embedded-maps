import type Extent from '@arcgis/core/geometry/Extent';
import * as projectOperator from '@arcgis/core/geometry/operators/projectOperator';
import Point from '@arcgis/core/geometry/Point';
import Polygon from '@arcgis/core/geometry/Polygon';
import Polyline from '@arcgis/core/geometry/Polyline';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';
import type { GeometryUnion } from '@arcgis/core/geometry/types';

import { isDefined } from '@/lib/types/typeGuards';

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

type LonLat = { longitude: number; latitude: number };

/**
 * Validates if a projected geometry result is a valid point
 */
export function isValidProjectedPoint(
  projected: null | undefined | GeometryUnion,
): projected is Point {
  return isDefined(projected) && !Array.isArray(projected) && isEsriPoint(projected);
}

/**
 * Validates if a projected geometry result is a valid polyline
 */
export function isValidProjectedPolyline(
  projected: null | undefined | GeometryUnion,
): projected is Polyline {
  return isDefined(projected) && !Array.isArray(projected) && isEsriPolyline(projected);
}

/**
 * Extracts longitude and latitude from a point, either directly or by projecting to WGS84
 */
function extractLonLat(point: Point): LonLat | null {
  // Check if point already has longitude and latitude
  if (point.longitude && point.latitude) {
    return {
      longitude: point.longitude,
      latitude: point.latitude,
    };
  }

  // Project to WGS84 to get longitude and latitude
  const WGS84Point = projectOperator.execute(point, SpatialReference.WGS84);

  if (!isValidProjectedPoint(WGS84Point)) {
    return null;
  }

  const { longitude, latitude } = WGS84Point;
  if (!isDefined(longitude) || !isDefined(latitude)) {
    return null;
  }

  return { longitude, latitude };
}

/**
 * Projects a WGS84 point to the target spatial reference
 */
export function projectToSpatialReference(
  lonLat: LonLat,
  targetSpatialReference: SpatialReference,
): Point | null {
  const projectedPoint = projectOperator.execute(
    new Point({
      longitude: lonLat.longitude,
      latitude: lonLat.latitude,
      spatialReference: SpatialReference.WGS84,
    }),
    targetSpatialReference,
  );

  if (!isValidProjectedPoint(projectedPoint)) {
    return null;
  }

  return projectedPoint;
}

export function getLonLatFromMapPoint(point: Point): LonLat | null {
  return extractLonLat(point);
}

export function getMapPointWithLonLat(
  point: Point,
  mapSpatialReference: SpatialReference,
): Point | null {
  const lonLat = extractLonLat(point);
  if (!lonLat) {
    return null;
  }

  const projectedPoint = projectToSpatialReference(lonLat, mapSpatialReference);
  if (!projectedPoint) {
    return null;
  }

  projectedPoint.latitude = lonLat.latitude;
  projectedPoint.longitude = lonLat.longitude;

  return projectedPoint;
}
