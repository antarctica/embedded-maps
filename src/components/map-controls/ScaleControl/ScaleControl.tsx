/* eslint-disable @pandacss/no-hardcoded-color */
import '@arcgis/map-components/dist/components/arcgis-scale-bar';

import { cva } from '@styled-system/css';

const scaleControlStyleOverride = cva({
  base: {
    '& .esri-scale-bar__label': {
      color: 'scaleBar !important',
    },
    '& .esri-scale-bar__line--top': {
      borderBottomColor: 'scaleBar !important',

      _before: {
        borderColor: 'scaleBar !important',
      },
      _after: {
        borderColor: 'scaleBar !important',
      },
    },

    '& .esri-scale-bar__line--bottom': {
      borderTopColor: 'scaleBar !important',

      _before: {
        borderColor: 'scaleBar !important',
      },
      _after: {
        borderColor: 'scaleBar !important',
      },
    },
    '& .esri-scale-bar__line': {
      bg: 'grayscale.300/50 !important',
    },
  },
});

function ScaleControl() {
  return (
    <div className={scaleControlStyleOverride()}>
      <arcgis-scale-bar unit="dual" />
    </div>
  );
}

export default ScaleControl;
