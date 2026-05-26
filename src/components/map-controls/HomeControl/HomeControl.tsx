import type Viewpoint from '@arcgis/core/Viewpoint';
import * as React from 'react';

import { useCurrentMapView, useWatchState } from '@/lib/arcgis/hooks';

import { IconButton } from '../../Button/IconButton';
import SvgIcon from '../../SvgIcon';

const watcherOptions = {
  initial: true,
  once: true,
};

function HomeControl({ viewPoint }: { viewPoint?: Viewpoint }): React.ReactElement {
  const mapView = useCurrentMapView();

  // Capture the view's initial viewpoint once it is ready, as a fallback home target.
  const capturedViewpoint = useWatchState(
    () => (mapView.ready ? mapView.viewpoint?.clone() : undefined),
    [mapView],
    watcherOptions,
  );

  // An explicitly passed viewpoint takes precedence over the captured one.
  const homeViewpoint = viewPoint ?? capturedViewpoint;

  const [abortController, setAbortController] = React.useState<AbortController | null>(null);
  const isDisabled = !homeViewpoint;

  return (
    <IconButton
      variant="mapButton"
      size="md"
      icon={<SvgIcon name="icon-home" />}
      aria-label="Home"
      isDisabled={isDisabled}
      onPress={() => {
        if (!homeViewpoint) return;

        if (abortController) {
          abortController.abort();
          setAbortController(null);
          return;
        }

        const controller = new AbortController();
        setAbortController(controller);

        void mapView
          .goTo(homeViewpoint, { signal: controller.signal })
          .catch(() => {
            // ignore goTo errors (e.g. user interaction or abort)
          })
          .finally(() => {
            setAbortController((current) => (current === controller ? null : current));
          });
      }}
    />
  );
}

export default HomeControl;
