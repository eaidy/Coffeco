import {
  TextInput as NativeInput,
  TextInputProps as NativeInputProps,
} from 'react-native'
import {
  createRestyleComponent,
  createVariant,
  VariantProps,
  BackgroundColorProps,
  backgroundColor,
  TypographyProps,
  typography,
  ShadowProps,
  shadow,
  BorderProps,
  border,
  SpacingProps,
  spacing,
  LayoutProps,
  layout,
} from '@shopify/restyle'
import { Theme } from '@/themes'

// Text-Input variants.
const variant = createVariant<Theme>({
  themeKey: 'inputVariants',
  defaults: {
    backgroundColor: 'inputBackground',
    borderRadius: 'sm',
    shadowColor: 'inputShadow',
    color: 'inputText',
    fontSize: 16,
    padding: 'md',
    fontFamily: 'Nunito-Semibold',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8.3,
    elevation: 13,
  },
})

type Props = LayoutProps<Theme> &
  BackgroundColorProps<Theme> &
  TypographyProps<Theme> &
  ShadowProps<Theme> &
  BorderProps<Theme> &
  SpacingProps<Theme> &
  VariantProps<Theme, "inputVariants"> &
  NativeInputProps

const TextInput = createRestyleComponent<Props, Theme>(
  [layout, backgroundColor, typography, border, shadow, spacing, variant],
  NativeInput
)
export type TextnputProps = React.ComponentProps<typeof TextInput>

export default TextInput
