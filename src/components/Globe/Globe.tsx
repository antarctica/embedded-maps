import { css } from '@styled-system/css';
import { Box, Circle } from '@styled-system/jsx';
import React, { useCallback, useState } from 'react';

import { ArcSceneView } from '@/arcgis/components/ArcView/ArcSceneView';
import { useCurrentMapView, useWatchEffect } from '@/arcgis/hooks';
import { isEsriPoint } from '@/arcgis/typings/typeGuards';
import { isPolarProjection } from '@/config/basemap';
import { isDefined } from '@/utils/typeGuards';

import { useMapInitialization } from './hooks/useMapInitialization';

interface GlobeProps {
  initialAssetId?: string;
  initialBbox?: [number, number, number, number];
}

export function Globe({ initialAssetId, initialBbox }: GlobeProps) {
  const mapView = useCurrentMapView();
  const [sceneView, setSceneView] = useState<__esri.SceneView>();

  const synchroniseSceneView = useCallback(
    (sceneView: __esri.SceneView | undefined) => {
      if (!sceneView) {
        return;
      }
      // ***HACK***
      // Suppress console.error to arcgis internal logging when an error that we don't
      // care about is logged by esri internal code.
      const originalConsoleError = console.error;
      console.error = () => {}; // temporarily suppress console.error
      try {
        sceneView.set('viewpoint', mapView.viewpoint);

        const targetGeometry = sceneView.viewpoint.targetGeometry;
        if (isEsriPoint(targetGeometry)) {
          // lock the globe to always maintain a constant orientation
          const { longitude, latitude } = targetGeometry;
          if (!isDefined(longitude) || !isDefined(latitude)) {
            return;
          }

          //only correct the heading if the mapview is a polar projection
          if (isPolarProjection(mapView.spatialReference.wkid)) {
            const camera = sceneView?.viewpoint.camera.clone();
            const headingCorrection = latitude < 0 ? -longitude : longitude;
            camera.heading = headingCorrection;
            sceneView.set('camera', camera);
          }
        }
      } catch {
        // swallow error
      } finally {
        console.error = originalConsoleError;
      }
    },
    [mapView],
  );

  const { map } = useMapInitialization({
    initialAssetId,
    initialBbox,
  });

  useWatchEffect(
    () => mapView.viewpoint,
    () => {
      if (mapView.interacting || mapView.animation) {
        synchroniseSceneView(sceneView);
      }
    },
    {
      initial: true,
    },
  );
  useWatchEffect(
    () => sceneView?.viewpoint,
    () => {
      if (sceneView?.interacting || sceneView?.animation) {
        try {
          mapView?.set('viewpoint', sceneView.viewpoint);
        } catch {
          // swallow error
        }
      }
    },
    {
      initial: true,
    },
  );

  return (
    <Circle
      className={css({
        position: 'absolute',
        top: '0',
        right: '0',
        borderColor: 'white',
        borderWidth: 'thick',
        shadow: 'lg',
        overflow: 'hidden',
        borderStyle: 'solid',
        pointerEvents: 'none',
      })}
      size={{ base: '[10rem]', md: '[16rem]' }}
    >
      <Box
        className={css({
          position: 'absolute',
          w: '[calc((var(--scale-factor)*100%))]',
          h: '[calc((var(--scale-factor)*100%))]',
          pb: '[2px]',
          pointerEvents: 'none',
        })}
        style={{ '--scale-factor': '1.8' } as React.CSSProperties}
      >
        <ArcSceneView
          id="ref-globe"
          map={map}
          center={mapView.center}
          alphaCompositingEnabled={true}
          camera={{
            fov: 10,
          }}
          onarcgisViewReadyChange={(event) => {
            setSceneView(event.target.view);
            synchroniseSceneView(event.target.view);
          }}
          environment={{
            lighting: { type: 'virtual' },
            background: {
              type: 'color',
              color: [0, 0, 0, 0],
            },
            starsEnabled: false,
            atmosphereEnabled: false,
          }}
          constraints={{
            altitude: {
              min: 25507477,
              max: 25507477,
            },
          }}
          padding={0}
          zoom={0}
        />
      </Box>
      <Circle
        className={css({
          zIndex: '1',
          opacity: '[0.4]',
          mixBlendMode: 'hard-light',
          pointerEvents: 'none',
          backgroundGradient: '[radial-gradient(circle at 20px 20px, #ffffff8d 20%, #000 80%)]',
        })}
        size={{
          base: '[10rem]',
          md: '[16rem]',
        }}
      ></Circle>
    </Circle>
  );
}
