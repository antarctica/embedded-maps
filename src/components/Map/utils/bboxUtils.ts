import { SpatialReference } from '@arcgis/core/geometry';
import Extent from '@arcgis/core/geometry/Extent';
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
 * For example: [170, 60, -170, 80] represents a bbox that crosses the antimeridian.
 *
 * Esri handles antimeridian crossing by allowing longitude values outside the -180/180 range.
 * When a bbox crosses the antimeridian, we convert the western edge to a value less than -180
 * to create a continuous extent. For example, [170, 60, -170, 80] becomes [-190, 60, -170, 80].
 * This ensures proper rendering and operations across the antimeridian.
 */

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
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const crossesAntimeridian = minLon > maxLon;

  // Create an extent in WGS 84
  // if the bbox crosses the antimeridian, we need to adjust the xmin to be less than -180
  const extent = new Extent({
    xmin: crossesAntimeridian ? minLon - 360 : minLon,
    ymin: minLat,
    xmax: maxLon,
    ymax: maxLat,
    spatialReference: SpatialReference.WGS84,
  });

  // Convert extent to polygon
  const bboxPolygon = Polygon.fromExtent(extent);

  // Project the polygon to the target map projection while preserving its shape
  const projectedBboxPolygon = shapePreservingProjectOperator.execute(
    bboxPolygon,
    getBasemapConfigForMapProjection(projection).spatialReference,
  );

  return projectedBboxPolygon as __esri.Polygon;
}
