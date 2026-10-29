import Point from '@arcgis/core/geometry/Point';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';
import type Graphic from '@arcgis/core/Graphic';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import EsriMap from '@arcgis/core/Map';
import type MapView from '@arcgis/core/views/MapView';
import type * as React from 'react';

import { MapCommand } from '@/lib/arcgis/typings/commandtypes';
import { isEsriPoint } from '@/lib/arcgis/util/geometry';
import {
  ASSETIDFIELDNAME,
  ASSETLAYERMAPID,
  ASSETLAYERPORTALID,
  ASSETTYPEFIELDNAME,
} from '@/lib/config/assetLayer';
import { getBasemapConfigForMapProjection, getMapProjectionFromBbox } from '@/lib/config/basemap';
import { BBox } from '@/lib/config/schema';
import { isDefined } from '@/lib/types/typeGuards';

import { applyBasemapConstraints } from '../utils/mapViewUtils';

export class FindAssetCommand implements MapCommand {
  private assetLayer: FeatureLayer;
  private assetIds?: string[];
  private assetTypes?: string[];
  private showAssetPopup: boolean = false;
  private popupRef?: React.RefObject<HTMLArcgisPopupElement | null>;

  private getWhereClause(assetIds?: string[], assetTypes?: string[]): string {
    const clauses: string[] = [];
    if (assetIds && assetIds.length > 0) {
      const quoted = assetIds.map((v) => `'${v}'`).join(', ');
      clauses.push(`${ASSETIDFIELDNAME} IN (${quoted})`);
    }
    if (assetTypes && assetTypes.length > 0) {
      const quoted = assetTypes.map((v) => `'${v}'`).join(', ');
      clauses.push(`${ASSETTYPEFIELDNAME} IN (${quoted})`);
    }
    return clauses.length > 1 ? `(${clauses.join(' OR ')})` : (clauses[0] ?? '');
  }

  constructor(props: {
    assetIds?: string[];
    assetTypes?: string[];
    showAssetPopup?: boolean;
    popupRef?: React.RefObject<HTMLArcgisPopupElement | null>;
  }) {
    this.assetIds = props.assetIds;
    this.assetTypes = props.assetTypes;
    this.showAssetPopup = props.showAssetPopup ?? false;
    this.popupRef = props.popupRef;

    this.assetLayer = new FeatureLayer({
      id: ASSETLAYERMAPID,
      title: 'asset-layer',
      portalItem: {
        id: ASSETLAYERPORTALID,
      },
      definitionExpression: this.getWhereClause(this.assetIds, this.assetTypes),
    });
  }

  private async getInitialAssets(): Promise<Graphic[] | null> {
    try {
      const query = this.assetLayer.createQuery();
      query.where = this.getWhereClause(this.assetIds, this.assetTypes);
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
      map.basemap = basemapConfig.basemap;

      return {
        executeOnView: async (mapView: MapView) => {
          mapView.set('rotation', basemapConfig.rotation);
          applyBasemapConstraints(mapView, basemapConfig);
          // wait for the map to be ready
          await mapView.when();

          await mapView.goTo({ target: assets }, { animate: false });
          // Open the slotted arcgis-popup rather than mapView.openPopup(), which uses the view's
          // internal popup and renders beneath the map controls.
          const popup = this.popupRef?.current;
          if (this.showAssetPopup && popup) {
            popup.highlightDisabled = true;
            popup.updateLocationEnabled = true;
            popup.features = assets;
            popup.location = assets[0]?.geometry?.type === 'point' ? assets[0].geometry : undefined;
            popup.open = true;
          }
        },
      };
    }
  }
}
