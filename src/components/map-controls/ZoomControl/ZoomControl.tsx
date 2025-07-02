import ZoomVM from '@arcgis/core/widgets/Zoom/ZoomViewModel';
import * as React from 'react';
import { tv } from 'tailwind-variants';

import { IconButton } from '@/components/Button/IconButton';
import { Divider } from '@/components/Divider/Divider';
import { useCurrentMapView, useWatchState } from '@/lib/arcgis/hooks';

import SvgIcon from '../../SvgIcon';

const zoomButton = tv({
  slots: {
    wrapper:
      'pointer-events-auto flex flex-col items-center justify-center overflow-hidden rounded-3xl bg-htmlBackground shadow-sm theme-bsk1:rounded-none',
    button:
      'border-bottom-none h-8 md:h-10 theme-bsk1:first-of-type:border-b-0 theme-bsk1:last-of-type:border-t-0',
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
        icon={<SvgIcon name="icon-add" className="h-4 w-4 md:h-5 md:w-5" />}
        aria-label="Zoom In"
        isDisabled={!canZoomIn}
        onPress={() => widget.zoomIn()}
        variant="mapButton"
        size="md"
        contained
      />
      <Divider className="bg-blue-a4 theme-bsk1:bg-gray-8" orientation="horizontal" />
      <IconButton
        className={button()}
        icon={<SvgIcon name="icon-subtract" className="h-4 w-4 md:h-5 md:w-5" />}
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
