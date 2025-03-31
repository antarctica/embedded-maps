import { Point, SpatialReference } from '@arcgis/core/geometry';
import * as projectOperator from '@arcgis/core/geometry/operators/projectOperator.js';
import VirtualLighting from '@arcgis/core/views/3d/environment/VirtualLighting.js';
import WebsceneColorBackground from '@arcgis/core/webscene/background/ColorBackground.js';
import { css } from '@styled-system/css';
import { Box, Circle } from '@styled-system/jsx';
import React, { useCallback, useState } from 'react';

import { ArcSceneView } from '@/lib/arcgis/components/ArcView/ArcSceneView';
import { useCurrentMapView, useWatchEffect } from '@/lib/arcgis/hooks';
import { isEsriPoint } from '@/lib/arcgis/typings/typeGuards';
import { isPolarProjection } from '@/lib/config/basemap';
import { isDefined } from '@/lib/helpers/typeGuards';

import { useMapInitialization } from './hooks/useMapInitialization';

interface GlobeProps {
  initialAssetId?: string;
  initialBbox?: [number, number, number, number];
}

const correctViewpointForPoles = ([longitude, latitude]: [number, number]): Point => {
  // Adjust coordinates near poles (within 0.5 degrees)
  if (Math.abs(Math.abs(latitude) - 90) < 0.5) {
    if (latitude > 0) {
      latitude -= 0.1;
    } else {
      latitude += 0.1;
    }
  }
  if (Math.abs(Math.abs(longitude) - 180) < 0.5) {
    if (longitude > 0) {
      longitude -= 0.1;
    } else {
      longitude += 0.1;
    }
  }

  return new Point({ longitude, latitude });
};

const getCorrectedSceneViewpoint = (mapViewpoint: __esri.Viewpoint): __esri.Viewpoint | null => {
  const viewPointTargetGeometry = mapViewpoint.targetGeometry;
  if (!viewPointTargetGeometry || !isEsriPoint(viewPointTargetGeometry)) {
    return null;
  }

  const globalCRSViewPoint = projectOperator.execute(
    viewPointTargetGeometry,
    SpatialReference.WGS84,
  );
  if (Array.isArray(globalCRSViewPoint) || !isEsriPoint(globalCRSViewPoint)) {
    return null;
  }

  if (!isDefined(globalCRSViewPoint.longitude) || !isDefined(globalCRSViewPoint.latitude)) {
    return null;
  }

  const newViewPoint = mapViewpoint.clone();
  newViewPoint.targetGeometry = correctViewpointForPoles([
    globalCRSViewPoint.longitude,
    globalCRSViewPoint.latitude,
  ]);

  return newViewPoint;
};

export function Globe({ initialAssetId, initialBbox }: GlobeProps) {
  const mapView = useCurrentMapView();
  const [sceneView, setSceneView] = useState<__esri.SceneView>();

  const initialCorrectedViewpoint = React.useMemo(() => {
    return getCorrectedSceneViewpoint(mapView.viewpoint);
  }, [mapView]);

  const synchroniseSceneView = useCallback(
    (sceneView: __esri.SceneView | undefined) => {
      if (!sceneView) {
        return;
      }

      const correctedViewpoint = getCorrectedSceneViewpoint(mapView.viewpoint);

      if (!correctedViewpoint) {
        return;
      }

      try {
        sceneView.set('viewpoint', correctedViewpoint);
        if (mapView.spatialReference?.wkid && isPolarProjection(mapView.spatialReference.wkid)) {
          const camera = sceneView?.viewpoint.camera?.clone();
          const cameraPosition = camera?.position?.clone();
          if (
            !isDefined(camera) ||
            !isDefined(cameraPosition) ||
            !isDefined(cameraPosition.latitude) ||
            !isDefined(cameraPosition.longitude)
          ) {
            return;
          }
          const headingCorrection =
            cameraPosition.latitude < 0 ? -cameraPosition.longitude : cameraPosition.longitude;
          camera.heading = headingCorrection;
          sceneView.set('camera', camera);
        }
      } catch {
        // swallow error
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

  if (!map) {
    return null;
  }

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
          alphaCompositingEnabled={true}
          viewpoint={initialCorrectedViewpoint ?? undefined}
          onarcgisViewReadyChange={(event) => {
            const sceneView = event.target.view;
            setSceneView(sceneView);
            synchroniseSceneView(sceneView);
          }}
          environment={
            {
              lighting: new VirtualLighting({}),
              background: new WebsceneColorBackground({
                color: [0, 0, 0, 0],
              }),
              starsEnabled: false,
              atmosphereEnabled: false,
            } as unknown as __esri.SceneViewEnvironment
          }
          constraints={
            {
              altitude: {
                min: 255e5,
                max: 255e5,
              },
            } as __esri.SceneViewConstraints
          }
          padding={{ top: 0, right: 0, bottom: 0, left: 0 }}
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
