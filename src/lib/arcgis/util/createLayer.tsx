import type Layer from '@arcgis/core/layers/Layer';
import type LayerView from '@arcgis/core/views/layers/LayerView';
import { useEffect, useState } from 'react';

import { useCurrentView } from '../hooks';
import { ArcReactiveProp } from './ArcReactiveProp';

export function createLayer<
  LayerConstructorType extends new (props: LayerProperties | undefined) => LayerInstance,
  LayerProperties,
  LayerInstance extends Layer,
>(LayerConstructor: LayerConstructorType) {
  return function ArcLayer({
    onLayerCreated,
    children,
    ...layerProps
  }: {
    onLayerCreated?: (layer: LayerInstance) => void;
    children?: React.ReactNode;
  } & LayerProperties) {
    const mapView = useCurrentView();
    const [layer, setLayer] = useState<LayerInstance>();
    const [layerView, setLayerView] = useState<LayerView>();

    useEffect(() => {
      if (!mapView) return;
      const layer = new LayerConstructor(layerProps as LayerProperties);
      setLayer(layer);
      mapView.map?.add(layer);

      return () => {
        mapView.map?.remove(layer);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapView]);

    useEffect(() => {
      if (!layer) return;
      layer.when(() => {
        onLayerCreated?.(layer);
        mapView.whenLayerView(layer).then((layerView) => {
          setLayerView(layerView);
        });
      });
    }, [layer, mapView, onLayerCreated]);

    return (
      <>
        {layerView && children}
        {layerProps &&
          layer &&
          Object.entries(layerProps).map(([key, val]) => (
            <ArcReactiveProp key={key} accessor={layer} property={key} value={val} />
          ))}
      </>
    );
  };
}
