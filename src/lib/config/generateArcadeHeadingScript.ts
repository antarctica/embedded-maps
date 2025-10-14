import { MapProjection } from './basemap';

interface ArcadeHeadingConfig {
  longitudeField: string;
  headingField: string;
  projection: MapProjection.ANTARCTIC | MapProjection.ARCTIC;
}

export function generateArcadeHeadingScript(config: ArcadeHeadingConfig): string {
  const arcadeScript = `
// Calculate the map rotation angle needed to orient the map so that local north points up
function calculateLocalNorthRotation(longitude, projection) {
  // Antarctic (EPSG:3031): Central meridian at 0°, but projection is mirrored (negate longitude)
  var adjustedLongitude = longitude;
 if (projection == 'antarctic') {
    adjustedLongitude = -longitude; // Projection is mirrored
  }
  
  return (adjustedLongitude + 360) % 360;
}

// Get the projection correction
var projectionCorrection = calculateLocalNorthRotation($feature.${config.longitudeField}, '${config.projection}');
var heading = $feature.${config.headingField};

// Calculate the final symbol rotation
// Subtract the projection correction to correct for the coordinate system
var symbolRotation = (heading - projectionCorrection + 360) % 360;

return symbolRotation;
`.trim();

  return arcadeScript;
}
