import '@arcgis/map-components/components/arcgis-placement';

import { css, cva } from '@styled-system/css';
import { Flex } from '@styled-system/jsx';
import React from 'react';

import { ArcMapView } from '@/lib/arcgis/components/ArcView/ArcMapView';

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
  initialBbox?: [number, number, number, number];
  bboxForceRegionalExtent?: boolean;

  // UI Controls
  showZoomButton?: boolean;
  showResetButton?: boolean;
  showFullscreenButton?: boolean;

  // Globe overview
  showGlobeOverview?: boolean;

  // Asset parameters
  initialAssetId?: string;
  initialShowAssetPopup?: boolean;
}

const mapViewContainerRecipe = cva({
  base: {
    position: 'relative',
    w: 'full',
    h: 'full',
    '& .esri-ui': {
      inset: '0 !important',
    },

    '& #ref-globe .esri-attribution': {
      display: 'none',
    },

    '& .esri-attribution': {
      // eslint-disable-next-line @pandacss/no-hardcoded-color
      color: 'fg !important',

      // eslint-disable-next-line @pandacss/no-hardcoded-color
      bg: 'basBlue.a.4 !important',
    },
    '& .esri-attribution__sources': {
      fontWeight: 'semibold !important',
    },

    '& .esri-ui-inner-container .esri-component': {
      boxShadow: '[none !important]',
    },

    '& .esri-component': {
      margin: '[0 !important]',
    },
  },
});

export function Map({
  initialAssetId,
  initialCenter,
  initialZoom,
  initialBbox,
  bboxForceRegionalExtent,
  initialScale,
  showGlobeOverview,
  showZoomButton,
  showResetButton,
  showFullscreenButton,
  initialShowAssetPopup,
}: MapProps) {
  const [viewPoint, setViewPoint] = React.useState<__esri.Viewpoint | undefined>(undefined);
  const { map, error, isMapLoading, isViewReady, handleViewReady } = useMapInitialization({
    initialAssetId,
    initialCenter,
    initialBbox,
    bboxForceRegionalExtent,
    initialShowAssetPopup,
  });

  if (!map || isMapLoading || error) {
    return <LoadingScrim isLoading={true} error={error?.message} />;
  }

  return (
    <div className={mapViewContainerRecipe()} data-testid="map-container" data-ready={isViewReady}>
      <ArcMapView
        className={css({ w: 'full', h: 'full', pointerEvents: 'auto' })}
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
          <Flex gap={'4'} direction="column">
            {showZoomButton && <ZoomControl />}
            {showResetButton && <HomeControl viewPoint={viewPoint} />}
            {showFullscreenButton && <FullScreenControl />}
          </Flex>
        </arcgis-placement>
        <arcgis-placement position="bottom-left">
          <ScaleControl />
        </arcgis-placement>
        {showGlobeOverview && (
          <arcgis-placement position="top-right">
            <Globe initialAssetId={initialAssetId} initialBbox={initialBbox} />
          </arcgis-placement>
        )}
      </ArcMapView>
    </div>
  );
}
