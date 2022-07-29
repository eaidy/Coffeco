import React from 'react'
import { Box, Text } from '@/atoms'
import Header from '@/components/header'

function DiscountTagsScreen() {
  return (
    <>
      <Header />
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text>Bu İndirim Kartları Sayfasıdır.</Text>
      </Box>
    </>
  )
}

export default DiscountTagsScreen
