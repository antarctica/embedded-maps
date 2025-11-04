import Layer from '@arcgis/core/layers/Layer';
import EsriMap from '@arcgis/core/Map';
import PortalItem from '@arcgis/core/portal/PortalItem';

import { MapCommand } from '@/lib/arcgis/typings/commandtypes';

export class AddPortalLayersCommand implements MapCommand {
  private portalItemIds: string[];

  constructor(portalItemIds: string[]) {
    this.portalItemIds = portalItemIds;
  }

  async executeOnMap(map: EsriMap) {
    const layers = await Promise.all(
      this.portalItemIds.map((id) =>
        Layer.fromPortalItem({
          portalItem: new PortalItem({ id }),
        }),
      ),
    );

    layers.forEach((layer, index) => {
      if (!layer.id) {
        layer.id = `portal-layer-${index}`;
      }
      map.add(layer);
    });
  }
}
