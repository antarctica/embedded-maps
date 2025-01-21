import '@arcgis/map-components/dist/components/arcgis-placement';

import { css } from '@styled-system/css';
import { Box, Flex } from '@styled-system/jsx';
import React from 'react';

import { ArcMapView } from '@/arcgis/components/ArcView/ArcMapView';

import { Globe } from '../Globe';
import LoadingScrim from '../LoadingScrim';
import HomeControl from '../map-controls/HomeControl';
import ZoomControl from '../map-controls/ZoomControl';
import { useMapInitialization } from './hooks/useMapInitialization';

interface MapProps {
  initialAssetId?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  initialBbox?: [number, number, number, number];
  initialScale?: number;
  includeGlobeOverview?: boolean;
}

export function Map({
  initialAssetId,
  initialCenter,
  initialZoom,
  initialBbox,
  initialScale,
  includeGlobeOverview,
}: MapProps) {
  const [viewPoint, setViewPoint] = React.useState<__esri.Viewpoint | undefined>(undefined);

  const { map, error, isLoading, handleViewReady } = useMapInitialization({
    initialAssetId,
    initialCenter,
    initialBbox,
  });

  if (!map || isLoading || error) {
    return <LoadingScrim isLoading={true} error={error?.message} />;
  }

  return (
    <Box position={'relative'} w={'full'} h={'full'}>
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
            <ZoomControl />
            <HomeControl viewPoint={viewPoint} />
          </Flex>
        </arcgis-placement>
        {includeGlobeOverview && (
          <arcgis-placement position="top-right">
            <Globe initialAssetId={initialAssetId} />
          </arcgis-placement>
        )}
      </ArcMapView>
    </Box>
  );
}
