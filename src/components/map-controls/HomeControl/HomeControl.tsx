import type Viewpoint from '@arcgis/core/Viewpoint';
import * as React from 'react';

import { useCurrentMapView } from '@/lib/arcgis/hooks';

import { IconButton } from '../../Button/IconButton';
import SvgIcon from '../../SvgIcon';

interface HomeControlProps {
  viewpoint?: Viewpoint;
}

function HomeControl({ viewpoint }: HomeControlProps): React.ReactElement {
  const mapView = useCurrentMapView();
  // Only read in the press handler, so a ref avoids re-rendering on every goTo.
  const abortControllerRef = React.useRef<AbortController | null>(null);

  return (
    <IconButton
      variant="mapButton"
      size="md"
      icon={<SvgIcon name="icon-home" />}
      aria-label="Home"
      isDisabled={!viewpoint}
      onPress={() => {
        if (!viewpoint) return;

        // A second press while the animation is running cancels it.
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
          return;
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        void mapView
          .goTo(viewpoint, { signal: controller.signal })
          .catch(() => {
            // ignore goTo errors (e.g. user interaction or abort)
          })
          .finally(() => {
            if (abortControllerRef.current === controller) {
              abortControllerRef.current = null;
            }
          });
      }}
    />
  );
}

export default HomeControl;
