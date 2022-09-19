import React from 'react'
import { ImageBackground } from "@/atoms"
import { useNavigation } from "@react-navigation/native"
import { StackActions } from '@react-navigation/native'

import { useEffect } from "react"
import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage"
import { login } from '@/services/auth'
import { useAtom } from 'jotai'
import { userStateAtom } from '@/states/auth'
import { UserState } from '@/models/models'

const MMKV = new MMKVLoader().initialize();

const SplashScreen = () => {

    const navigation = useNavigation()
    const [userState, setUserState] = useAtom(userStateAtom)
    const [userLoginAsync,] = useMMKVStorage("userLoginAsync", MMKV)

    const submitLogin = async (values: any) => {
        const response = await login(values.phoneNumber, values.password)
            .then((res: any) => {
                const buffer: UserState = res ? res : {}
                setUserState(buffer)
            })
            .catch((err) => {
                const buffer: UserState = { status: false, data: '', message: 'Hata' }
                setUserState(buffer)
                console.log(err)
            })
    }

    useEffect(() => {
        setTimeout(() => {
            if (userLoginAsync && userLoginAsync.phoneNumber && userLoginAsync.password) {
                submitLogin(userLoginAsync)
            } else {
                navigation.dispatch(
                    StackActions.replace('Auth')
                );
            }
        }, 1000)
    }, [])

    useEffect(() => {
        if (userState.status) {
            navigation.dispatch(
                StackActions.replace('Main')
            );
        } else {
            console.log(userState.message)
        }
    }, [userState])

    return (
        <ImageBackground
            source={require('@/assets/images/splash_image.jpeg')}
            resizeMode="cover"
            minHeight="100%"
            flex={1}
        />
    )
}

export default SplashScreen