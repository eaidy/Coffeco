import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import {
  useRestyle,
  spacing,
  SpacingProps,
  border,
  BorderProps,
  backgroundColor,
  BackgroundColorProps,
  shadow,
  ShadowProps,
  composeRestyleFunctions,
} from '@shopify/restyle'
import { Theme } from '@/themes'
import Text from './text'

type RestyleProps = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  ShadowProps<Theme>

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  spacing,
  border,
  backgroundColor,
  shadow,
])

type Props = RestyleProps & {
  onPress: () => void
  label: string
}

const Button = ({ onPress, label, ...rest }: Props) => {
  const props = useRestyle(restyleFunctions, rest)

  return (
    <TouchableOpacity onPress={onPress}>
      <View {...props}>
        <Text variant="buttonVariant">{label}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default Button
