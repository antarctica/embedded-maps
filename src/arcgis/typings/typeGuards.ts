// type gaurd to narrow down a geometry to a specific type
export function isEsriPoint(geometry: __esri.Geometry): geometry is __esri.Point {
  return geometry.type === 'point';
}
export function isEsriPolygon(geometry: __esri.Geometry): geometry is __esri.Polygon {
  return geometry.type === 'polygon';
}

export function isEsriPolyline(geometry: __esri.Geometry): geometry is __esri.Polyline {
  return geometry.type === 'polyline';
}

export function isEsriExtent(geometry: __esri.Geometry): geometry is __esri.Extent {
  return geometry.type === 'extent';
}
