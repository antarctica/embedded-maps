import type FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import type FeatureLayerView from '@arcgis/core/views/layers/FeatureLayerView';
import type MapView from '@arcgis/core/views/MapView';
import React from 'react';

export function useFeatureLayerInMap(mapView: MapView, featureLayer: FeatureLayer) {
  const [featureLayerView, setFeatureLayerView] = React.useState<FeatureLayerView>();
  React.useEffect(() => {
    const getLayerView = async () => {
      const layerView = await mapView.whenLayerView(featureLayer);
      setFeatureLayerView(layerView);
    };
    getLayerView();
  }, [mapView, featureLayer]);

  return featureLayerView;
}
