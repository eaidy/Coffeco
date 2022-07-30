import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import Header from '@/components/header'
import QRCode from 'react-native-qrcode-svg'
import ImageBackground from '@/atoms/image-background'

const QrScreen = () => {
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
                    value="https://www.coffeco.com.tr/"
                    size={300}
                />
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
    }
})