import '@arcgis/map-components/components/arcgis-placement';

import * as reactiveUtils from '@arcgis/core/core/reactiveUtils.js';
import React from 'react';

import { ArcMapView } from '@/lib/arcgis/components/ArcView/ArcMapView';
import { BBox, MapPoint } from '@/lib/config/schema';

import { Globe } from '../Globe';
import LoadingScrim from '../LoadingScrim';
import FullScreenControl from '../map-controls/FullScreenControl/FullScreenControl';
import HomeControl from '../map-controls/HomeControl';
import ScaleControl from '../map-controls/ScaleControl/ScaleControl';
import ZoomControl from '../map-controls/ZoomControl';
import { useMapInitialisation } from './hooks/useMapInitialisation';

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
  const [isMapViewLoading, setIsMapViewLoading] = React.useState(true);
  const [areLayersLoading, setAreLayersLoading] = React.useState(true);
  const { map, error, isMapLoading, handleViewReady } = useMapInitialisation({
    initialAssetId,
    initialAssetType,
    initialCenter,
    initialBbox,
    initialPoints,
    bboxForceRegionalExtent,
    initialShowAssetPopup,
    initialShowGraticule: showGraticule,
    postLoadCb: (view) => {
      if (!view || !view.map) {
        return;
      }
      setIsMapViewLoading(false);
      const map = view.map;
      const layers = map.allLayers;
      Promise.all(layers.map((Layer) => view.whenLayerView(Layer))).then((layerViews) => {
        Promise.all(
          layerViews.map((layerView) => reactiveUtils.whenOnce(() => !layerView.updating)),
        ).then(() => {
          setAreLayersLoading(false);
        });
      });
    },
  });

  if (!map || isMapLoading || error) {
    return <LoadingScrim isLoading={true} error={error?.message} />;
  }

  return (
    <div className="map-container relative h-full w-full" data-testid="map-container">
      <ArcMapView
        data-ready={(!isMapViewLoading && !areLayersLoading).toString()}
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
