import '@arcgis/core/assets/esri/themes/light/main.css?inline';

import GeometryToolsLoader from '@/lib/arcgis/components/GeometryToolsLoader';
import { useMapParams } from '@/lib/hooks/useMapParams';

import { Map } from '../Map/Map';

export function App() {
  const {
    // View parameters
    zoom,
    scale,
    centre,
    bbox,
    bboxForceRegionalExtent,
    points,

    // UI Controls
    showZoomButton,
    showResetButton,
    showFullscreenButton,

    // Globe overview
    showGlobeOverview,

    // Asset parameters
    assetId,
    assetForcePopup,

    // Overlays
    showGraticule,
  } = useMapParams();

  return (
    <GeometryToolsLoader>
      <Map
        initialAssetId={assetId}
        initialCenter={centre}
        initialZoom={zoom}
        initialBbox={bbox}
        initialPoints={points}
        bboxForceRegionalExtent={bboxForceRegionalExtent}
        initialScale={scale}
        showGraticule={showGraticule}
        showGlobeOverview={showGlobeOverview}
        showZoomButton={showZoomButton}
        showResetButton={showResetButton}
        showFullscreenButton={showFullscreenButton}
        initialShowAssetPopup={assetForcePopup}
      />
    </GeometryToolsLoader>
  );
}
