import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import Header from '@/components/header'
import QRCode from 'react-native-qrcode-svg'
import ImageBackground from '@/atoms/image-background'
import { useAtom } from 'jotai'
import { userInfoStateAtom } from '@/states/auth'

const QrScreen = () => {

    const [userInfoState,] = useAtom(userInfoStateAtom)

    return (
        <>
            <Header />
            <ImageBackground
                source={require('@/assets/images/text-bg.png')}
                resizeMode="cover"
                minHeight="100%"
                flex={1}
            >
                <View
                    style={[styles.qrCodeContainer]}
                >
                    <QRCode
                        value={String(userInfoState.cariID)}
                        size={300}
                    />
                    <View>
                        <Text style={[styles.qrText]}>QR Kodu kasa görevlisine okutunuz...</Text>
                    </View>
                </View>
            </ImageBackground>
        </>
    )
}

export default QrScreen

const styles = StyleSheet.create({
    qrCodeContainer: {
        alignItems: 'center',
        marginTop: 80,
    },
    qrText: {
        fontSize: 16,
        marginTop: 50,
        color: "gray"
    }
})