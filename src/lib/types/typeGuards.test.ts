import { describe, expect, it } from 'vitest';

import { isDefined } from './typeGuards';

describe('isDefined', () => {
  it.each([
    [0, true],
    ['', true],
    [false, true],
    [{}, true],
    [[], true],
    [null, false],
    [undefined, false],
  ] as const)('returns %s for %j', (value, expected) => {
    expect(isDefined(value)).toBe(expected);
  });

  it('narrows nullable types', () => {
    const value: string | null = 'test';
    if (isDefined(value)) {
      expect(value.length).toBe(4);
    }
  });
});
