import '@arcgis/map-components/components/arcgis-map';

import type { ArcgisMapCustomEvent } from '@arcgis/map-components';
import React, { type JSX } from 'react';

import { ArcInternalViewProvider } from '../../contexts/InternalViewContext/ArcInternalViewProvider';
import { useCreateView } from '../../hooks/useCreateView';

export const ArcMapView = ({
  children,
  onarcgisViewReadyChange,
  ref,
  ...props
}: JSX.IntrinsicElements['arcgis-map']) => {
  const { view, onViewReady } = useCreateView(props.id);
  const containerRef = React.useRef<HTMLArcgisMapElement>(null);

  const arcgisViewReadyCb = React.useCallback(
    (ev: ArcgisMapCustomEvent<void>) => {
      if (ev.target !== containerRef.current) return;
      onViewReady(ev.target.view);
      onarcgisViewReadyChange?.(ev);
    },
    [onViewReady, onarcgisViewReadyChange],
  );

  const setRef = React.useCallback(
    (mapRef: HTMLArcgisMapElement | null) => {
      containerRef.current = mapRef;

      if (typeof ref === 'function') {
        ref(mapRef);
      } else if (ref) {
        ref.current = mapRef;
      }
    },
    [ref],
  );

  return (
    <ArcInternalViewProvider view={view}>
      <arcgis-map ref={setRef} {...props} onarcgisViewReadyChange={arcgisViewReadyCb}>
        {view && children}
      </arcgis-map>
    </ArcInternalViewProvider>
  );
};
