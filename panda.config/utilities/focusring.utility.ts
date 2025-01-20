import { defineUtility } from '@pandacss/dev';

export const insetFocusRing = defineUtility({
  className: 'inset-focus-ring',
  values: { type: 'boolean' },
  transform(value) {
    if (!value)
      return {
        outline: 'none',
      };
    return {
      outlineColor: 'ActiveBorder',
      outlineWidth: 'thin',
      outlineOffset: '[-4px]',
    };
  },
});
