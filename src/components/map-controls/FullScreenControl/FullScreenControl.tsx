import FullscreenVM from '@arcgis/core/widgets/Fullscreen/FullscreenViewModel.js';
import * as React from 'react';

import { useCurrentMapView, useWatchState } from '@/lib/arcgis/hooks';

import { IconButton } from '../../Button/IconButton';
import SvgIcon from '../../SvgIcon';
function FullScreenControl() {
  const mapView = useCurrentMapView();
  const widget = React.useMemo(() => new FullscreenVM({ view: mapView }), [mapView]);
  const isDisabled = useWatchState(() => widget.state === 'disabled') ?? false;
  return (
    <IconButton
      icon={<SvgIcon name="icon-fullscreen" />}
      aria-label="Full Screen"
      isDisabled={isDisabled}
      onPress={() => widget.toggle()}
      variant="mapButton"
      size="md"
    />
  );
}

export default FullScreenControl;
