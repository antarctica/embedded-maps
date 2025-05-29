import '@arcgis/core/assets/esri/themes/light/main.css?inline';

import { useEffect } from 'react';

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
    theme,

    // Globe overview
    showGlobeOverview,

    // Asset parameters
    assetId,
    assetType,
    assetForcePopup,

    // Overlays
    showGraticule,
  } = useMapParams();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <GeometryToolsLoader>
      <Map
        initialAssetId={assetId}
        initialAssetType={assetType?.toString()}
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
