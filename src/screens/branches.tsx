import Header from '@/components/header'
import React from 'react'
import { Pressable, Text } from 'react-native'

const Branches = ({ navigation }) => {

    return (
        <>
            <Header />
            <Text>Şubeler</Text>
            <Pressable
                onPress={() => navigation.goBack()}
            >
                <Text>
                    Geri Dön
                </Text>
            </Pressable>
        </>
    )
}

export { Branches }