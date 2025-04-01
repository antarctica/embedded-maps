import Accessor from '@arcgis/core/core/Accessor';
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { describe, expect, it } from 'vitest';

import { isEqual } from '../isEqual';

@subclass('custom.LabelledGraticuleLayer')
class mockEqualityAccessor extends Accessor {
  constructor(id: string) {
    super();
    this.id = id;
  }

  @property()
  id: string;

  equals(other: mockEqualityAccessor) {
    return this.id === other?.id;
  }
}

describe('isEqual', () => {
  // Primitive values
  it('should compare primitive values correctly', () => {
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual('test', 'test')).toBe(true);
    expect(isEqual(true, true)).toBe(true);
    expect(isEqual(1, 2)).toBe(false);
    expect(isEqual('test', 'other')).toBe(false);
    expect(isEqual(true, false)).toBe(false);
  });

  it('should handle null and undefined', () => {
    expect(isEqual(null, null)).toBe(true);
    expect(isEqual(undefined, undefined)).toBe(true);
    expect(isEqual(null, undefined)).toBe(false);
  });

  it('should handle NaN values', () => {
    expect(isEqual(NaN, NaN)).toBe(true);
  });

  // Objects
  it('should compare objects correctly', () => {
    expect(isEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(isEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
  });

  it('should handle nested objects', () => {
    const obj1 = { a: { b: { c: 1 } } };
    const obj2 = { a: { b: { c: 1 } } };
    const obj3 = { a: { b: { c: 2 } } };
    expect(isEqual(obj1, obj2)).toBe(true);
    expect(isEqual(obj1, obj3)).toBe(false);
  });

  // Arrays
  it('should compare arrays correctly', () => {
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  // Special types
  it('should compare Map instances correctly', () => {
    const map1 = new Map([
      ['a', 1],
      ['b', 2],
    ]);
    const map2 = new Map([
      ['a', 1],
      ['b', 2],
    ]);
    const map3 = new Map([
      ['a', 1],
      ['b', 3],
    ]);
    expect(isEqual(map1, map2)).toBe(true);
    expect(isEqual(map1, map3)).toBe(false);
  });

  it('should compare Set instances correctly', () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([1, 2, 3]);
    const set3 = new Set([1, 2, 4]);
    expect(isEqual(set1, set2)).toBe(true);
    expect(isEqual(set1, set3)).toBe(false);
  });

  it('should compare RegExp objects correctly', () => {
    expect(isEqual(/test/i, /test/i)).toBe(true);
    expect(isEqual(/test/i, /test/g)).toBe(false);
    expect(isEqual(/test/, /other/)).toBe(false);
  });

  // ArcGIS specific
  it('should handle ArcGIS accessor objects', () => {
    const arcObj1 = new mockEqualityAccessor('1');
    const arcObj2 = new mockEqualityAccessor('1');
    const arcObj3 = new mockEqualityAccessor('2');
    expect(isEqual(arcObj1, arcObj1)).toBe(true);
    expect(isEqual(arcObj1, arcObj2)).toBe(true);
    expect(isEqual(arcObj1, arcObj3)).toBe(false);
  });
});
