import { getConstraintsForWkid } from '@/lib/config/basemap';

import { useCurrentMapView } from '../../hooks';
import LabelledGraticuleLayer from './LabelledGraticuleLayer';
import { LabelledGraticuleLayerProperties } from './LabelledGraticuleLayerClass';
import { GRATICULE_LIGHT_STYLE } from './styles';

export function GraticuleLayer(props: LabelledGraticuleLayerProperties) {
  const map = useCurrentMapView();
  const constraints = getConstraintsForWkid(map.spatialReference.wkid ?? 4326);

  return (
    <LabelledGraticuleLayer
      {...props}
      graticuleBounds={{
        minLatitude: constraints.minY,
        maxLatitude: constraints.maxY,
      }}
      graticuleStyle={GRATICULE_LIGHT_STYLE}
    ></LabelledGraticuleLayer>
  );
}
