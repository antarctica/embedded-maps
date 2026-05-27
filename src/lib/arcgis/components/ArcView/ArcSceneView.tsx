import '@arcgis/map-components/components/arcgis-scene';

import type { ArcgisSceneCustomEvent } from '@arcgis/map-components';
import React, { type JSX } from 'react';

import { useCreateView } from '@/lib/arcgis/hooks/useCreateView';

import { ArcInternalViewProvider } from '../../contexts/InternalViewContext/ArcInternalViewProvider';

export function ArcSceneView({
  children,
  onarcgisViewReadyChange,
  ...props
}: JSX.IntrinsicElements['arcgis-scene']) {
  const { view, onViewReady } = useCreateView(props.id);
  const containerRef = React.useRef<HTMLArcgisSceneElement>(null);

  const arcgisViewReadyCb = React.useCallback(
    (ev: ArcgisSceneCustomEvent<void>) => {
      if (ev.target !== containerRef.current) return;
      onViewReady(ev.target.view);
      onarcgisViewReadyChange?.(ev);
    },
    [onViewReady, onarcgisViewReadyChange],
  );

  return (
    <ArcInternalViewProvider view={view}>
      <arcgis-scene
        hideAttribution
        ref={containerRef}
        {...props}
        onarcgisViewReadyChange={arcgisViewReadyCb}
      >
        {view && children}
      </arcgis-scene>
    </ArcInternalViewProvider>
  );
}
