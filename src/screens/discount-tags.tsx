import React from 'react'
import { Box, Text, ImageBackground } from '@/atoms'
import Header from '@/components/header'

function DiscountTagsScreen() {
  return (
    <>
      <Header />
      <ImageBackground
        source={require('@/assets/images/text-bg.png')}
        resizeMode="cover"
        minHeight="100%"
        flex={1}
      >
        <Box flex={1} justifyContent="center" alignItems="center">
          <Text>Bu İndirim Kartları Sayfasıdır.</Text>
        </Box>
      </ImageBackground>
    </>
  )
}

export default DiscountTagsScreen
