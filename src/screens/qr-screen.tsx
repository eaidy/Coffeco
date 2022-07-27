import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import Header from '@/components/header'
import QRCode from 'react-native-qrcode-svg'

const QrScreen = () => {
    return (
        <>
            <Header />
            <View
                style={[styles.qrCodeContainer]}
            >
                <QRCode
                    value="https://www.coffeco.com.tr/"
                    size={300}
                />
            </View>
        </>
    )
}

export default QrScreen

const styles = StyleSheet.create({
    qrCodeContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 100,

    }
})