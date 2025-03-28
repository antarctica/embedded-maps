import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import FeatureEffect from '@arcgis/core/layers/support/FeatureEffect';
import FeatureFilter from '@arcgis/core/layers/support/FeatureFilter';
import EsriMap from '@arcgis/core/Map';

import { MapCommand, ViewCommand } from '@/arcgis/typings/commandtypes';
import { isEsriPoint, isValid2DCoordinate } from '@/arcgis/typings/typeGuards';
import { ASSETFIELDNAME, ASSETLAYERMAPID, ASSETLAYERPORTALID } from '@/config/assetLayer';
import { getBasemapConfigForMapProjection, getMapProjectionFromPosition } from '@/config/basemap';

import { applyBasemapConstraints, applyPolarHeadingCorrection } from '../utils/mapViewUtils';

export class FindAssetCommand implements MapCommand {
  private assetLayer: FeatureLayer;

  constructor(
    private assetId: string,
    private showAssetPopup: boolean = false,
  ) {
    this.assetLayer = new FeatureLayer({
      id: ASSETLAYERMAPID,
      portalItem: {
        id: ASSETLAYERPORTALID,
      },
      featureEffect: new FeatureEffect({
        filter: new FeatureFilter({
          where: `${ASSETFIELDNAME} = '${this.assetId}'`,
        }),
        excludedEffect: 'opacity(0%)',
      }),
    });
  }

  private async getAsset(): Promise<__esri.Graphic | null> {
    try {
      const query = this.assetLayer.createQuery();
      query.where = `${ASSETFIELDNAME} = '${this.assetId}'`;
      query.returnGeometry = true;
      query.outFields = [ASSETFIELDNAME];
      const result = await this.assetLayer.queryFeatures(query);

      if (result.features.length === 0) {
        return null;
      }

      const [asset] = result.features;
      return asset;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async executeOnMap(map: EsriMap): Promise<ViewCommand | void> {
    map.add(this.assetLayer);
    const asset = await this.getAsset();
    if (asset) {
      const geometry = asset.geometry;
      if (!geometry || !isEsriPoint(geometry)) {
        return;
      }
      const { longitude, latitude } = geometry;
      const coordinate = [longitude, latitude];
      if (!isValid2DCoordinate(coordinate)) {
        return;
      }
      const mapProjection = getMapProjectionFromPosition(coordinate);
      const basemapConfig = getBasemapConfigForMapProjection(mapProjection);
      applyPolarHeadingCorrection(this.assetLayer, mapProjection);
      map.basemap = basemapConfig.basemap;
      return {
        executeOnView: async (mapView: __esri.MapView) => {
          mapView.set('rotation', basemapConfig.rotation);
          applyBasemapConstraints(mapView, basemapConfig);
          // wait for the map to be ready
          await mapView.when();

          await mapView.goTo({ target: geometry }, { animate: false });
          if (this.showAssetPopup && mapView.popup) {
            mapView.popup.dockOptions = {
              buttonEnabled: false,
              position: 'top-right',
              breakpoint: {
                width: Infinity,
                height: Infinity,
              },
            };
            mapView.openPopup({
              features: [asset],
              updateLocationEnabled: true,
            });
          }
        },
      };
    }
  }
}
