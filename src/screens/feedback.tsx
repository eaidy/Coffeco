// API Imports
import React from 'react'
import { useNavigation, StackActions } from '@react-navigation/native'
import { Pressable, Text } from 'react-native'

function FeedbackScreen() {
    const navigation = useNavigation()
    return (
        <>
            <Pressable
                onPress={() =>
                    navigation.dispatch(
                        StackActions.replace('Main')
                    )}
            >
                <Text>
                    Dönüş
                </Text>
            </Pressable>
        </>
    )
}

export default FeedbackScreen