import '@arcgis/core/assets/esri/themes/light/main.css?inline';

import { Route } from '@/routes/__root';

import { Map } from '../Map/Map';

export function App() {
  const {
    'asset-id': assetId,
    center,
    zoom,
    bbox,
    'globe-overview': globeOverview,
    scale,
    'hide-ui': hideUI,
    'show-region': showRegion,
    'show-asset-popup': showAssetPopup,
    'show-full-screen': showFullScreen,
  } = Route.useSearch();

  return (
    <Map
      initialAssetId={assetId}
      initialCenter={center as [number, number]}
      initialZoom={zoom}
      initialBbox={bbox as [number, number, number, number]}
      initialScale={scale}
      includeGlobeOverview={globeOverview}
      hideUI={hideUI}
      showRegion={showRegion}
      showAssetPopup={showAssetPopup}
      showFullScreen={showFullScreen}
    />
  );
}
