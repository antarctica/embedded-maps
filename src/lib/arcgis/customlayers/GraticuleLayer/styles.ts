import Color from '@arcgis/core/Color';

import { LabelledGraticuleLayerProperties } from './LabelledGraticuleLayerClass';

export const GRATICULE_LIGHT_STYLE: LabelledGraticuleLayerProperties['graticuleStyle'] = {
  line: {
    color: new Color([128, 128, 128, 0.8]),
    width: 1,
  },
  label: {
    color: new Color([0, 0, 0, 1]),
    font: {
      family: 'sans-serif',
      size: 8,
    },
    haloColor: new Color([255, 255, 255, 0.7]),
    haloSize: 0.5,
  },
};

export const GRATICULE_DARK_STYLE: LabelledGraticuleLayerProperties['graticuleStyle'] = {
  line: {
    color: new Color([128, 128, 128, 0.8]),
    width: 1,
  },
  label: {
    color: new Color([255, 255, 255, 1]),
    font: {
      family: 'sans-serif',
      size: 8,
    },
    haloColor: new Color([0, 0, 0, 0.7]),
    haloSize: 0.5,
  },
};
