import { tv } from 'tailwind-variants';

import { focusRing } from '@/styles/recipes/focusRing';

export const buttonRecipe = tv({
  extend: focusRing,
  base: 'border-1px inline-flex h-fit cursor-pointer items-center justify-center no-underline',
  variants: {
    variant: {
      mapButton:
        'rounded-sm border-transparent bg-blue-9 text-white shadow-sm hover:bg-blue-10 active:brightness-92 active:saturate-110 disabled:bg-blue-9/70 theme-legacy:border theme-legacy:border-gray-8 theme-legacy:bg-gray-2 theme-legacy:text-gray-12 theme-legacy:hover:bg-gray-3 theme-legacy:disabled:bg-gray-2/70 theme-legacy:disabled:text-gray-12/70',
    },
    size: {
      sm: 'h-6 gap-1 rounded-sm px-1 py-0.5 text-xs theme-legacy:rounded-none',
      md: 'text-md h-8 gap-2 rounded-md px-1.5 py-1 theme-legacy:rounded-none',
      lg: 'h-10 gap-2 rounded-md px-2 py-2 text-lg theme-legacy:rounded-none',
    },
    contained: {
      true: 'rounded-none',
    },
    isDisabled: {
      true: 'cursor-not-allowed hover:text-gray-4',
    },
    IconButton: {
      true: 'p-0',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
  compoundVariants: [
    {
      variant: 'mapButton',
      size: 'md',
      className: 'h-8 w-8 md:h-10 md:w-10',
    },
    {
      variant: 'mapButton',
      size: 'lg',
      className: 'h-10 w-10 md:h-12 md:w-12',
    },
    {
      variant: 'mapButton',
      size: 'sm',
      className: 'h-6 w-6 md:h-8 md:w-8',
    },
  ],
});
