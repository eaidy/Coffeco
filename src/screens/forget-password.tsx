import Header from "@/components/header"
import React from "react"
import { Pressable, Text } from "react-native"

const ForgetPassword = ({ navigation }) => {


    return (
        <>
            <Header />
            <Text> Şifre Değiştirme Sayfası</Text>
            <Pressable
                onPress={() => navigation.goBack()}
            >
                <Text>Geri Dön</Text>
            </Pressable>
        </>
    )
}

export { ForgetPassword }