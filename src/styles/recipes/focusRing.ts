import { tv } from 'tailwind-variants';

export const insetfocusRing = tv({
  base: 'outline -outline-offset-4 outline-blue-9',
  variants: {
    isFocusVisible: {
      false: 'outline-0',
      true: 'outline-2',
    },
  },
});

export const focusRing = tv({
  base: 'outline outline-offset-2 outline-blue-9',
  variants: {
    isFocusVisible: {
      false: 'outline-0',
      true: 'outline-2',
    },
  },
});
