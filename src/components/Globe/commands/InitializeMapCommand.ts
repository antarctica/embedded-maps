import Basemap from '@arcgis/core/Basemap';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import EsriMap from '@arcgis/core/Map';
import UniqueValueRenderer from '@arcgis/core/renderers/UniqueValueRenderer';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';

import { MapCommand } from '@/arcgis/typings/commandtypes';
import { ASSETFIELDNAME, ASSETLAYERMAPID, ASSETLAYERPORTALID } from '@/config/assetLayer';

export class InitializeMapCommand implements MapCommand {
  constructor(
    private map: EsriMap,
    private assetId?: string,
  ) {}

  async execute(): Promise<void> {
    this.map.basemap = Basemap.fromId('satellite');
    if (this.assetId) {
      const featureLayer = new FeatureLayer({
        id: ASSETLAYERMAPID,
        portalItem: {
          id: ASSETLAYERPORTALID,
        },
        labelingInfo: [],
        renderer: new UniqueValueRenderer({
          field: ASSETFIELDNAME,
          uniqueValueInfos: [
            {
              value: this.assetId ?? 'unknown',
              symbol: new SimpleMarkerSymbol({
                color: '#CC0033',
                outline: {
                  width: 1,
                  color: 'white',
                },
                size: 6,
              }),
            },
          ],
          defaultSymbol: new SimpleMarkerSymbol({
            color: [0, 0, 0, 0],
            outline: {
              width: 0.5,
              color: '#CC003300',
            },
            size: 4,
          }),
        }),
      });
      this.map.layers.push(featureLayer);
    }
  }
}
