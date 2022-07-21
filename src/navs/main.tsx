import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import TabBar from '@/components/tab-bar'

import ProductScreen from '@/screens/product'
import QrScreen from '@/screens/qr-screen'
import HomeScreen from '@/screens/home'
import DiscountTagsScreen from '@/screens/discount-tags'
import ProductsScreen from '@/screens/products'
import OrderScreen from '@/screens/order'
import { backgroundColor } from '@shopify/restyle'

export type MainNavigation = {
  Home: undefined
  DiscountTags: undefined
  QrScreen: undefined
  Products: undefined
  Order: undefined
  Product: undefined
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
        options={{ title: 'Anasayfa' }}
      />
      <Tab.Screen
        name="DiscountTags"
        component={DiscountTagsScreen}
        options={{ title: 'İndirim Kartları' }}
      />
      <Tab.Screen
        name="QrScreen"
        component={QrScreen}
        options={{ title: 'QR' }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{ title: 'Ürünler' }}
      />
      <Tab.Screen
        name="Order"
        component={OrderScreen}
        options={{ title: 'Sipariş Ver' }}
      />

    </Tab.Navigator>
  )
}

export default MainNavigation
