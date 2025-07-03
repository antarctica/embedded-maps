/**
 * Converts radians to degrees.
 * @param {number} radians - The angle in radians.
 * @returns {number} The angle in degrees.
 */
export function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Converts degrees to radians.
 * @param {number} degrees - The angle in degrees.
 * @returns {number} The angle in radians.
 */
export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Creates a smooth scaled symbol size based on the current map scale.
 * @param {number} scale - The current map scale.
 * @param {number} [minScale=32] - The minimum scale value.
 * @param {number} [maxScale=10] - The maximum scale value.
 * @param {number} [baseScale=100000000] - The base scale for normalization.
 * @param {number} [zoomedScale=10000] - The zoomed scale for normalization.
 * @returns {number} The calculated symbol size.
 */
export function createSmoothScaledSymbolSize(
  scale: number,
  minScale: number = 32,
  maxScale: number = 10,
  baseScale = 100000000,
  zoomedScale = 10000,
): number {
  const logBase4Scale = Math.log(scale) / Math.log(4);

  // Normalize the scale between a large zoom scale (e.g., 1,000,000) and a smaller zoom scale (e.g., 100)
  const normalizedScale =
    (logBase4Scale - Math.log(baseScale) / Math.log(4)) /
    (Math.log(zoomedScale) / Math.log(4) - Math.log(baseScale) / Math.log(4));

  // Ensure the size changes smoothly between minScale and maxScale
  const calculatedSize = minScale + (maxScale - minScale) * (1 - normalizedScale);

  // Clamp to ensure within bounds
  return Math.max(maxScale, Math.min(minScale, calculatedSize));
}

/**
 * Generates a circle of points around a center point.
 * @param {number} numVertices - The number of vertices to generate.
 * @param {number} radius - The radius of the circle.
 * @param {Array<number>} [center=[0, 0]] - The center point of the circle.
 * @returns {Array<Array<number>>} An array of points representing the circle.
 */
export function generateCircleRings(
  numVertices: number,
  radius: number,
  center: [number, number] = [0, 0],
): number[][] {
  const points: number[][] = [];
  const [centerX, centerY] = center;

  // Generate points around the circle
  for (let i = 0; i <= numVertices; i++) {
    // Use <= to close the circle by repeating the first point
    const angle = (i * 2 * Math.PI) / numVertices;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push([x, y]);
  }
  return points;
}

/**
 * Calculates the bearing between two projected map points in degrees (0 - 360).
 * Uses Euclidean geometry on the projected (flat) map surface.
 * Bearing is measured clockwise from the top of the screen (north).
 * For example:
 * - 0° points North (up)
 * - 90° points East (right)
 * - 180° points South (down)
 * - 270° points West (left)
 * @param {number} x1 - The projected x-coordinate of the first point.
 * @param {number} y1 - The projected y-coordinate of the first point.
 * @param {number} x2 - The projected x-coordinate of the second point.
 * @param {number} y2 - The projected y-coordinate of the second point.
 * @returns {number} The bearing in degrees, normalized to 0-360 range.
 */
export function calculateProjectedMapBearing(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  const radians = Math.atan2(deltaX, deltaY);
  const degrees = 90 - toDegrees(radians); // Convert to bearing from top of the screen
  return (degrees + 360) % 360;
}

/**
 * Calculates the mathematical angle between two projected map points in degrees (0 - 360).
 * Uses Euclidean geometry on the projected (flat) map surface.
 * The angle is measured counter-clockwise from the positive x-axis (east).
 * For example:
 * - 0° points East (right)
 * - 90° points North (up)
 * - 180° points West (left)
 * - 270° points South (down)
 * @param {number} x1 - The projected x-coordinate of the first point.
 * @param {number} y1 - The projected y-coordinate of the first point.
 * @param {number} x2 - The projected x-coordinate of the second point.
 * @param {number} y2 - The projected y-coordinate of the second point.
 * @returns {number} The angle in degrees, normalized to 0-360 range.
 */
export function calculateProjectedMapAngle(x1: number, y1: number, x2: number, y2: number): number {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  const radians = Math.atan2(deltaY, deltaX);
  const degrees = toDegrees(radians);
  return (degrees + 360) % 360;
}

/**
 * Calculates the initial bearing (forward azimuth) between two points on Earth.
 * Uses the Haversine formula to calculate the bearing on a great circle path.
 * @param {number} lat1 - Latitude of the first point in degrees.
 * @param {number} lon1 - Longitude of the first point in degrees.
 * @param {number} lat2 - Latitude of the second point in degrees.
 * @param {number} lon2 - Longitude of the second point in degrees.
 * @returns {number} The initial bearing in degrees, normalized to 0-360 range.
 */
export function calculateGeographicBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δλ = toRadians(lon2 - lon1);

  // Calculate bearing
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  let θ = Math.atan2(y, x);
  θ = toDegrees(θ);

  // Normalize bearing to 0-360 degrees
  return (θ + 360) % 360;
}
