import React, { useEffect } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useTheme } from '@shopify/restyle'
import { Theme } from '@/themes'

import LoginScreen from '@/screens/login'
import SignupScreen from '@/screens/signup'
import HomeScreen from '@/screens/home'
import Header from '@/components/header'
import SplashScreen from 'react-native-splash-screen'

export type AuthNavigation = {
  Login: undefined
  Signup: undefined
}

const Tab = createMaterialTopTabNavigator<AuthNavigation>()

function AuthNavigation({ navigation }) {
  const { colors, spacing } = useTheme<Theme>()

  return (
    <>
      <Header />
      <Tab.Navigator
        initialRouteName="Login"
        screenOptions={{
          tabBarIndicatorStyle: {
            backgroundColor: colors.topbarTabNavigationIndicator,
          },
          tabBarLabelStyle: {
            color: colors.topBarLabel,
            fontSize: spacing.lg,
            textTransform: 'none',
          },
        }}
      >
        <Tab.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Giriş Yap' }}
        />
        <Tab.Screen
          name="Signup"
          component={SignupScreen}
          options={{ title: 'Yeni Üyelik' }}
        />
      </Tab.Navigator>
    </>
  )
}

export default AuthNavigation
