// type gaurd to narrow down a geometry to a specific type
export function isEsriPoint(geometry: __esri.GeometryUnion): geometry is __esri.Point {
  return geometry.type === 'point';
}
export function isEsriPolygon(geometry: __esri.GeometryUnion): geometry is __esri.Polygon {
  return geometry.type === 'polygon';
}

export function isEsriPolyline(geometry: __esri.GeometryUnion): geometry is __esri.Polyline {
  return geometry.type === 'polyline';
}

export function isEsriExtent(geometry: __esri.GeometryUnion): geometry is __esri.Extent {
  return geometry.type === 'extent';
}

export function isValid2DCoordinate(
  coordinate: (number | nullish)[],
): coordinate is [number, number] {
  if (coordinate.length !== 2) {
    return false;
  }
  if (typeof coordinate[0] !== 'number' || typeof coordinate[1] !== 'number') {
    return false;
  }
  return true;
}
