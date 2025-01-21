import { MapProjection } from './basemap';

interface ArcadeHeadingConfig {
  longitudeField: string;
  headingField: string;
  projection: MapProjection.ANTARCTIC | MapProjection.ARCTIC;
}

export function generateArcadeHeadingScript(config: ArcadeHeadingConfig): string {
  const arcadeScript = `
// Calculate the projected bearing to pole based on longitude
function calculateProjectedBearingToPole(longitude, projection) {
  var centralMeridianCorrection = 0;
  if (projection == 'antarctic') {
    centralMeridianCorrection = 0;
  } else if (projection == 'arctic') {
    centralMeridianCorrection = -45;
  }
  return (longitude + centralMeridianCorrection + 360) % 360;
}

// Get the bearing correction based on the projection
var bearingToPole = calculateProjectedBearingToPole($feature.${config.longitudeField}, '${config.projection}');
var heading = $feature.${config.headingField};

// Calculate the final symbol rotation
var symbolRotation = (heading + bearingToPole + 360) % 360;

return symbolRotation;
`.trim();

  return arcadeScript;
}
