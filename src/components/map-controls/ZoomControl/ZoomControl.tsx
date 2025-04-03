import ZoomVM from '@arcgis/core/widgets/Zoom/ZoomViewModel';
import { css } from '@styled-system/css';
import { Divider, VStack } from '@styled-system/jsx';
import * as React from 'react';

import { IconButton } from '@/components/Button/IconButton';
import { useCurrentMapView, useWatchState } from '@/lib/arcgis/hooks';

import SvgIcon from '../../SvgIcon';

function ZoomControl() {
  const mapView = useCurrentMapView();
  const widget = React.useMemo(() => new ZoomVM({ view: mapView }), [mapView]);

  const canZoomIn = useWatchState(() => widget.canZoomIn) ?? false;
  const canZoomOut = useWatchState(() => widget.canZoomOut) ?? false;

  return (
    <VStack
      className={css({
        borderRadius: 'sm',
        bg: 'basBlue.9',
        shadow: 'sm',
        overflow: 'hidden',
        pointerEvents: 'auto',
      })}
      gap={'0'}
    >
      <IconButton
        className={css({
          borderBottomRadius: 'none',
        })}
        icon={<SvgIcon name="icon-add" size={16} />}
        aria-label="Zoom In"
        isDisabled={!canZoomIn}
        onPress={() => widget.zoomIn()}
        variant="mapButton"
        size="md"
        contained
      />
      <Divider thickness={'thin'} w="[80%]" color="white/60"></Divider>
      <IconButton
        className={css({
          borderTopRadius: 'none',
        })}
        icon={<SvgIcon name="icon-subtract" size={16} />}
        aria-label="Zoom Out"
        isDisabled={!canZoomOut}
        onPress={() => widget.zoomOut()}
        variant="mapButton"
        size="md"
        contained
      />
    </VStack>
  );
}

export default ZoomControl;
