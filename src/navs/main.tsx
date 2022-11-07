import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import TabBar from '@/components/tab-bar'

import QrScreen from '@/screens/qr-screen'
import HomeScreen from '@/screens/home'
import ProductsScreen from '@/screens/products'
import OrderScreen from '@/screens/order'
import ProfileScreen from '@/screens/Profile'

export type MainNavigation = {
  Home: undefined
  Profile: undefined
  QrScreen: undefined
  Products: undefined
  Order: undefined
}

const Tab = createBottomTabNavigator<MainNavigation>()

const screenOptions = {
  tabBarStyle: {
    backgroundColor: '#0000ff',
    height: 100,
  },
  tabBarItemStyle: {
    backgroundColor: '#00ff00',
    margin: 5,
    borderRadius: 10,
  }
};

function MainNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={props => <TabBar {...props} />}
      {...{ screenOptions }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Anasayfa', headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil', headerShown: false }}
      />
      <Tab.Screen
        name="QrScreen"
        component={QrScreen}
        options={{ title: 'QR', headerShown: false }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{ title: 'Ürünler', headerShown: false }}
      />
      <Tab.Screen
        name="Order"
        component={OrderScreen}
        options={{ title: 'Sepet', headerShown: false }}
      />
    </Tab.Navigator>
  )
}

export default MainNavigation
