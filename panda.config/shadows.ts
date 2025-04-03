import { defineSemanticTokens } from '@pandacss/dev';

export const additionalShadows = defineSemanticTokens({
  shadows: {
    sm: {
      value: {
        base: '0px 1px 2px hsl(0, 0%, 0%, 25%), 0px 1px 3px hsl(0, 0%, 0%, 9%)',
        _dark: '0px 1px 2px hsl(0, 0%, 0%, 25%), 0px 1px 3px hsl(0, 0%, 0%, 9%)',
      },
    },
    md: {
      value:
        '0px 0px 2px hsl(0, 0%, 0%, 16%), 0px 2px 3px hsl(0, 0%, 0%, 24%), 0px 2px 6px hsl(0, 0%, 0%, .1), inset 0px 0px 0px 1px {colors.shadow-contrast}',
    },
    lg: {
      value:
        '0px 1px 2px hsl(0, 0%, 0%, 28%), 0px 2px 6px hsl(0, 0%, 0%, 14%), inset 0px 0px 0px 1px {colors.shadow-contrast}',
    },
    xl: {
      value:
        '0px 0px 3px hsl(0, 0%, 0%, 19%), 0px 5px 4px hsl(0, 0%, 0%, 16%), 0px 2px 16px hsl(0, 0%, 0%, 6%), inset 0px 0px 0px 1px {colors.shadow-contrast}',
    },
  },
});
