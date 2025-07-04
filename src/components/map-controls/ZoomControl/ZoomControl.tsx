import ZoomVM from '@arcgis/core/widgets/Zoom/ZoomViewModel';
import * as React from 'react';

import { IconButton } from '@/components/Button/IconButton';
import { Divider } from '@/components/Divider/Divider';
import { useCurrentMapView, useWatchState } from '@/lib/arcgis/hooks';
import { appTwVariants } from '@/lib/helpers/tailwind-utils';

import SvgIcon from '../../SvgIcon';

const zoomButton = appTwVariants({
  slots: {
    wrapper:
      'pointer-events-auto flex flex-col items-center justify-center rounded-3xl bg-htmlBackground shadow-sm theme-bsk1:rounded-none',
    button:
      'border-bottom-none h-8 shadow-none first-of-type:rounded-t-3xl last-of-type:rounded-b-3xl md:h-10 theme-bsk1:rounded-none! theme-bsk1:first-of-type:border-b-0 theme-bsk1:last-of-type:border-t-0',
  },
});

function ZoomControl() {
  const mapView = useCurrentMapView();
  const widget = React.useMemo(() => new ZoomVM({ view: mapView }), [mapView]);

  const canZoomIn = useWatchState(() => widget.canZoomIn) ?? false;
  const canZoomOut = useWatchState(() => widget.canZoomOut) ?? false;

  const { wrapper, button } = zoomButton();

  return (
    <div className={wrapper()}>
      <IconButton
        className={button()}
        icon={<SvgIcon name="icon-add" />}
        aria-label="Zoom In"
        isDisabled={!canZoomIn}
        onPress={() => widget.zoomIn()}
        variant="mapButton"
        size="md"
        contained
      />
      <Divider className="bg-accent-a4 theme-bsk1:bg-gray-8" orientation="horizontal" />
      <IconButton
        className={button()}
        icon={<SvgIcon name="icon-subtract" />}
        aria-label="Zoom Out"
        isDisabled={!canZoomOut}
        onPress={() => widget.zoomOut()}
        variant="mapButton"
        size="md"
        contained
      />
    </div>
  );
}

export default ZoomControl;
