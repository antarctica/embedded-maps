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
      'pointer-events-auto flex flex-col items-center justify-center overflow-hidden rounded-sm shadow-sm md:rounded-md theme-legacy:rounded-none',
    button:
      'border-bottom-none theme-legacy:first-of-type:border-b-0 theme-legacy:last-of-type:border-t-0',
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
        icon={<SvgIcon name="icon-add" size={16} />}
        aria-label="Zoom In"
        isDisabled={!canZoomIn}
        onPress={() => widget.zoomIn()}
        variant="mapButton"
        size="md"
        contained
      />
      <Divider className="bg-gray-1 theme-legacy:bg-gray-8" orientation="horizontal" />
      <IconButton
        className={button()}
        icon={<SvgIcon name="icon-subtract" size={16} />}
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
