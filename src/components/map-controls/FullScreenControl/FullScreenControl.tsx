import FullscreenVM from '@arcgis/core/widgets/Fullscreen/FullscreenViewModel.js';
import * as React from 'react';

import { useCurrentMapView, useWatchState } from '@/lib/arcgis/hooks';

import { MapButton } from '../../Button/MapButton';
import SvgIcon from '../../SvgIcon';

function FullScreenControl() {
  const mapView = useCurrentMapView();
  const widget = React.useMemo(() => new FullscreenVM({ view: mapView }), [mapView]);
  const isDisabled = useWatchState(() => widget.state === 'disabled') ?? false;
  return (
    <MapButton
      includeBorder
      icon={<SvgIcon name="icon-fullscreen" size={14} />}
      aria-label="Full Screen"
      isDisabled={isDisabled}
      onPress={() => widget.toggle()}
    />
  );
}

export default FullScreenControl;
