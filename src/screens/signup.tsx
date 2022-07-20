import React, { useState } from 'react'
import { Box, Text, ImageBackground, TextInput, Button } from '@/atoms/'
import { useTheme } from '@shopify/restyle'
import { register } from '@/services/register'
import {
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native'
import { Formik } from 'formik'
import HomeScreen from './home'

type FormValues = {
  Phone: Number
}

function SignupScreen() {
  const { colors, spacing } = useTheme()
  async function submitRegister(values: any) {
    await register(values.Phone, '')
  }
  return (
    <ScrollView
      contentContainerStyle={{
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
                Üyelik Oluştur
              </Text>
            </Box>
            <Formik
              initialValues={{
                Phone: '',
                Email: '',
                Password: '',
                RePassword: '',
                Name: '',
                Surname: '',
                City: '',
                Address: '',
              }}
              onSubmit={async values => await submitRegister(values)}
            >
              {({ handleChange, handleBlur, handleSubmit, values }) => (
                <>
                  <Box
                    alignItems="stretch"
                    justifyContent="space-between"
                    flexDirection="row"
                    marginBottom="xl"
                  >
                    <Box flex={1} marginEnd="md">
                      <TextInput
                        placeholder="Ad"
                        placeholderTextColor={colors.neutral500}
                        value={values.Name}
                        onChange={handleChange('Name')}
                        onBlur={handleBlur('Name')}
                      />
                    </Box>
                    <Box flex={1}>
                      <TextInput
                        placeholder="Soyad"
                        value={values.Surname}
                        onChangeText={handleChange('Surname')}
                        onBlur={handleBlur('Surname')}
                        placeholderTextColor={colors.neutral500}
                      />
                    </Box>
                  </Box>
                  <Box marginBottom="xl">
                    <TextInput
                      keyboardType="phone-pad"
                      placeholder="Telefon"
                      value={values.Phone}
                      onChangeText={handleChange('Phone')}
                      onBlur={handleBlur('Phone')}
                      placeholderTextColor={colors.neutral500}
                    />
                  </Box>
                  <Box marginBottom="xl">
                    <TextInput
                      secureTextEntry={true}
                      placeholder="Şifre"
                      value={values.Password}
                      onChangeText={handleChange('Password')}
                      onBlur={handleBlur('Password')}
                      placeholderTextColor={colors.neutral500}
                    />
                  </Box>
                  <Box marginBottom="xl">
                    <TextInput
                      secureTextEntry={true}
                      placeholder="Şifre Onay"
                      value={values.RePassword}
                      onChangeText={handleChange('RePassword')}
                      onBlur={handleBlur('RePassword')}
                      placeholderTextColor={colors.neutral500}
                    />
                  </Box>
                  <Box marginBottom="xl">
                    <Text textAlign="center" color="actionText" fontSize={14}>
                      Davetiye Kodu Gir
                    </Text>
                  </Box>
                  <Button
                    label="KAYIT OL"
                    onPress={handleSubmit}
                    backgroundColor="buttonBackground"
                    padding="md"
                    marginBottom="xl"
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
            <Box>
              <Text textAlign="center" color="mutedActionText" fontSize={14}>
                Zaten hesabın var mı? <Text color="actionText">Giriş Yap</Text>
              </Text>
            </Box>
          </ImageBackground>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}

export default SignupScreen
