/**
 * Converts a measurement unit to its display abbreviation
 */
export function getDisplayUnit(unit: __esri.LengthUnit | __esri.AreaUnit): string {
  switch (unit) {
    // Length units
    case 'millimeters':
      return 'mm';
    case 'centimeters':
      return 'cm';
    case 'decimeters':
      return 'dm';
    case 'meters':
      return 'm';
    case 'kilometers':
      return 'km';
    case 'inches':
      return 'in';
    case 'feet':
      return 'ft';
    case 'yards':
      return 'yd';
    case 'miles':
      return 'mi';
    case 'nautical-miles':
      return 'nm';
    case 'us-feet':
      return 'ft';

    // Area units
    case 'square-millimeters':
      return 'mm²';
    case 'square-centimeters':
      return 'cm²';
    case 'square-decimeters':
      return 'dm²';
    case 'square-meters':
      return 'm²';
    case 'square-kilometers':
      return 'km²';
    case 'square-inches':
      return 'in²';
    case 'square-feet':
      return 'ft²';
    case 'square-yards':
      return 'yd²';
    case 'square-miles':
      return 'mi²';
    case 'acres':
      return 'ac';
    case 'hectares':
      return 'ha';
    default:
      return unit;
  }
}
