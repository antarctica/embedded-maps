import { SpatialReference } from '@arcgis/core/geometry';
import * as shapePreservingProjectOperator from '@arcgis/core/geometry/operators/shapePreservingProjectOperator.js';
import Polygon from '@arcgis/core/geometry/Polygon';

import { getBasemapConfigForMapProjection, MapProjection } from '@/config/basemap';

/**
 * Reference the BBOX spec to understand the behavior around the antimeridian:
 * https://github.com/opengeospatial/ogcapi-features/blob/master/core/openapi/parameters/bbox.yaml
 *
 * For WGS 84 longitude/latitude the values are in most cases the sequence of:
 * - minimum longitude
 * - minimum latitude
 * - maximum longitude
 * - maximum latitude
 *
 * However, in cases where the box spans the antimeridian, the first value
 * (west-most box edge) is larger than the third value (east-most box edge).
 */

/**
 * Creates a standardized bbox representation as polygon rings
 * @param bbox - Array of [minLon, minLat, maxLon, maxLat] coordinates
 * @returns Array of polygon rings. Returns two rings if bbox crosses antimeridian
 */
export function createBboxPolygonRings(bbox: [number, number, number, number]): number[][][] {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const crossesAntimeridian = minLon > maxLon;

  // When bbox crosses the antimeridian (180/-180 line), we need to split it into two polygons
  if (crossesAntimeridian) {
    // Split into two polygons: one from minLon to 180, one from -180 to maxLon
    return [
      // Western polygon (minLon to 180) - creates a closed ring by connecting coordinates
      [
        [minLon, minLat],
        [180, minLat],
        [180, maxLat],
        [minLon, maxLat],
        [minLon, minLat],
      ],
      // Eastern polygon (-180 to maxLon) - creates a closed ring by connecting coordinates
      [
        [-180, minLat],
        [maxLon, minLat],
        [maxLon, maxLat],
        [-180, maxLat],
        [-180, minLat],
      ],
    ];
  }

  // For standard case (no antimeridian crossing), create a single closed polygon ring
  return [
    [
      [minLon, minLat],
      [maxLon, minLat],
      [maxLon, maxLat],
      [minLon, maxLat],
      [minLon, minLat],
    ],
  ];
}

/**
 * Creates an ArcGIS Polygon geometry from a bbox, projecting it to the specified map projection
 * @param bbox - Array of [minLon, minLat, maxLon, maxLat] coordinates in WGS 84
 * @param projection - Target map projection for the resulting polygon
 * @returns ArcGIS Polygon geometry in the specified projection
 */
export function createGeometryFromBBox(
  bbox: [number, number, number, number],
  projection: MapProjection,
): __esri.Polygon {
  // Create initial polygon in WGS 84 (EPSG:4326) coordinate system
  const bboxPolygon = new Polygon({
    rings: createBboxPolygonRings(bbox),
    spatialReference: SpatialReference.WGS84,
  });

  // Project the polygon to the target map projection while preserving its shape
  const projectedBboxPolygon = shapePreservingProjectOperator.execute(
    bboxPolygon,
    getBasemapConfigForMapProjection(projection).spatialReference,
  );

  return projectedBboxPolygon as __esri.Polygon;
}
