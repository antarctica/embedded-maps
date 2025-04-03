import { defineSemanticTokens, defineTokens } from '@pandacss/dev';

export const colorsTokens = defineTokens.colors({
  transparent: { value: 'transparent' },
  white: { value: '#ffffff' },
  black: { value: '#000000' },
  grayscale: {
    DEFAULT: {
      description: 'The default grayscale color used in the UI.',
      value: '#777777',
    },
    100: { value: '#F7F7F7' },
    200: { value: '#EEEEEE' },
    300: { value: '#d5d5d5' },
    350: { value: '#cfcfcf' },
    400: { value: '#999999' },
    500: { value: '#777777' },
    600: { value: '#555555' },
    700: { value: '#333333' },
    800: { value: '#222222' },
  },
  yellow: {
    DEFAULT: { value: '#FFBF47' },
    lighter: { value: '#FFE9C0' },
    light: { value: '#FFD484' },
    base: { value: '#FFBF47' },
    dark: { value: '#AB8030' },
    darker: { value: '#574118' },
  },
  orange: {
    DEFAULT: { value: '#F47738' },
    lighter: { value: '#FBD1BB' },
    light: { value: '#F8A47A' },
    base: { value: '#F47738' },
    dark: { value: '#A35026' },
    darker: { value: '#532813' },
  },
  aircraftRed: {
    DEFAULT: { value: '#CC0033' },
    lighter: { value: '#EEA8BA' },
    light: { value: '#DD5476' },
    base: { value: '#CC0033' },
    dark: { value: '#890022' },
    darker: { value: '#450011' },
  },
  red: {
    DEFAULT: { value: '#B10E1E' },
    lighter: { value: '#E4ADB3' },
    light: { value: '#CB5E68' },
    base: { value: '#B10E1E' },
    dark: { value: '#770914' },
    darker: { value: '#3C050A' },
  },
  babyPink: {
    DEFAULT: { value: '#F499BE' },
    lighter: { value: '#FBDCE9' },
    light: { value: '#F8BBD3' },
    base: { value: '#F499BE' },
    dark: { value: '#A3677F' },
    darker: { value: '#533441' },
  },
  pink: {
    DEFAULT: { value: '#D53880' },
    lighter: { value: '#F1BBD4' },
    light: { value: '#E37AAA' },
    base: { value: '#D53880' },
    dark: { value: '#8F2656' },
    darker: { value: '#48132C' },
  },
  fuschia: {
    DEFAULT: { value: '#912B88' },
    lighter: { value: '#DAB7D7' },
    light: { value: '#B571AF' },
    base: { value: '#912B88' },
    dark: { value: '#611D5B' },
    darker: { value: '#310F2E' },
  },
  mauve: {
    DEFAULT: { value: '#6F72AF' },
    lighter: { value: '#CECFE4' },
    light: { value: '#9FA1C9' },
    base: { value: '#6F72AF' },
    dark: { value: '#4A4C75' },
    darker: { value: '#26273C' },
  },
  skyBlue: {
    DEFAULT: { value: '#2B8CC4' },
    lighter: { value: '#B7D8EB' },
    light: { value: '#71B2D7' },
    base: { value: '#2B8CC4' },
    dark: { value: '#1D5E83' },
    darker: { value: '#0F3043' },
  },
  blue: {
    lighter: { value: '#A8BCC8' },
    light: { value: '#547B92' },
    base: { value: '#003A5D' },
    dark: { value: '#00273E' },
    darker: { value: '#001420' },
    backlog: { value: '#2E358B' },
  },
  turquoise: {
    lighter: { value: '#B6DFDC' },
    light: { value: '#6FC0B9' },
    base: { value: '#28A197' },
    dark: { value: '#1B6C65' },
    darker: { value: '#0E3733' },
  },
  green: {
    DEFAULT: { value: '#379245' },
    lighter: { value: '#BBDAC0' },
    light: { value: '#79B682' },
    base: { value: '#379245' },
    dark: { value: '#25622E' },
    darker: { value: '#133217' },
  },
  nercGreen: {
    DEFAULT: { value: '#AAB437' },
    lighter: { value: '#E2E6BB' },
    light: { value: '#C6CD79' },
    base: { value: '#AAB437' },
    dark: { value: '#727925' },
    darker: { value: '#3A3D13' },
  },
  brown: {
    DEFAULT: { value: '#795B2B' },
    lighter: { value: '#E6D7BE' },
    light: { value: '#CDAF7F' },
    base: { value: '#B58840' },
    dark: { value: '#795B2B' },
    darker: { value: '#3E2E16' },
  },

  externalService: {
    twitter: { value: '#55ACEE' },
    facebook: { value: '#3B5998' },
    youtube: { value: '#CD201F' },
    rss: { value: '#F26522' },
    orcid: { value: '#A6CE39' },
  },
});

