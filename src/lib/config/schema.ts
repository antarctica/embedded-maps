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

// =========================================
// Portal Item IDs Types and Validation
// =========================================

/**
 * Represents either a single Portal Item ID string or an array of strings
 */
export const PortalItemIdsParam = z.union([z.string(), z.array(z.string())]);
export type PortalItemIdsParam = z.infer<typeof PortalItemIdsParam>;

/**
 * Converts a portal item IDs parameter to an array of strings
 * @param idsParam - Single string or array of strings
 * @returns Array of portal item id strings
 * @throws Error if the parameter is invalid
 */
export function portalItemIdsParamToArray(idsParam: PortalItemIdsParam): string[] {
  if (typeof idsParam === 'string') {
    return [idsParam];
  }

  if (Array.isArray(idsParam) && idsParam.every((v) => typeof v === 'string')) {
    return idsParam;
  }

  throw new Error('Invalid portal item IDs parameter');
}

// =========================================
// Asset IDs / Types Types and Validation
// =========================================

/**
 * Represents either a single Asset ID or an array of Asset IDs
 */
export const AssetIdsParam = z.union([z.string(), z.array(z.string())]);
export type AssetIdsParam = z.infer<typeof AssetIdsParam>;

/**
 * Converts an asset IDs parameter to an array of strings
 */
export function assetIdsParamToArray(idsParam: AssetIdsParam): string[] {
  if (typeof idsParam === 'string') {
    return [idsParam];
  }
  if (Array.isArray(idsParam) && idsParam.every((v) => typeof v === 'string')) {
    return idsParam;
  }
  throw new Error('Invalid asset IDs parameter');
}

/**
 * Represents either a single Asset Type (number) or an array of Asset Types (numbers)
 * URL query params (strings) are coerced to numbers, then coerced to strings when used in queries
 */
export const AssetTypesParam = z.union([z.coerce.number(), z.array(z.coerce.number())]);
export type AssetTypesParam = z.infer<typeof AssetTypesParam>;

/**
 * Converts an asset types parameter to an array of strings
 * Numbers are coerced to strings for use in SQL queries
 */
export function assetTypesParamToArray(typesParam: AssetTypesParam): string[] {
  if (typeof typesParam === 'number') {
    return [String(typesParam)];
  }
  if (Array.isArray(typesParam) && typesParam.every((v) => typeof v === 'number')) {
    return typesParam.map((v) => String(v));
  }
  throw new Error('Invalid asset types parameter');
}
