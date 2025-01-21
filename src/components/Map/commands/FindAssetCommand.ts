import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import FeatureEffect from '@arcgis/core/layers/support/FeatureEffect';
import FeatureFilter from '@arcgis/core/layers/support/FeatureFilter';
import EsriMap from '@arcgis/core/Map';

import { MapCommand, ViewCommand } from '@/arcgis/typings/commandtypes';
import { ASSETFIELDNAME, ASSETLAYERMAPID, ASSETLAYERPORTALID } from '@/config/assetLayer';
import { getBasemapConfigForMapProjection, getMapProjectionFromPosition } from '@/config/map';

import { applyBasemapConstraints, applyPolarHeadingCorrection } from '../utils';

export class FindAssetCommand implements MapCommand {
  private assetLayer: FeatureLayer;

  constructor(private assetId: string) {
    this.assetLayer = new FeatureLayer({
      id: ASSETLAYERMAPID,
      portalItem: {
        id: ASSETLAYERPORTALID,
      },
      featureEffect: new FeatureEffect({
        filter: new FeatureFilter({
          where: `${ASSETFIELDNAME} = '${this.assetId}'`,
        }),
        excludedEffect: 'opacity(40%) grayscale(50%)',
      }),
    });
  }

  private async getAssetLocation(): Promise<__esri.Point | null> {
    try {
      const query = this.assetLayer.createQuery();
      query.where = `${ASSETFIELDNAME} = '${this.assetId}'`;
      query.returnGeometry = true;
      query.outFields = [ASSETFIELDNAME];
      const result = await this.assetLayer.queryFeatures(query);

      if (result.features.length === 0) {
        return null;
      }

      return result.features[0].geometry as __esri.Point;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async executeOnMap(map: EsriMap): Promise<ViewCommand | void> {
    map.add(this.assetLayer);
    const assetLocation = await this.getAssetLocation();
    if (assetLocation) {
      const { longitude, latitude } = assetLocation;
      const mapProjection = getMapProjectionFromPosition([longitude, latitude]);
      const basemapConfig = getBasemapConfigForMapProjection(mapProjection);
      map.basemap = basemapConfig.basemap;
      return {
        executeOnView: async (mapView: __esri.MapView) => {
          mapView.set('rotation', basemapConfig.rotation);
          applyBasemapConstraints(mapView, basemapConfig);
          await mapView.goTo({ target: assetLocation }, { animate: false });
          applyPolarHeadingCorrection(mapView, mapProjection);
        },
      };
    }
  }
}
