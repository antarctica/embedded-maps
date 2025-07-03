import EsriMap from '@arcgis/core/Map';

import { LabelledGraticuleLayer } from '@/lib/arcgis/customlayers/GraticuleLayer/LabelledGraticuleLayerClass';
import { GRATICULE_LIGHT_STYLE } from '@/lib/arcgis/customlayers/GraticuleLayer/styles';
import { MapCommand } from '@/lib/arcgis/typings/commandtypes';
import { getConstraintsForWkid } from '@/lib/config/basemap';

export class AddGraticuleCommand implements MapCommand {
  constructor(private showGraticule: boolean) {}

  async executeOnMap(map: EsriMap) {
    return {
      executeOnView: async (mapView: __esri.MapView) => {
        if (!this.showGraticule) {
          return;
        }
        const constraints = getConstraintsForWkid(mapView?.spatialReference.wkid ?? 4326);
        const graticuleLayer = new LabelledGraticuleLayer({
          title: 'graticule-layer',
          graticuleBounds: {
            minLatitude: constraints.minY,
            maxLatitude: constraints.maxY,
          },
          graticuleStyle: GRATICULE_LIGHT_STYLE,
        });
        map.add(graticuleLayer);
      },
    };
  }
}
