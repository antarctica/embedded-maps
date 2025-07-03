import { Point, SpatialReference } from '@arcgis/core/geometry';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import EsriMap from '@arcgis/core/Map';

import { MapCommand } from '@/lib/arcgis/typings/commandtypes';
import { isEsriPoint } from '@/lib/arcgis/typings/typeGuards';
import {
  ASSETIDFIELDNAME,
  ASSETLAYERMAPID,
  ASSETLAYERPORTALID,
  ASSETTYPEFIELDNAME,
} from '@/lib/config/assetLayer';
import { getBasemapConfigForMapProjection, getMapProjectionFromBbox } from '@/lib/config/basemap';
import { BBox } from '@/lib/config/schema';
import { isDefined } from '@/lib/types/typeGuards';

import { applyBasemapConstraints, applyPolarHeadingCorrection } from '../utils/mapViewUtils';

export class FindAssetCommand implements MapCommand {
  private assetLayer: FeatureLayer;
  private assetId?: string;
  private assetType?: string;
  private showAssetPopup: boolean = false;

  private getWhereClause(assetId?: string, assetType?: string): string {
    if (assetId) {
      return `${ASSETIDFIELDNAME} = '${assetId}'`;
    }
    if (assetType) {
      return `${ASSETTYPEFIELDNAME} = '${assetType}'`;
    }
    return '';
  }

  constructor(props: { assetId?: string; assetType?: string; showAssetPopup?: boolean }) {
    this.assetId = props.assetId;
    this.assetType = props.assetType;
    this.showAssetPopup = props.showAssetPopup ?? false;

    this.assetLayer = new FeatureLayer({
      id: ASSETLAYERMAPID,
      title: 'asset-layer',
      portalItem: {
        id: ASSETLAYERPORTALID,
      },
      definitionExpression: this.getWhereClause(this.assetId, this.assetType),
      // featureEffect: new FeatureEffect({
      //   filter: new FeatureFilter({
      //     where: `${ASSETFIELDNAME} = '${this.assetId}'`,
      //   }),
      //   excludedEffect: 'opacity(0%)',
      // }),Change this logic so that if there is just an asset ID it gets a singular asset via a query. [BLANK_AUDIO]
    });
  }

  private async getInitialAssets(): Promise<__esri.Graphic[] | null> {
    try {
      const query = this.assetLayer.createQuery();
      query.where = this.getWhereClause(this.assetId, this.assetType);
      query.returnGeometry = true;
      query.outFields = ['*'];

      query.outSpatialReference = SpatialReference.WGS84;
      const result = await this.assetLayer.queryFeatures(query);

      if (result.features.length === 0) {
        return null;
      }

      return result.features;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  calculateEnvelopeBbox(points: Point[]): BBox {
    const minLon = Math.min(...points.map((point) => point.longitude ?? 0));
    const minLat = Math.min(...points.map((point) => point.latitude ?? 0));
    const maxLon = Math.max(...points.map((point) => point.longitude ?? 0));
    const maxLat = Math.max(...points.map((point) => point.latitude ?? 0));
    return [minLon, minLat, maxLon, maxLat];
  }

  async executeOnMap(map: EsriMap) {
    map.add(this.assetLayer);
    const assets = await this.getInitialAssets();
    if (!assets || assets.length === 0) {
      return;
    }

    const bbox = this.calculateEnvelopeBbox(
      assets.map((asset) => asset.geometry).filter((geom) => isDefined(geom) && isEsriPoint(geom)),
    );
    if (bbox) {
      const mapProjection = getMapProjectionFromBbox(bbox);
      const basemapConfig = getBasemapConfigForMapProjection(mapProjection);
      applyPolarHeadingCorrection(this.assetLayer, mapProjection);
      map.basemap = basemapConfig.basemap;

      return {
        executeOnView: async (mapView: __esri.MapView) => {
          mapView.set('rotation', basemapConfig.rotation);
          applyBasemapConstraints(mapView, basemapConfig);
          // wait for the map to be ready
          await mapView.when();

          await mapView.goTo({ target: assets }, { animate: false });
          if (this.showAssetPopup && mapView.popup) {
            mapView.popup.dockOptions = {
              buttonEnabled: false,
              position: 'bottom-right',
              breakpoint: {
                width: Infinity,
                height: Infinity,
              },
            };
            mapView.popup.highlightEnabled = false;
            mapView.openPopup({
              features: assets,
              updateLocationEnabled: true,
            });
          }
        },
      };
    }
  }
}
