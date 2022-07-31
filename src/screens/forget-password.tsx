import Header from '@/components/header'
import React from 'react'
import { color, useTheme } from '@shopify/restyle'
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
import { Formik } from 'formik'
import { Box, Text, ImageBackground, TextInput, Button } from '@/atoms/'

const ForgetPassword = ({ navigation }) => {
  const { colors } = useTheme()
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
                Şifremi Unuttum
              </Text>
              <Box width="100%" marginBottom="xl">
                <TextInput
                  keyboardType="default"
                  placeholder="E-Posta"
                  placeholderTextColor={colors.neutral500}
                  value={''}
                />
              </Box>
              <Box width="100%" marginBottom="xl">
                <TextInput
                  keyboardType="phone-pad"
                  placeholder="Cep Telefonu"
                  placeholderTextColor={colors.neutral500}
                  value={''}
                />
              </Box>
              <Box width="100%" marginBottom="xl">
                <Button
                  label="ŞİFREYİ SIFIRLA"
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

export { ForgetPassword }

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
