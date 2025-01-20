import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import FeatureEffect from '@arcgis/core/layers/support/FeatureEffect';
import FeatureFilter from '@arcgis/core/layers/support/FeatureFilter';
import EsriMap from '@arcgis/core/Map';

import { MapCommand, PostInitCommand } from '@/arcgis/typings/commandtypes';
import { ASSETFIELDNAME, ASSETLAYERMAPID, ASSETLAYERPORTALID } from '@/config/assetLayer';
import { getBasemapConfigForMapProjection, getMapProjectionFromPosition } from '@/config/map';

import { applyBasemapConstraints, applyPolarHeadingCorrection } from '../utils';

export class FindAssetCommand implements MapCommand {
  private assetLayer: FeatureLayer;

  constructor(
    private map: EsriMap,
    private assetId: string,
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

  async execute(): Promise<void | PostInitCommand> {
    this.map.add(this.assetLayer);
    const assetLocation = await this.getAssetLocation();
    if (assetLocation) {
      const { longitude, latitude } = assetLocation;
      const mapProjection = getMapProjectionFromPosition([longitude, latitude]);
      const basemapConfig = getBasemapConfigForMapProjection(mapProjection);
      this.map.basemap = basemapConfig.basemap;
      return {
        execute: (mapView: __esri.MapView) => {
          applyBasemapConstraints(mapView, basemapConfig);
          applyPolarHeadingCorrection(mapView, mapProjection);
          mapView.goTo({ target: assetLocation, rotation: basemapConfig.rotation, scale: 1000000 });
        },
      };
    }
  }
}
