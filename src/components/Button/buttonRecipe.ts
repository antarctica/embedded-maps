import { appTwVariants } from '@/lib/helpers/tailwind-utils';
import { focusRing } from '@/styles/recipes/focusRing';

export const buttonRecipe = appTwVariants({
  extend: focusRing,
  base: 'border-1px inline-flex h-fit cursor-pointer items-center justify-center no-underline',
  variants: {
    variant: {
      mapButton:
        'rounded-full border-transparent bg-accent-9 text-white shadow-sm hover:bg-accent-10 active:brightness-92 active:saturate-110 disabled:bg-accent-9/70 theme-bsk1:border theme-bsk1:border-gray-8 theme-bsk1:bg-gray-2 theme-bsk1:text-gray-12 theme-bsk1:hover:bg-gray-3 theme-bsk1:disabled:bg-gray-2/70 theme-bsk1:disabled:text-gray-12/70',
    },
    size: {
      sm: 'h-6 gap-1 rounded-sm px-1 py-0.5 text-xs theme-bsk1:rounded-none',
      md: 'text-md h-8 gap-2 rounded-md px-1.5 py-1 theme-bsk1:rounded-none',
      lg: 'h-10 gap-2 rounded-md px-2 py-2 text-lg theme-bsk1:rounded-none',
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
      size: 'lg',
      className:
        'h-10 w-10 rounded-full md:h-12 md:w-12 [&>svg]:h-4 [&>svg]:w-4 md:[&>svg]:h-5 md:[&>svg]:w-5',
    },
    {
      variant: 'mapButton',
      size: 'md',
      className:
        'h-8 w-8 rounded-full md:h-10 md:w-10 [&>svg]:h-3 [&>svg]:w-3 md:[&>svg]:h-4 md:[&>svg]:w-4',
    },
    {
      variant: 'mapButton',
      size: 'sm',
      className:
        'h-6 w-6 rounded-full md:h-8 md:w-8 [&>svg]:h-2 [&>svg]:w-2 md:[&>svg]:h-3 md:[&>svg]:w-3',
    },
    {
      contained: true,
      className: 'rounded-none',
    },
  ],
});
