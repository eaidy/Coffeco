// API Imports
import React from 'react'
import { useNavigation, StackActions } from '@react-navigation/native'
import { Pressable, Text, View } from 'react-native'
import MainNavigation from '@/navs/main'
import { backgroundColor } from '@shopify/restyle'

function FeedbackScreen() {
    const navigation = useNavigation()
    return (
        <>
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    paddingTop: 150
                }}
            >
                <Pressable
                    onPress={() =>
                        navigation.dispatch(
                            StackActions.replace('Main')
                        )}
                >
                    <Text
                        style={{
                            fontSize: 17,
                            marginBottom: 20,
                            width: 200,
                            textAlign: 'center'

                        }}
                    >
                        Bu safya geliştirme aşamasındadır.
                    </Text>
                    <Text
                        style={{
                            fontSize: 20,
                            borderRadius: 10,
                            backgroundColor: '#1b854b',
                            color: '#fff',
                            textAlign: 'center',
                            padding: 10
                        }}
                    >
                        Anasayfa'ya Dön
                    </Text>
                </Pressable>
            </View>
        </>
    )
}

export default FeedbackScreen