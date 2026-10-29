import TileLayer from '@arcgis/core/layers/TileLayer';
import type MapView from '@arcgis/core/views/MapView';

import { BasemapConfig } from '@/lib/config/basemap';

export function applyBasemapConstraints(mapView: MapView, basemapConfig: BasemapConfig) {
  if (!mapView.map?.basemap) {
    return;
  }

  // turn on resampling for basemap layers
  for (const layer of mapView.map.basemap.baseLayers) {
    if (layer instanceof TileLayer) {
      layer.set('resampling', true);
    }
  }

  mapView.constraints = {
    geometry: basemapConfig.viewExtent,
    snapToZoom: true,
    rotationEnabled: false,
  };
}
