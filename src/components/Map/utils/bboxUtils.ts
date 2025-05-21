import { SpatialReference } from '@arcgis/core/geometry';
import Extent from '@arcgis/core/geometry/Extent';
import Mesh from '@arcgis/core/geometry/Mesh';
import * as shapePreservingProjectOperator from '@arcgis/core/geometry/operators/shapePreservingProjectOperator.js';
import Polygon from '@arcgis/core/geometry/Polygon';
import MeshComponent from '@arcgis/core/geometry/support/MeshComponent';

import { getBasemapConfigForMapProjection, MapProjection } from '@/lib/config/basemap';

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
 * Creates an ArcGIS Polygon geometry from a bbox, projecting it to the specified map projection.
 * Handles antimeridian crossing by converting western edge to values less than -180 for continuous extent.
 * For example, [170, 60, -170, 80] becomes [-190, 60, -170, 80].
 *
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

/**
 * Creates a 3D mesh geometry from a bbox for accurate rendering on a 3D globe.
 * This is necessary because simple polygon geometries can render incorrectly on a 3D globe,
 * especially when the bbox intersects with poles or crosses the antimeridian.
 * The mesh provides proper triangulation and elevation for consistent 3D visualization.
 *
 * @param bbox - Array of [minLon, minLat, maxLon, maxLat] coordinates in WGS 84
 * @param height - Height of the mesh in meters above the globe surface
 * @param segments - Number of segments to use for mesh triangulation (higher values = more detailed mesh)
 * @returns Object containing both the mesh geometry and its outline polygon
 */
export function createMeshGeometryFromBBox(
  bbox: [number, number, number, number],
  height: number = 5000,
  segments: number = 1000,
): { mesh: __esri.Mesh; outline: __esri.Polygon } {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const crossesAntimeridian = minLon > maxLon;

  const vertices: number[] = [];
  const faces: number[] = [];

  const lonSegments = segments;
  const latSegments = Math.floor((segments * (maxLat - minLat)) / 360);

  for (let i = 0; i <= lonSegments; i++) {
    const lonFraction = i / lonSegments;
    let lon;

    if (crossesAntimeridian) {
      const totalAngle = 360 - (minLon - maxLon);
      lon = minLon + totalAngle * lonFraction;
      if (lon > 180) lon -= 360;
    } else {
      lon = minLon + (maxLon - minLon) * lonFraction;
    }

    for (let j = 0; j <= latSegments; j++) {
      const latFraction = j / latSegments;
      const lat = minLat + (maxLat - minLat) * latFraction;
      vertices.push(lon, lat, height);
    }
  }

  for (let i = 0; i < lonSegments; i++) {
    for (let j = 0; j < latSegments; j++) {
      const baseIndex = i * (latSegments + 1) + j;
      const nextIndex = baseIndex + 1;
      const belowIndex = baseIndex + (latSegments + 1);
      const belowNextIndex = nextIndex + (latSegments + 1);

      faces.push(baseIndex);
      faces.push(belowIndex);
      faces.push(nextIndex);

      faces.push(belowIndex);
      faces.push(belowNextIndex);
      faces.push(nextIndex);
    }
  }

  const component = new MeshComponent({
    faces,
  });

  const mesh = new Mesh({
    components: [component],
    vertexAttributes: {
      position: new Float64Array(vertices),
    } as __esri.MeshVertexAttributes,
    spatialReference: { wkid: 4326 },
    vertexSpace: {
      type: 'georeferenced',
    },
  });

  // Create outline polygon from the mesh vertices
  const outlineVertices: number[][] = [];

  // Add top edge vertices
  for (let i = 0; i <= lonSegments; i++) {
    const vertexIndex = i * (latSegments + 1);
    outlineVertices.push([vertices[vertexIndex * 3], vertices[vertexIndex * 3 + 1]]);
  }

  // Add right edge vertices
  for (let j = 1; j <= latSegments; j++) {
    const vertexIndex = lonSegments * (latSegments + 1) + j;
    outlineVertices.push([vertices[vertexIndex * 3], vertices[vertexIndex * 3 + 1]]);
  }

  // Add bottom edge vertices in reverse
  for (let i = lonSegments - 1; i >= 0; i--) {
    const vertexIndex = i * (latSegments + 1) + latSegments;
    outlineVertices.push([vertices[vertexIndex * 3], vertices[vertexIndex * 3 + 1]]);
  }

  // Add left edge vertices in reverse
  for (let j = latSegments - 1; j > 0; j--) {
    const vertexIndex = j;
    outlineVertices.push([vertices[vertexIndex * 3], vertices[vertexIndex * 3 + 1]]);
  }

  const outline = new Polygon({
    rings: [outlineVertices],
    spatialReference: { wkid: 4326 },
  });

  return { mesh, outline };
}
