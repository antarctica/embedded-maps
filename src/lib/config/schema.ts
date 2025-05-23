import z from 'zod';

// =========================================
// Boolean Parameter Handling
// =========================================

/**
 * Creates a Zod schema that validates either an empty string or a boolean value.
 * Useful for handling URL query parameters where presence can indicate true.
 */
export const booleanWithoutValue = () => z.union([z.literal(''), z.boolean()]);

/**
 * Converts an empty string parameter to a boolean presence indicator.
 * @param value - The value to convert, can be empty string, boolean, or undefined
 * @returns true if the value is an empty string, otherwise returns the original boolean value
 */
export function convertEmptyStringParamToBooleanPresence(
  value: '' | boolean | undefined,
): boolean | undefined {
  if (value === '') return true;
  return value;
}

// =========================================
// Bounding Box Types and Validation
// =========================================

/**
 * Represents a bounding box as [minLon, minLat, maxLon, maxLat]
 */
export const BBox = z.tuple([z.number(), z.number(), z.number(), z.number()]);
export type BBox = z.infer<typeof BBox>;

/**
 * Represents either a single BBox or an array of BBoxes
 */
export const BBoxParam = z.union([BBox, z.array(BBox)]);
export type BBoxParam = z.infer<typeof BBoxParam>;

/**
 * Type guard to check if a value is a valid BBox
 * @param value - The value to check
 * @returns True if the value is a valid BBox
 */
export function isBBox(value: unknown): value is BBox {
  return BBox.safeParse(value).success;
}

/**
 * Converts a BBox parameter to an array of BBoxes
 * @param bboxParam - Single BBox or array of BBoxes
 * @returns Array of BBoxes
 * @throws Error if the parameter is invalid
 */
export function bboxParamToArray(bboxParam: BBoxParam): BBox[] {
  if (isBBox(bboxParam)) {
    return [bboxParam];
  }

  if (Array.isArray(bboxParam) && bboxParam.every(isBBox)) {
    return bboxParam;
  }

  throw new Error('Invalid BBox parameter');
}

// =========================================
// Map Point Types and Validation
// =========================================

/**
 * Represents a coordinate pair as [longitude, latitude]
 */
export const CoordinatePair = z.tuple([z.number(), z.number()]);
export type CoordinatePair = z.infer<typeof CoordinatePair>;

export function isCoordinatePair(value: unknown): value is CoordinatePair {
  return CoordinatePair.safeParse(value).success;
}

/**
 * Represents a map point with optional styling properties
 */
const StyledMapPoint = z.object({
  longitude: z.number(),
  latitude: z.number(),
  color: z.string().optional(),
  size: z.number().optional(),
});

/**
 * Represents either a basic coordinate pair or a styled map point
 */
export const MapPoint = z.union([CoordinatePair, StyledMapPoint]);
export type MapPoint = z.infer<typeof MapPoint>;

/**
 * Represents either a single map point or an array of map points
 */
export const MapPointParam = z.union([MapPoint, z.array(MapPoint)]);
export type MapPointParam = z.infer<typeof MapPointParam>;

/**
 * Type guard to check if a value is a valid map point
 * @param value - The value to check
 * @returns True if the value is a valid map point
 */
export function isMapPoint(value: unknown): value is MapPoint {
  return MapPoint.safeParse(value).success;
}

/**
 * Converts a map point parameter to an array of map points
 * @param mapPointParam - Single map point or array of map points
 * @returns Array of map points
 * @throws Error if the parameter is invalid
 */
export function mapPointParamToArray(mapPointParam: MapPointParam): MapPoint[] {
  if (isMapPoint(mapPointParam)) {
    return [mapPointParam];
  }

  if (Array.isArray(mapPointParam)) {
    return mapPointParam;
  }

  throw new Error('Invalid map point parameter');
}