export const semanticColorTokens = defineSemanticTokens.colors({
  htmlBackground: {
    value: {
      base: '{colors.grayscale.200}',
      _osDark: '{colors.grayscale.700}',
    },
  },
  fg: {
    value: {
      base: '{colors.grayscale.700}',
      _osDark: '{colors.grayscale.200}',
    },
  },
  scaleBar: {
    value: {
      base: '{colors.grayscale.700}',
    },
  },

  basBlue: {
    1: {
      value: {
        base: '#f8feff',
        _p3: '{colors.basBlue.p3.1}',
      },
    },
    2: {
      value: {
        base: '#f0faff',
        _p3: '{colors.basBlue.p3.2}',
      },
    },
    3: {
      value: {
        base: '#def6ff',
        _p3: '{colors.basBlue.p3.3}',
      },
    },
    4: {
      value: {
        base: '#cbefff',
        _p3: '{colors.basBlue.p3.4}',
      },
    },
    5: {
      value: {
        base: '#b5e6ff',
        _p3: '{colors.basBlue.p3.5}',
      },
    },
    6: {
      value: {
        base: '#9dd9ff',
        _p3: '{colors.basBlue.p3.6}',
      },
    },
    7: {
      value: {
        base: '#7bc8ff',
        _p3: '{colors.basBlue.p3.7}',
      },
    },
    8: {
      value: {
        base: '#4bb0f8',
        _p3: '{colors.basBlue.p3.8}',
      },
    },
    9: {
      value: {
        base: '#004871',
        _p3: '{colors.basBlue.p3.9}',
      },
    },
    10: {
      value: {
        base: '#1b5984',
        _p3: '{colors.basBlue.p3.10}',
      },
    },
    11: {
      value: {
        base: '#0071b4',
        _p3: '{colors.basBlue.p3.11}',
      },
    },
    12: {
      value: {
        base: '#003e66',
        _p3: '{colors.basBlue.p3.12}',
      },
    },
    a: {
      1: {
        value: {
          base: '#00dbff07',
          _p3: '{colors.basBlue.p3.a.1}',
        },
      },
      2: {
        value: {
          base: '#00aaff0f',
          _p3: '{colors.basBlue.p3.a.2}',
        },
      },
      3: {
        value: {
          base: '#00baff21',
          _p3: '{colors.basBlue.p3.a.3}',
        },
      },
      4: {
        value: {
          base: '#00b1ff34',
          _p3: '{colors.basBlue.p3.a.4}',
        },
      },
      5: {
        value: {
          base: '#01a9ff4a',
          _p3: '{colors.basBlue.p3.a.5}',
        },
      },
      6: {
        value: {
          base: '#009dff62',
          _p3: '{colors.basBlue.p3.a.6}',
        },
      },
      7: {
        value: {
          base: '#0095ff84',
          _p3: '{colors.basBlue.p3.a.7}',
        },
      },
      8: {
        value: {
          base: '#008ff5b4',
          _p3: '{colors.basBlue.p3.a.8}',
        },
      },
      9: {
        value: {
          base: '#004871',
          _p3: '{colors.basBlue.p3.a.9}',
        },
      },
      10: {
        value: {
          base: '#004575e4',
          _p3: '{colors.basBlue.p3.a.10}',
        },
      },
      11: {
        value: {
          base: '#0071b4',
          _p3: '{colors.basBlue.p3.a.11}',
        },
      },
      12: {
        value: {
          base: '#003e66',
          _p3: '{colors.basBlue.p3.a.12}',
        },
      },
    },
    p3: {
      1: { value: 'oklch(99.3% 0.008 242.8)' },
      2: { value: 'oklch(98% 0.0153 242.8)' },
      3: { value: 'oklch(96.1% 0.0366 242.8)' },
      4: { value: 'oklch(94.2% 0.063 242.8)' },
      5: { value: 'oklch(90.3% 0.0729 242.8)' },
      6: { value: 'oklch(86.1% 0.0907 242.8)' },
      7: { value: 'oklch(80.6% 0.1132 242.8)' },
      8: { value: 'oklch(73% 0.1395 242.8)' },
      9: { value: 'oklch(38.6% 0.093 242.8)' },
      10: { value: 'oklch(44.7% 0.093 242.8)' },
      11: { value: 'oklch(52.8% 0.1395 242.8)' },
      12: { value: 'oklch(34.9% 0.093 242.8)' },
      a: {
        1: { value: 'color(display-p3 0.0235 0.8392 1 / 0.024)' },
        2: { value: 'color(display-p3 0.0039 0.6157 0.9255 / 0.051)' },
        3: { value: 'color(display-p3 0.0039 0.6471 0.9647 / 0.11)' },
        4: { value: 'color(display-p3 0.0039 0.6235 0.9569 / 0.177)' },
        5: { value: 'color(display-p3 0.0039 0.5961 0.9569 / 0.251)' },
        6: { value: 'color(display-p3 0.0039 0.5333 0.9569 / 0.334)' },
        7: { value: 'color(display-p3 0.0039 0.502 0.9569 / 0.448)' },
        8: { value: 'color(display-p3 0 0.4667 0.9137 / 0.597)' },
        9: { value: 'color(display-p3 0 0.1882 0.3608 / 0.891)' },
        10: { value: 'color(display-p3 0 0.2039 0.3961 / 0.824)' },
        11: { value: 'color(display-p3 0 0.3059 0.6157 / 0.812)' },
        12: { value: 'color(display-p3 0 0.1647 0.3294 / 0.91)' },
      },
    },
  },

  'shadow-contrast': {
    value: {
      base: 'white',
      _osDark: 'hsl(245, 12%, 23%)',
    },
  },
});
