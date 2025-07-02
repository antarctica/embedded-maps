import '@arcgis/map-components/components/arcgis-placement';

import React from 'react';

import { ArcMapView } from '@/lib/arcgis/components/ArcView/ArcMapView';
import { GraticuleLayer } from '@/lib/arcgis/customlayers/GraticuleLayer/GraticuleLayer';
import { BBox, MapPoint } from '@/lib/config/schema';

import { Globe } from '../Globe';
import LoadingScrim from '../LoadingScrim';
import FullScreenControl from '../map-controls/FullScreenControl/FullScreenControl';
import HomeControl from '../map-controls/HomeControl';
import ScaleControl from '../map-controls/ScaleControl/ScaleControl';
import ZoomControl from '../map-controls/ZoomControl';
import { useMapInitialization } from './hooks/useMapInitialization';

interface MapProps {
  // View parameters
  initialZoom?: number;
  initialScale?: number;
  initialCenter?: [number, number];
  initialBbox?: BBox[];
  bboxForceRegionalExtent?: boolean;
  initialPoints?: MapPoint[];

  // UI Controls
  showZoomButton?: boolean;
  showResetButton?: boolean;
  showFullscreenButton?: boolean;

  // Globe overview
  showGlobeOverview?: boolean;

  // Asset parameters
  initialAssetId?: string;
  initialAssetType?: string;
  initialShowAssetPopup?: boolean;

  // Overlays
  showGraticule?: boolean;
}

export function Map({
  initialAssetId,
  initialAssetType,
  initialCenter,
  initialZoom,
  initialBbox,
  initialPoints,
  bboxForceRegionalExtent,
  initialScale,
  showGlobeOverview,
  showZoomButton,
  showResetButton,
  showFullscreenButton,
  showGraticule,
  initialShowAssetPopup,
}: MapProps) {
  const [viewPoint, setViewPoint] = React.useState<__esri.Viewpoint | undefined>(undefined);
  const { map, error, isMapLoading, isViewReady, handleViewReady } = useMapInitialization({
    initialAssetId,
    initialAssetType,
    initialCenter,
    initialBbox,
    initialPoints,
    bboxForceRegionalExtent,
    initialShowAssetPopup,
  });

  if (!map || isMapLoading || error) {
    return <LoadingScrim isLoading={true} error={error?.message} />;
  }

  return (
    <div
      className="map-container relative h-full w-full"
      data-testid="map-container"
      data-ready={isViewReady}
    >
      <ArcMapView
        className="pointer-events-auto h-full w-full"
        map={map}
        onarcgisViewReadyChange={(event) => {
          handleViewReady(event.target.view).then(() => {
            setViewPoint(event.target.view.viewpoint);
          });
        }}
        scale={initialScale}
        zoom={initialZoom}
      >
        {showGraticule && <GraticuleLayer />}
        <arcgis-placement position="top-left">
          <div className="flex flex-col gap-2 lg:gap-3">
            {showZoomButton && <ZoomControl />}
            {showResetButton && <HomeControl viewPoint={viewPoint} />}
            {showFullscreenButton && <FullScreenControl />}
          </div>
        </arcgis-placement>
        <arcgis-placement position="bottom-left">
          <ScaleControl />
        </arcgis-placement>
        {showGlobeOverview && (
          <arcgis-placement position="top-right">
            <Globe
              initialAssetId={initialAssetId}
              initialBbox={initialBbox}
              initialPoints={initialPoints}
              initialAssetType={initialAssetType}
            />
          </arcgis-placement>
        )}
      </ArcMapView>
    </div>
  );
}
