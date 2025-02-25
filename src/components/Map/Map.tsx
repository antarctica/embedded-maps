import '@arcgis/map-components/components/arcgis-placement';

import { css, cva } from '@styled-system/css';
import { Flex } from '@styled-system/jsx';
import React from 'react';

import { ArcMapView } from '@/arcgis/components/ArcView/ArcMapView';

import { Globe } from '../Globe';
import LoadingScrim from '../LoadingScrim';
import FullScreenControl from '../map-controls/FullScreenControl/FullScreenControl';
import HomeControl from '../map-controls/HomeControl';
import ScaleControl from '../map-controls/ScaleControl/ScaleControl';
import ZoomControl from '../map-controls/ZoomControl';
import { useMapInitialization } from './hooks/useMapInitialization';
interface MapProps {
  initialAssetId?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  initialBbox?: [number, number, number, number];
  initialScale?: number;
  includeGlobeOverview?: boolean;
  hideUI?: boolean;
  showRegion?: boolean;
  showAssetPopup?: boolean;
  showFullScreen?: boolean;
}

const viewPadding = {
  top: 10,
  left: 10,
  right: 10,
  bottom: 10,
};

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
  initialScale,
  includeGlobeOverview,
  hideUI,
  showRegion,
  showAssetPopup,
  showFullScreen,
}: MapProps) {
  const [viewPoint, setViewPoint] = React.useState<__esri.Viewpoint | undefined>(undefined);

  const { map, error, isLoading, handleViewReady } = useMapInitialization({
    initialAssetId,
    initialCenter,
    initialBbox,
    showRegion,
    showAssetPopup,
  });

  if (!map || isLoading || error) {
    return <LoadingScrim isLoading={true} error={error?.message} />;
  }

  return (
    <div className={mapViewContainerRecipe()}>
      <ArcMapView
        className={css({ w: 'full', h: 'full', pointerEvents: 'auto' })}
        map={map}
        onarcgisViewReadyChange={(event) => {
          handleViewReady(event.target.view).then(() => {
            setViewPoint(event.target.view.viewpoint);
          });
        }}
        scale={initialScale}
        padding={viewPadding}
        zoom={initialZoom}
      >
        {!hideUI && (
          <>
            <arcgis-placement position="top-left">
              <Flex gap={'4'} direction="column">
                <ZoomControl />
                <HomeControl viewPoint={viewPoint} />
                {showFullScreen && <FullScreenControl />}
              </Flex>
            </arcgis-placement>
            <arcgis-placement position="bottom-left">
              <ScaleControl />
            </arcgis-placement>
            {includeGlobeOverview && (
              <arcgis-placement position="top-right">
                <Globe initialAssetId={initialAssetId} initialBbox={initialBbox} />
              </arcgis-placement>
            )}
          </>
        )}
      </ArcMapView>
    </div>
  );
}
