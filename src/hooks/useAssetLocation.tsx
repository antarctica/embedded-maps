import type FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import React from 'react';
import useSWR from 'swr';

export function useAssetLocation(
  featureLayer: FeatureLayer,
  assetFieldName: string,
  assetId: string,
) {
  const fetcher = React.useCallback(async () => {
    try {
      const query = featureLayer.createQuery();
      query.where = `${assetFieldName} = '${assetId}'`;
      query.returnGeometry = true;
      query.outFields = [assetFieldName];
      const result = await featureLayer.queryFeatures(query);

      if (result.features.length === 0) {
        return null;
      }

      return result.features[0].geometry as __esri.Point;
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [featureLayer, assetFieldName, assetId]);

  return useSWR<__esri.Point | null>(assetId, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
}
