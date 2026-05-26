/**
 * Type guard utility functions for the SIIS application.
 *
 * This module provides type-safe utility functions for checking values
 * and narrowing types at runtime. These functions help ensure type safety
 * when working with potentially null or undefined values.
 */

/**
 * Type guard to check if a value is defined (not null or undefined).
 *
 * This function provides a type-safe way to check if a value exists,
 * narrowing the type from `T | null | undefined` to `T`.
 *
 * @template T - The type of the value when defined
 * @param value - The value to check
 * @returns True if the value is not null or undefined, false otherwise
 *
 * @example
 * ```typescript
 * const maybeString: string | null = getString();
 * if (isDefined(maybeString)) {
 *   // maybeString is now typed as string
 *   console.log(maybeString.length);
 * }
 * ```
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value != null;
}

/**
 * Type guard to check if a value is a defined number greater than zero.
 *
 * This function combines null/undefined checking with a positive number check,
 * useful for validating numeric values that must be positive (like counts,
 * sizes, or durations).
 *
 * @param value - The value to check
 * @returns True if the value is a number greater than zero, false otherwise
 *
 * @example
 * ```typescript
 * const maybeCount: number | null = getCount();
 * if (isDefinedAndGreaterThanZero(maybeCount)) {
 *   // maybeCount is now typed as number and guaranteed to be > 0
 *   console.log(`Count: ${maybeCount}`);
 * }
 * ```
 */
export function isDefinedAndGreaterThanZero(value: number | null | undefined): value is number {
  return isDefined(value) && value > 0;
}
