import ZoomVM from '@arcgis/core/widgets/Zoom/ZoomViewModel';
import { css } from '@styled-system/css';
import { Divider, Flex } from '@styled-system/jsx';
import * as React from 'react';

import { useCurrentMapView, useWatchState } from '@/lib/arcgis/hooks';

import { MapButton } from '../../Button/MapButton';
import SvgIcon from '../../SvgIcon';

function ZoomControl() {
  const mapView = useCurrentMapView();
  const widget = React.useMemo(() => new ZoomVM({ view: mapView }), [mapView]);

  const canZoomIn = useWatchState(() => widget.canZoomIn) ?? false;
  const canZoomOut = useWatchState(() => widget.canZoomOut) ?? false;

  return (
    <Flex
      className={css({
        borderColor: 'grayscale.400',
        borderWidth: 'thin',
        bg: 'grayscale.200',
        boxShadow: 'md',
      })}
      direction="column"
    >
      <MapButton
        icon={<SvgIcon name="icon-add" size={14} />}
        aria-label="Zoom In"
        isDisabled={canZoomIn ? undefined : true}
        onPress={() => widget.zoomIn()}
      />
      <Divider thickness={'thin'} w="full" color="grayscale.400"></Divider>
      <MapButton
        icon={<SvgIcon name="icon-subtract" size={14} />}
        aria-label="Zoom Out"
        isDisabled={canZoomOut ? undefined : true}
        onPress={() => widget.zoomOut()}
      />
    </Flex>
  );
}

export default ZoomControl;
