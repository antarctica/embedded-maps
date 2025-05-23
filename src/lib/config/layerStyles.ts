import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';

export const DEFAULT_POINT_SYMBOL = new SimpleMarkerSymbol({
  color: '#CC0033',
  outline: {
    width: 1,
    color: 'white',
  },
  size: 6,
});
