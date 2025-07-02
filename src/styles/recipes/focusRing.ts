import { appTwVariants } from '@/lib/helpers/tailwind-utils';

export const insetfocusRing = appTwVariants({
  base: 'outline -outline-offset-4 outline-accent-9',
  variants: {
    isFocusVisible: {
      false: 'outline-0',
      true: 'outline-2',
    },
  },
});

export const focusRing = appTwVariants({
  base: 'outline outline-offset-2 outline-accent-9',
  variants: {
    isFocusVisible: {
      false: 'outline-0',
      true: 'outline-2',
    },
  },
});
