// API Imports
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'

// Nested Navigators Imports
import AuthNavigation from '@/navs/auth'
import MainNavigation from '@/navs/main'

// Single Screen Imports
import ProfileScreen from '@/screens/Profile'
import ProductScreen from '@/screens/product'
import { ForgetPassword } from './screens/forget-password'
import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage"
import { useAtom } from 'jotai'
import { userStateAtom } from './states/auth'
import { UserState } from './models/models'
import { login } from './services/auth'


const Stack = createNativeStackNavigator()
const MMKV = new MMKVLoader().initialize();

export default function Navigations() {

  const [, setUserState] = useAtom(userStateAtom)
  const [userLoginAsync,] = useMMKVStorage("userLoginAsync", MMKV)
  const [initialRoute, setInitialRoute] = useState()

  const submitLogin = async (values: any) => {
    const response = await login(values.phoneNumber, values.password)
      .then((res: any) => {
        const buffer: UserState = res ? res : {}
        setUserState(buffer)
      })
      .catch((err: any) => {
        const buffer: UserState = { status: false, data: '', message: 'Hata' }
        setUserState(buffer)
        console.log(err)
      })
    return response
  }

  useEffect(() => {
    if (userLoginAsync && userLoginAsync.phoneNumber && userLoginAsync.password) {
      submitLogin(userLoginAsync)
        .then((res) => {
          if (res.status) {
            setInitialRoute('Main')
          }
        })
        .catch((err) => {
          console.log(err)
          setInitialRoute('Auth')
        })
    } else {
      setInitialRoute('Auth')
    }
  }, [])

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
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
        name="ForgetPassword"
        component={ForgetPassword}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}
