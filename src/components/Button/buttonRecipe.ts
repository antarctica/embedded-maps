import { cva } from '@styled-system/css';

export const buttonRecipe = cva({
  base: {
    cursor: 'pointer',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 'thin',
    height: 'fit',
    textDecoration: 'none',
  },
  variants: {
    variant: {
      mapButton: {
        borderColor: 'transparent',
        borderRadius: 'sm',
        color: 'white',
        bg: 'basBlue.9',
        shadow: 'sm',
        _disabled: {
          bg: 'basBlue.a.10',
          _hover: {
            bg: 'basBlue.a.10',
          },
        },
        _hover: {
          bg: 'basBlue.10',
        },
        _active: {
          filter: '[brightness(0.92) saturate(1.1)]',
        },
      },
    },
    size: {
      sm: {
        gap: '1',
        borderRadius: 'xs',
        h: '6',
        py: '0.5',
        px: '1',
        fontSize: 'xs',
      },
      md: {
        gap: '2',
        borderRadius: 'sm',
        h: '8',
        p: '1.5',
        fontSize: 'md',
      },
      lg: {
        gap: '2',
        borderRadius: 'sm',
        h: '10',
        p: '2',
        fontSize: 'lg',
      },
    },
    contained: {
      true: {
        borderRadius: 'none',
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
  compoundVariants: [
    {
      variant: 'mapButton',
      size: 'md',
      css: {
        h: '8',
        w: '8',
        md: {
          h: '10',
          w: '10',
        },
      },
    },
    {
      variant: 'mapButton',
      size: 'lg',
      css: {
        h: '10',
        w: '10',
        md: {
          h: '12',
          w: '12',
        },
      },
    },
    {
      variant: 'mapButton',
      size: 'sm',
      css: {
        h: '6',
        w: '6',
        md: {
          h: '8',
          w: '8',
        },
      },
    },
  ],
});
