import { Point, SpatialReference } from '@arcgis/core/geometry';
import * as projectOperator from '@arcgis/core/geometry/operators/projectOperator.js';
import VirtualLighting from '@arcgis/core/views/3d/environment/VirtualLighting.js';
import WebsceneColorBackground from '@arcgis/core/webscene/background/ColorBackground.js';
import React, { useCallback, useEffect, useState } from 'react';

import { ArcSceneView } from '@/lib/arcgis/components/ArcView/ArcSceneView';
import { useCurrentMapView, useWatchEffect } from '@/lib/arcgis/hooks';
import { isEsriPoint } from '@/lib/arcgis/typings/typeGuards';
import { isPolarProjection } from '@/lib/config/basemap';
import { BBox, MapPoint } from '@/lib/config/schema';
import { appTwVariants } from '@/lib/helpers/tailwind-utils';
import { isDefined } from '@/lib/types/typeGuards';

import { useMapInitialisation } from './hooks/useMapInitialisation';

const globe = appTwVariants({
  slots: {
    wrapper:
      'pointer-events-none absolute top-0 right-0 grid h-[10rem] w-[10rem] place-items-center overflow-hidden rounded-full border-4 border-solid border-seasalt shadow-lg md:h-[16rem] md:w-[16rem] md:border-6 lg:h-[20rem] lg:w-[20rem] lg:border-8 theme-bsk1:border-white',
    sceneContainer:
      'pointer-events-none absolute h-[calc((var(--scale-factor)*101%))] w-[calc((var(--scale-factor)*101%))] pb-[2px]',
    circleDisplayOverlay:
      'pointer-events-auto z-1 h-full w-full rounded-full bg-[radial-gradient(circle_at_20px_20px,#ffffff8d_20%,#000_80%)] opacity-40 mix-blend-hard-light',
  },
});

interface GlobeProps {
  initialAssetId?: string;
  initialBbox?: BBox[];
  initialAssetType?: string;
  initialPoints?: MapPoint[];
}

const correctViewpointForPoles = ([longitude, latitude]: [number, number]): Point => {
  // Adjust coordinates near poles (within 0.5 degrees)
  if (Math.abs(Math.abs(latitude) - 90) < 0.5) {
    if (latitude > 0) {
      latitude -= 0.2;
    } else {
      latitude += 0.1;
    }
  }
  if (Math.abs(Math.abs(longitude) - 180) < 0.5) {
    if (longitude > 0) {
      longitude -= 0.2;
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
  if (
    !isDefined(globalCRSViewPoint) ||
    Array.isArray(globalCRSViewPoint) ||
    !isEsriPoint(globalCRSViewPoint)
  ) {
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

export function Globe({
  initialAssetId,
  initialBbox,
  initialPoints,
  initialAssetType,
}: GlobeProps) {
  const mapView = useCurrentMapView();
  const [sceneView, setSceneView] = useState<__esri.SceneView>();

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
        sceneView.viewpoint = correctedViewpoint;
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

  const { map } = useMapInitialisation({
    initialAssetId,
    initialBbox,
    initialPoints,
    initialAssetType,
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

  // Prevent focus on ArcSceneView and its children
  useEffect(() => {
    if (sceneView) {
      const container = sceneView.container;
      if (container) {
        // Set tabindex on the container itself
        container.setAttribute('tabindex', '-1');

        // Prevent focus on all child elements recursively
        const preventFocusOnElement = (element: Element) => {
          if (element instanceof HTMLElement) {
            element.setAttribute('tabindex', '-1');
          }

          // Recursively apply to all children
          Array.from(element.children).forEach(preventFocusOnElement);
        };

        // Apply to all existing children
        preventFocusOnElement(container);
      }
    }
  }, [sceneView]);

  if (!map) {
    return null;
  }
  const { wrapper, sceneContainer, circleDisplayOverlay } = globe();

  return (
    <div className={wrapper()}>
      <div
        tabIndex={-1}
        className={sceneContainer()}
        style={{ '--scale-factor': '1.8' } as React.CSSProperties}
      >
        <ArcSceneView
          id="ref-globe"
          tabIndex={-1}
          map={map}
          alphaCompositingEnabled={true}
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
      </div>
      <div className={circleDisplayOverlay()}></div>
    </div>
  );
}
