import { describe, expect, it } from 'vitest';

import { isDefined } from '../typeGuards';

describe('isDefined', () => {
  it('should return true for defined values', () => {
    expect(isDefined(0)).toBe(true);
    expect(isDefined('')).toBe(true);
    expect(isDefined(false)).toBe(true);
    expect(isDefined({})).toBe(true);
    expect(isDefined([])).toBe(true);
  });

  it('should return false for null and undefined', () => {
    expect(isDefined(null)).toBe(false);
    expect(isDefined(undefined)).toBe(false);
  });

  // Type checking test
  it('should properly narrow types', () => {
    const value: string | null = 'test';
    if (isDefined(value)) {
      // TypeScript should recognize value as string here
      const length: number = value.length;
      expect(length).toBe(4);
    }
  });
});
