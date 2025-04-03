import '@arcgis/core/assets/esri/themes/light/main.css?inline';

import GeometryToolsLoader from '@/lib/arcgis/components/GeometryToolsLoader';
import { useMapParams } from '@/lib/hooks/useMapParams';

import { Map } from '../Map/Map';

function convertEmptyStringToBooleanPresence(
  value: string | boolean | undefined,
): boolean | undefined {
  if (value === '' || typeof value === 'string') return true;
  return value;
}

export function App() {
  const {
    // View parameters
    zoom,
    scale,
    centre,
    bbox,
    bboxForceRegionalExtent,

    // UI Controls
    showZoomButton,
    showResetButton,
    showFullscreenButton,

    // Globe overview
    showGlobeOverview,

    // Asset parameters
    assetId,
    assetForcePopup,
  } = useMapParams();

  return (
    <GeometryToolsLoader>
      <Map
        initialAssetId={assetId}
        initialCenter={centre}
        initialZoom={zoom}
        initialBbox={bbox as [number, number, number, number]}
        bboxForceRegionalExtent={convertEmptyStringToBooleanPresence(bboxForceRegionalExtent)}
        initialScale={scale}
        showGlobeOverview={convertEmptyStringToBooleanPresence(showGlobeOverview)}
        showZoomButton={convertEmptyStringToBooleanPresence(showZoomButton)}
        showResetButton={convertEmptyStringToBooleanPresence(showResetButton)}
        showFullscreenButton={convertEmptyStringToBooleanPresence(showFullscreenButton)}
        initialShowAssetPopup={convertEmptyStringToBooleanPresence(assetForcePopup)}
      />
    </GeometryToolsLoader>
  );
}
