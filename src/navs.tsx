// API Imports
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'

// Nested Navigators Imports
import AuthNavigation from '@/navs/auth'
import MainNavigation from '@/navs/main'

// Single Screen Imports
import ProfileScreen from '@/screens/Profile'
import ProductScreen from '@/screens/product'
import FeedbackScreen from '@/screens/feedback'
import { ForgetPassword } from './screens/forget-password'
import { Branches } from './screens/branches'


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
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Product"
        component={ProductScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ForgetPassword"
        component={ForgetPassword}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Branches"
        component={Branches}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}
