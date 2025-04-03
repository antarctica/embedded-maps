import { defineConfig } from '@pandacss/dev';

import { colorsTokens, semanticColorTokens } from './panda.config/colors';
import { additionalShadows } from './panda.config/shadows';
import { insetFocusRing } from './panda.config/utilities/focusring.utility';
export default defineConfig({
  // Whether to use css reset
  preflight: true,
  strictTokens: true,
  presets: ['@pandacss/preset-base', '@pandacss/preset-panda'],
  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  globalCss: {
    html: {
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      '--global-font-body': 'var(--font-work-sans)',
      '--calcite-font-family': 'var(--font-work-sans)',
      '--shadow-contrast': '{colors.shadow-contrast}',
    },
    body: {
      bg: '{colors.htmlBackground}',
      overflow: 'hidden',
    },
  },

  conditions: {
    extend: { p3: '@media (color-gamut: p3)' },
  },

  utilities: {
    extend: {
      insetFocusRing,
    },
  },

  theme: {
    extend: {
      tokens: {
        radii: {
          none: { value: '0px' },
        },
      },
    },
  },

  hooks: {
    'config:resolved': ({ config, utils }) => {
      // Remove every colors
      const updated = utils.omit(config, ['theme.tokens.colors', 'theme.semanticTokens.colors']);
      updated.theme ??= {};
      updated.theme.tokens ??= {};
      updated.theme.semanticTokens ??= {};

      // Only add those from your custom preset
      updated.theme.tokens.colors = colorsTokens;
      updated.theme.semanticTokens.colors = semanticColorTokens;
      updated.theme.semanticTokens.shadows = additionalShadows.shadows;
      return updated;
    },
  },

  jsxFramework: 'react',
  jsxStyleProps: 'all',

  // The output directory for your css system
  outdir: 'styled-system',
});
