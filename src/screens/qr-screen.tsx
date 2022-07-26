import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import QRCode from 'react-native-qrcode-svg';

const QrScreen = () => {
    return (
        <>
            <View
                style={[styles.qrCodeContainer]}
            >
                <QRCode
                    value="https://https://www.coffeco.com.tr/"
                    size={350}
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