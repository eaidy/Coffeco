import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeProvider } from '@shopify/restyle'
import { useAtom } from 'jotai'
import { activeThemeAtom } from '@/states/theme'
import Navigations from '@/navs'
import RNBootSplash from "react-native-bootsplash";


const App = () => {
  const [activeTheme] = useAtom(activeThemeAtom)

  useEffect(() => {
    RNBootSplash.hide({ fade: true });
  }, []);

  return (
    <NavigationContainer>
      <ThemeProvider theme={activeTheme}>
        <Navigations />
      </ThemeProvider>
    </NavigationContainer>
  )
}

export default App
