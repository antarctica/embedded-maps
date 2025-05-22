import { SpatialReference } from '@arcgis/core/geometry';
import Extent from '@arcgis/core/geometry/Extent';
import Mesh from '@arcgis/core/geometry/Mesh';
import * as shapePreservingProjectOperator from '@arcgis/core/geometry/operators/shapePreservingProjectOperator.js';
import Polygon from '@arcgis/core/geometry/Polygon';
import Polyline from '@arcgis/core/geometry/Polyline';
import MeshComponent from '@arcgis/core/geometry/support/MeshComponent';
import { z } from 'zod';

import { getBasemapConfigForMapProjection, MapProjection } from '@/lib/config/basemap';

export const BBox = z.tuple([z.number(), z.number(), z.number(), z.number()]);
export const BBoxParam = z.union([BBox, z.array(BBox)]);

export type BBox = z.infer<typeof BBox>;
export type BBoxParam = z.infer<typeof BBoxParam>;

// write a function that will turn a bboxparam into an array of bbox
export function bboxParamToArray(bboxParam: BBoxParam): BBox[] {
  if (Array.isArray(bboxParam[0])) {
    return bboxParam as BBox[];
  }
  return [bboxParam as BBox];
}

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
export function createGeometryFromBBox(bbox: BBox, projection: MapProjection): __esri.Polygon {
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
 * @returns Object containing both the mesh geometry and its outline as a multipart polyline
 */
export function createMeshGeometryFromBBox(
  [minLon, minLat, maxLon, maxLat]: BBox,
  height: number = 5000,
  segments: number = 1000,
): { mesh: __esri.Mesh; outline: __esri.Polyline } {
  const crossesAntimeridian = minLon > maxLon;

  const vertices: number[] = [];
  const faces: number[] = [];

  // generate a regular grid of vertices.
  const nLonSegments = segments;
  const nLatSegments = Math.floor((segments * (maxLat - minLat)) / 360);

  // loop through the longitude segments index
  for (let i = 0; i <= nLonSegments; i++) {
    const lonFraction = i / nLonSegments;

    // calculate the longitude value for the current segment
    let lon;
    if (crossesAntimeridian) {
      // When the bbox crosses the antimeridian (180/-180 line), we need special handling:
      // 1. Calculate total angle by subtracting the gap between minLon and maxLon from 360
      const totalAngle = 360 - (minLon - maxLon);
      // 2. Calculate longitude by adding a fraction of the total angle to minLon
      lon = minLon + totalAngle * lonFraction;
      // 3. Normalize longitude to [-180, 180] range
      if (lon > 180) lon -= 360;
    } else {
      // For normal cases, simply interpolate between minLon and maxLon
      lon = minLon + (maxLon - minLon) * lonFraction;
    }

    // loop through the latitude segments index
    for (let j = 0; j <= nLatSegments; j++) {
      const latFraction = j / nLatSegments;
      const lat = minLat + (maxLat - minLat) * latFraction;

      // push the vertex to the vertices array
      vertices.push(lon, lat, height);
    }
  }

  // loop through the faces and push the indices to the faces array
  // The faces are the triangles that make up the mesh, they are defined by indices that
  // reference the vertices array.
  for (let i = 0; i < nLonSegments; i++) {
    for (let j = 0; j < nLatSegments; j++) {
      const baseIndex = i * (nLatSegments + 1) + j;
      const nextIndex = baseIndex + 1;
      const belowIndex = baseIndex + (nLatSegments + 1);
      const belowNextIndex = nextIndex + (nLatSegments + 1);

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

  // create the mesh geometry
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

  // Create multipart polyline from the mesh vertices
  const paths: number[][][] = [];

  // Add top edge (constant latitude)
  const topPath: number[][] = [
    [minLon, maxLat],
    [maxLon, maxLat],
  ];

  // Add right edge (constant longitude)
  const rightPath: number[][] = [
    [maxLon, minLat],
    [maxLon, maxLat],
  ];

  // Add bottom edge (constant latitude)
  const bottomPath: number[][] = [
    [minLon, minLat],
    [maxLon, minLat],
  ];

  // Add left edge (constant longitude)
  const leftPath: number[][] = [
    [minLon, minLat],
    [minLon, maxLat],
  ];

  if (Math.abs(minLon) === 180 && Math.abs(maxLon) === 180) {
    paths.push(topPath, bottomPath);
  } else {
    paths.push(topPath, rightPath, bottomPath, leftPath);
  }

  // create the outline geometry
  const outline = new Polyline({
    paths,
    spatialReference: { wkid: 4326 },
  });

  return { mesh, outline };
}
