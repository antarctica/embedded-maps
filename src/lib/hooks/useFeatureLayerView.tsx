import React from 'react';

export function useFeatureLayerInMap(mapView: __esri.MapView, featureLayer: __esri.FeatureLayer) {
  const [featureLayerView, setFeatureLayerView] = React.useState<__esri.FeatureLayerView>();
  React.useEffect(() => {
    const getLayerView = async () => {
      const layerView = await mapView.whenLayerView(featureLayer);
      setFeatureLayerView(layerView);
    };
    getLayerView();
  }, [mapView, featureLayer]);

  return featureLayerView;
}
