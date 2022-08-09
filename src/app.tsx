import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeProvider } from '@shopify/restyle'
import { useAtom } from 'jotai'

import { activeThemeAtom } from '@/states/theme'
import Navigations from '@/navs'

const App = () => {
  const [activeTheme] = useAtom(activeThemeAtom)

  return (
    <NavigationContainer>
      <ThemeProvider theme={activeTheme}>
        <Navigations />
      </ThemeProvider>
    </NavigationContainer>
  )
}

export default App
