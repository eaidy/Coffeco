import React from 'react'
import { ImageBackground } from "@/atoms"
import { useNavigation } from "@react-navigation/native"
import { StackActions } from '@react-navigation/native'

import { useEffect } from "react"

const SplashScreen = () => {

    const navigation = useNavigation()
    useEffect(() => {
        setTimeout(() => {
            navigation.dispatch(
                StackActions.replace('Auth')
            );
        }, 2400)
    }, [])

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