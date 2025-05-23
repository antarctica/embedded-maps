import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import EsriMap from '@arcgis/core/Map';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';

import { MapCommand } from '@/lib/arcgis/typings/commandtypes';
import {
  ASSETIDFIELDNAME,
  ASSETLAYERMAPID,
  ASSETLAYERPORTALID,
  ASSETTYPEFIELDNAME,
} from '@/lib/config/assetLayer';

export class AddAssetLayerCommand implements MapCommand {
  private assetId?: string;
  private assetType?: string;

  constructor(props: { assetId?: string; assetType?: string }) {
    this.assetId = props.assetId;
    this.assetType = props.assetType;
  }

  private getWhereClause(assetId?: string, assetType?: string): string {
    if (assetId) {
      return `${ASSETIDFIELDNAME} = '${assetId}'`;
    }
    if (assetType) {
      return `${ASSETTYPEFIELDNAME} = '${assetType}'`;
    }
    return '';
  }

  async executeOnMap(map: EsriMap): Promise<void> {
    const featureLayer = new FeatureLayer({
      id: ASSETLAYERMAPID,
      portalItem: {
        id: ASSETLAYERPORTALID,
      },
      definitionExpression: this.getWhereClause(this.assetId, this.assetType),
      labelingInfo: [],
      renderer: new SimpleRenderer({
        symbol: new SimpleMarkerSymbol({
          color: '#CC0033',
          outline: {
            width: 1,
            color: 'white',
          },
          size: 6,
        }),
      }),
    });
    map.add(featureLayer);
  }
}
