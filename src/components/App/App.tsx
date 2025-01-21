import '@arcgis/core/assets/esri/themes/light/main.css?inline';

import { Route } from '@/routes/__root';

import { Map } from '../Map/Map';

export function App() {
  const { asset_id, center, zoom, bbox, globe_overview, scale, hide_ui } = Route.useSearch();

  return (
    <Map
      initialAssetId={asset_id}
      initialCenter={center as [number, number]}
      initialZoom={zoom}
      initialBbox={bbox as [number, number, number, number]}
      initialScale={scale}
      includeGlobeOverview={globe_overview}
      hideUI={hide_ui}
    />
  );
}
