import '@arcgis/core/assets/esri/themes/light/main.css?inline';

import GeometryToolsLoader from '@/arcgis/components/GeometryToolsLoader';
import {
  DEFAULT_REGIONAL_EXTENT,
  DEFAULT_SHOW_ASSET_POPUP,
  DEFAULT_SHOW_FULLSCREEN_BUTTON,
  DEFAULT_SHOW_GLOBE_OVERVIEW,
  DEFAULT_SHOW_RESET_BUTTON,
  DEFAULT_SHOW_ZOOM_BUTTON,
} from '@/config/mapParamDefaults';
import { Route } from '@/routes/__root';

import { Map } from '../Map/Map';

export function App() {
  const {
    // View parameters
    zoom,
    scale,
    centre,
    bbox,
    'bbox-force-regional-extent': bboxForceRegionalExtent = DEFAULT_REGIONAL_EXTENT,

    // UI Controls
    'ctrl-zoom': showZoomButton = DEFAULT_SHOW_ZOOM_BUTTON,
    'ctrl-reset': showResetButton = DEFAULT_SHOW_RESET_BUTTON,
    'ctrl-fullscreen': showFullscreenButton = DEFAULT_SHOW_FULLSCREEN_BUTTON,

    // Globe overview
    'globe-overview': showGlobeOverview = DEFAULT_SHOW_GLOBE_OVERVIEW,

    // Asset parameters
    'asset-id': assetId,
    'asset-force-popup': assetForcePopup = DEFAULT_SHOW_ASSET_POPUP,
  } = Route.useSearch();
  return (
    <GeometryToolsLoader>
      <Map
        initialAssetId={assetId}
        initialCenter={centre}
        initialZoom={zoom}
        initialBbox={bbox as [number, number, number, number]}
        bboxForceRegionalExtent={bboxForceRegionalExtent}
        initialScale={scale}
        showGlobeOverview={showGlobeOverview}
        showZoomButton={showZoomButton}
        showResetButton={showResetButton}
        showFullscreenButton={showFullscreenButton}
        initialShowAssetPopup={assetForcePopup}
      />
    </GeometryToolsLoader>
  );
}
