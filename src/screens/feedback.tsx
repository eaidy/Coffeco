// API Imports
import React from 'react'
import { useNavigation, StackActions } from '@react-navigation/native'
import {
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  View,
  Image,
  Pressable,
} from 'react-native'
import MainNavigation from '@/navs/main'
import { backgroundColor } from '@shopify/restyle'
import Header from '@/components/header'
import { color, useTheme } from '@shopify/restyle'
import { Box, Text, ImageBackground, TextInput, Button } from '@/atoms/'

function FeedbackScreen() {
  const { colors } = useTheme()
  const navigation = useNavigation()
  return (
    <>
      <Header />
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          flexGrow: 1,
          padding: 15,
        }}
      >
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            style={{ flex: 1 }}
          >
            <ImageBackground
              source={require('@/assets/images/text-bg.png')}
              resizeMode="cover"
              minHeight="100%"
              flex={1}
            >
              <Text
                color="loginHeader"
                fontSize={26}
                marginBottom="xl"
                textAlign="center"
                style={styles.pageTitle}
              >
                Geri Bildirim
              </Text>
              <Box width="100%" marginBottom="xl">
                <TextInput
                  keyboardType="default"
                  placeholder="Mesajınız"
                  numberOfLines={4}
                  placeholderTextColor={colors.neutral500}
                />
              </Box>
              <Box width="100%" marginBottom="xl">
                <Button
                  label="GÖNDER"
                  onPress={() => { console.log('Gönder') }}
                  backgroundColor="buttonBackground"
                  padding="md"
                  borderRadius="sm"
                  shadowColor="black"
                  shadowOpacity={0.4}
                  shadowRadius={8.3}
                  elevation={20}
                  shadowOffset={{ width: 0, height: 6 }}
                />
              </Box>

              <Pressable onPress={() => navigation.goBack()}>
                <Text>Geri Dön</Text>
              </Pressable>
            </ImageBackground>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ScrollView>
    </>
  )
}

export default FeedbackScreen

const styles = StyleSheet.create({
  errorValidation: {
    color: 'red',
    fontSize: 14,
    alignSelf: 'center',
    fontFamily: 'Nunito-SemiBold',
    marginTop: 20,
  },
  rememberMe: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  rememberMeText: {
    color: '#7F8487',
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
  },
  logoBottom: {
    alignSelf: 'center',
    height: 200,
    width: 200,
    marginBottom: 60,
  },
  altBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 15,
  },
  link: {
    marginTop: '4%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  linkText: {
    color: '#7F8487',
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
    fontSize: 14,
  },
  linkBold: {
    marginLeft: 6,
    fontFamily: 'Nunito-Regular',
    color: '#1B854B',
    textAlign: 'center',
    fontSize: 14,
  },
  pageTitle: {
    fontFamily: 'Nunito-Bold',
  },
  btnFont: {
    fontFamily: 'Nunito-Bold',
  },
})
