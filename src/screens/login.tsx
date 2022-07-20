// API Imports
import React from 'react'
import { useTheme } from '@shopify/restyle'
import { useAtom } from 'jotai'
import { useNavigation } from '@react-navigation/native'

// Component Imports
import { KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, ScrollView, } from 'react-native'
import { Formik } from 'formik'
import { Box, Text, ImageBackground, TextInput, Button } from '@/atoms/'

// Service/State Imports
import { login } from '@/services/auth'
import { categoriesAtom, productsAtom, UserState, userStateAtom } from '@/states/auth'

// Model Imports

type FormValues = {
  phoneNumber: string;
  password: string;
}

function LoginScreen() {

  const [userState, setUserState] = useAtom(userStateAtom)
  const navigation = useNavigation()
  const { colors, spacing } = useTheme()

  let userStateBuffer: any = null

  const submitLogin = async (values: FormValues) => {
    const response = await login(values.phoneNumber, '')
      .then((res) => {
        userStateBuffer = res
        console.log('Okey')
      })
      .catch((err) => {
        console.log(err)
      })

    setUserState(userStateBuffer)
    console.log(userState)

    if (userState.status) {
      console.log('Ata')
      console.log(userState)
      navigation.navigate('Main')
    } else {
      console.log(userState.message)
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        flexGrow: 1,
        padding: spacing.xl,
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
            <Box flex={1}>
              <Text color="loginHeader" fontSize={36} marginBottom="xl">
                Giriş Yap
              </Text>
              <Formik
                initialValues={{ phoneNumber: '', password: '' }}
                onSubmit={(values: FormValues) => submitLogin(values)}
              >
                {({ handleChange, handleBlur, handleSubmit, values }) => (
                  <>
                    <Box width="100%" marginBottom="xl">
                      <TextInput
                        keyboardType="phone-pad"
                        placeholder="Telefon"
                        placeholderTextColor={colors.neutral500}
                        value={values.phoneNumber}
                        onChangeText={handleChange('phoneNumber')}
                        onBlur={handleBlur('phoneNumber')}
                      />
                    </Box>
                    <Box width="100%" marginBottom="xl">
                      <TextInput
                        secureTextEntry={true}
                        placeholder="Şifre"
                        placeholderTextColor={colors.neutral500}
                        value={values.password}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                      />
                    </Box>
                    <Button
                      label="GİRİŞ YAP"
                      onPress={handleSubmit}
                      backgroundColor="buttonBackground"
                      padding="md"
                      borderRadius="sm"
                      shadowColor="black"
                      shadowOpacity={0.4}
                      shadowRadius={8.3}
                      elevation={20}
                      shadowOffset={{ width: 0, height: 6 }}
                    />
                  </>
                )}
              </Formik>
            </Box>
          </ImageBackground>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}

export default LoginScreen
