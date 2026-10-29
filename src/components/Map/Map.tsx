import * as reactiveUtils from '@arcgis/core/core/reactiveUtils.js';
import Viewpoint from '@arcgis/core/Viewpoint';
import { useElementSize } from '@mantine/hooks';
import React from 'react';
import { tv } from 'tailwind-variants';

import { ArcMapView } from '@/lib/arcgis/components/ArcView/ArcMapView';
import { BBox, MapPoint } from '@/lib/config/schema';

import { Globe } from '../Globe';
import LoadingScrim from '../LoadingScrim';
import { CombinedAttributionControl } from '../map-controls/AttributionControl';
import FullScreenControl from '../map-controls/FullScreenControl/FullScreenControl';
import HomeControl from '../map-controls/HomeControl';
import PopupControl from '../map-controls/PopupControl';
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
  initialPortalItemIds?: string[];

  // UI Controls
  showZoomButton?: boolean;
  showResetButton?: boolean;
  showFullscreenButton?: boolean;

  // Globe overview
  showGlobeOverview?: boolean;

  // Asset parameters
  initialAssetIds?: string[];
  initialAssetTypes?: string[];
  initialShowAssetPopup?: boolean;

  // Overlays
  showGraticule?: boolean;
}

// Module-level so the observer is not recreated each render; border-box includes the padding.
const borderBoxObserver: ResizeObserverOptions = { box: 'border-box' };

const mapStyles = tv({
  base: 'pointer-events-auto h-full w-full [--arcgis-layout-overlay-space-bottom:16px] [--arcgis-layout-overlay-space-left:0] [--arcgis-layout-overlay-space-right:0] [--arcgis-layout-overlay-space-top:0]',
});

export function Map({
  initialAssetIds,
  initialAssetTypes,
  initialCenter,
  initialZoom,
  initialBbox,
  initialPoints,
  initialPortalItemIds,
  bboxForceRegionalExtent,
  initialScale,
  showGlobeOverview,
  showZoomButton,
  showResetButton,
  showFullscreenButton,
  showGraticule,
  initialShowAssetPopup,
}: MapProps) {
  const [isMapViewLoading, setIsMapViewLoading] = React.useState(true);
  const { ref: attributionRef, height: attributionHeight } =
    useElementSize<HTMLDivElement>(borderBoxObserver);
  const [areLayersLoading, setAreLayersLoading] = React.useState(true);
  const [initialViewpoint, setInitialViewpoint] = React.useState<Viewpoint | undefined>(undefined);
  const { map, error, isMapLoading, handleViewReady } = useMapInitialisation({
    initialAssetIds,
    initialAssetTypes,
    initialCenter,
    initialBbox,
    initialPoints,
    initialPortalItemIds,
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
    <div
      className="map-container"
      data-testid="map-container"
      // Read by overlays such as PopupControl so they can stop above the attribution bar.
      style={{ '--attribution-height': `${attributionHeight}px` } as React.CSSProperties}
    >
      <ArcMapView
        data-ready={(!isMapViewLoading && !areLayersLoading).toString()}
        className={mapStyles()}
        map={map}
        onarcgisViewReadyChange={(event) => {
          handleViewReady(event.target.view).then(() => {
            setInitialViewpoint(event.target.view.viewpoint);
          });
        }}
        scale={initialScale}
        zoom={initialZoom}
        hideAttribution
      >
        <PopupControl />
        <div slot="top-left" className="flex flex-col gap-2">
          {showZoomButton && <ZoomControl />}
          {showResetButton && <HomeControl viewpoint={initialViewpoint} />}
          {showFullscreenButton && <FullScreenControl />}
        </div>
        <div slot="bottom-left">
          <ScaleControl />
        </div>
        {showGlobeOverview && (
          <div slot="top-right">
            <Globe
              initialAssetIds={initialAssetIds}
              initialBbox={initialBbox}
              initialPoints={initialPoints}
              initialAssetTypes={initialAssetTypes}
            />
          </div>
        )}
        <CombinedAttributionControl ref={attributionRef} />
      </ArcMapView>
    </div>
  );
}
