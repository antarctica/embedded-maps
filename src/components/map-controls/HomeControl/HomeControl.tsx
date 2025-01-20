import HomeVM from '@arcgis/core/widgets/Home/HomeViewModel';
import * as React from 'react';

import { useCurrentMapView, useWatchState } from '@/arcgis/hooks';

import { MapButton } from '../../Button/MapButton';
import SvgIcon from '../../SvgIcon';

function HomeControl() {
  const mapView = useCurrentMapView();
  const widget = React.useMemo(() => new HomeVM({ view: mapView }), [mapView]);
  const isDisabled = useWatchState(() => widget.state === 'disabled') ?? false;
  return (
    <MapButton
      includeBorder
      icon={<SvgIcon name="icon-home" size={12} />}
      aria-label="Home"
      isDisabled={isDisabled}
      onPress={() => widget.go()}
    />
  );
}

export default HomeControl;
