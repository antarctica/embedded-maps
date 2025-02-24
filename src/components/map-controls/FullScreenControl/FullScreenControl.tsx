import FullScreenVM from '@arcgis/core/widgets/FullScreen/FullScreenViewModel';
import * as React from 'react';

import { useCurrentMapView, useWatchState } from '@/arcgis/hooks';

import { MapButton } from '../../Button/MapButton';
import SvgIcon from '../../SvgIcon';

function FullScreenControl() {
  const mapView = useCurrentMapView();
  const widget = React.useMemo(() => new FullScreenVM({ view: mapView }), [mapView]);
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
