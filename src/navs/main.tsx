import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import TabBar from '@/components/tab-bar'

import HomeScreen from '@/screens/home'
import DiscountTagsScreen from '@/screens/discount-tags'
import ProductsScreen from '@/screens/products'
import OrderScreen from '@/screens/order'

export type MainNavigation = {
  Home: undefined
  DiscountTags: undefined
  Products: undefined
  Order: undefined
}

const Tab = createBottomTabNavigator<MainNavigation>()

function MainNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={props => <TabBar {...props} />}
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
