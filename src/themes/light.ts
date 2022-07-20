import { createTheme } from '@shopify/restyle'

// Palette
const palette = {
  black: 'black',
  white: 'white',
  red: "red",
  neutral100: '#FBFBFB',
  neutral200: '#F7F7F7',
  neutral300: '#E6E6E6',
  neutral400: '#DFDFDF',
  neutral500: '#B2B2B2',
  neutral600: '#464646',
  neutral700: '#343434',
  greenPastel: "#7A9486",
  greenLight: '#5FAA81',
  green: '#1B854B',
  greenDark: '#082816',
}

const theme = createTheme({
  colors: {
    white: palette.white,
    black: palette.black,
    neutral100: palette.neutral100,
    neutral200: palette.neutral200,
    neutral300: palette.neutral300,
    neutral400: palette.neutral400,
    neutral500: palette.neutral500,
    neutral600: palette.neutral600,
    neutral700: palette.neutral700,

    topbarTabNavigationIndicator: palette.green,
    topBarLabel: palette.greenPastel,
    tabNavigationBackground: palette.white,
    tabNavigationIcon: palette.neutral500,

    mainBackground: palette.neutral300,

    buttonBackground: palette.green,
    buttonText: palette.white,
    loginHeader: palette.green,
    text: palette.black,
    actionText: palette.green,
    mutedActionText: palette.greenPastel,

    inputText: palette.black,
    inputShadow: palette.black,
    inputShadowFocus: palette.green,
    inputBackground: palette.white,
    inputPlaceholder: palette.neutral400,
    inputError: palette.red
  },
  spacing: {
    '0': 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 48,
    hg: 128,
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  borderRadii: {
    xs: 4,
    sm: 12,
    md: 24,
    lg: 64,
    hg: 128,
  },
  textVariants: {
    defaults: {
        color: "text",
        fontSize: 16,
        fontFamily: "Nunito-Semibold"
    },
    buttonVariant: {
      color: "buttonText",
      fontSize: 18,
      textAlign: "center",
    }
  },
  inputVariants: {
    defaults: {}
  }
});

export default theme
export type Theme = typeof theme;
