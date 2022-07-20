import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'

import AuthNavigation from '@/navs/auth'
import MainNavigation from '@/navs/main'

const Stack = createNativeStackNavigator()

export default function Navigations() {

  return (
    <Stack.Navigator initialRouteName="Auth">
      <Stack.Screen
        name="Auth"
        component={AuthNavigation}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Main"
        component={MainNavigation}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}
