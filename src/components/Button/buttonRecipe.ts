import { cva } from '@styled-system/css';

export const buttonRecipe = cva({
  base: {
    color: 'grayscale.700',
    bg: 'aircraftRed.base',
    _hover: {
      bg: 'grayscale.300',
      cursor: 'pointer',
    },
    _active: {
      bg: 'grayscale.350',
    },
  },
  variants: {
    size: {
      sm: {
        p: '1',
        fontSize: 'sm',
      },
      md: {
        p: '2',
        fontSize: 'md',
      },
      lg: {
        p: '4',
        fontSize: 'lg',
      },
    },
    isDisabled: {
      true: {
        color: 'grayscale.400',
        _hover: {
          cursor: 'not-allowed',
        },
      },
    },
    isFocusVisible: {
      true: {
        insetFocusRing: true,
      },
      false: {
        insetFocusRing: false,
      },
    },
    IconButton: {
      true: {
        p: '0',
      },
    },
  },

  defaultVariants: {
    size: 'lg',
  },
});
