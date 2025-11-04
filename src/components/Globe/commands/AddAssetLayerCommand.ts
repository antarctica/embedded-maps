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
  private assetIds?: string[];
  private assetTypes?: string[];

  constructor(props: { assetIds?: string[]; assetTypes?: string[] }) {
    this.assetIds = props.assetIds;
    this.assetTypes = props.assetTypes;
  }

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

  async executeOnMap(map: EsriMap): Promise<void> {
    const featureLayer = new FeatureLayer({
      id: ASSETLAYERMAPID,
      portalItem: {
        id: ASSETLAYERPORTALID,
      },
      definitionExpression: this.getWhereClause(this.assetIds, this.assetTypes),
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
