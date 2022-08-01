// API Imports
import React, { useState } from 'react'
import { useTheme } from '@shopify/restyle'
import { register } from '@/services/register'
import * as Yup from 'yup'
import { ActivityIndicator, MD2Colors } from 'react-native-paper'
// Component Imports
import {
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native'
import { Box, Text, ImageBackground, TextInput, Button } from '@/atoms/'
import { Formik } from 'formik'
import Toast from 'react-native-simple-toast'

// Model Imports
import { RegisterFormModel } from '@/models/models'
import { NavigationContainer } from '@react-navigation/native'

const validationSchema = Yup.object({
  Adi: Yup.string().trim().required('İsminizi giriniz'),
  Soyadi: Yup.string().trim().required('Soyadınızı giriniz'),
  Cep: Yup.string()
    .trim()
    .max(10, 'Numaranızı başında 0 olmadan giriniz.')
    .min(10, 'Numaranızı başında 0 olmadan giriniz.')
    .required('Telefon numarası gereklidir'),
  Email: Yup.string()
    .email('Geçersiz E-Posta adresi')
    .required('E-Postanızı giriniz'),
  Password: Yup.string()
    .trim()
    .min(8, 'Şifre çok kısa')
    .required('Şifre girmediniz'),
  RePassword: Yup.string().equals(
    [Yup.ref('Password'), null],
    'Şifreler uyuşmuyor'
  ),
})

function SignupScreen({ navigation }) {
  const { colors, spacing } = useTheme()

  const initialFormValues: RegisterFormModel = {
    Adi: '',
    Soyadi: '',
    Cep: '',
    Email: '',
    Password: '',
    RePassword: '',
  }

  const [isLoading, setIsLoading] = useState(false)

  async function submitRegister(values: RegisterFormModel) {
    setIsLoading(true)
    const response = await register(values)

    if (response.status) {
      Toast.showWithGravity(
        `Üyelik başarılı! Giriş yapabilirsiniz.`,
        Toast.SHORT,
        Toast.TOP
      )
      setIsLoading(false)
      navigation.navigate('Login')
    } else {
      Toast.showWithGravity(response.message, Toast.SHORT, Toast.TOP)
      setIsLoading(false)
    }
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
              <Text
                color="loginHeader"
                fontSize={26}
                marginBottom="md"
                textAlign="center"
                style={styles.pageTitle}
              >
                Üyelik Oluştur
              </Text>
              {
                isLoading &&
                (
                  <ActivityIndicator animating={true} color='#1B854B' style={{ marginBottom: 15 }} />
                )
              }
            </Box>
            <Formik
              initialValues={initialFormValues}
              validationSchema={validationSchema}
              onSubmit={values => submitRegister(values)}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
              }) => {
                return (
                  <>
                    <Box
                      alignItems="stretch"
                      justifyContent="space-between"
                      flexDirection="row"
                      marginBottom="sm"
                    >
                      <Box flex={1} marginEnd="md">
                        <TextInput
                          placeholder="Ad"
                          placeholderTextColor={colors.neutral500}
                          value={values.Adi}
                          onChangeText={handleChange('Adi')}
                          onBlur={handleBlur('Adi')}
                        />
                        <Text style={[styles.errorValidation]}>
                          {touched.Adi && errors.Adi}
                        </Text>
                      </Box>
                      <Box flex={1}>
                        <TextInput
                          placeholder="Soyad"
                          value={values.Soyadi}
                          onChangeText={handleChange('Soyadi')}
                          onBlur={handleBlur('Soyadi')}
                          placeholderTextColor={colors.neutral500}
                        />
                        <Text style={[styles.errorValidation]}>
                          {touched.Soyadi && errors.Soyadi}
                        </Text>
                      </Box>
                    </Box>
                    <Box marginBottom="sm">
                      <TextInput
                        placeholder="E-Posta"
                        value={values.Email}
                        onChangeText={handleChange('Email')}
                        onBlur={handleBlur('Email')}
                        placeholderTextColor={colors.neutral500}
                      />
                      <Text style={[styles.errorValidation]}>
                        {touched.Email && errors.Email}
                      </Text>
                    </Box>
                    <Box marginBottom="sm">
                      <TextInput
                        keyboardType="phone-pad"
                        placeholder="Cep"
                        value={values.Cep}
                        onChangeText={handleChange('Cep')}
                        onBlur={handleBlur('Cep')}
                        placeholderTextColor={colors.neutral500}
                      />
                      <Text style={[styles.errorValidation]}>
                        {touched.Cep && errors.Cep}
                      </Text>
                    </Box>
                    <Box marginBottom="sm">
                      <TextInput
                        secureTextEntry={true}
                        placeholder="Şifre"
                        value={values.Password}
                        onChangeText={handleChange('Password')}
                        onBlur={handleBlur('Password')}
                        placeholderTextColor={colors.neutral500}
                      />
                      <Text style={[styles.errorValidation]}>
                        {touched.Password && errors.Password}
                      </Text>
                    </Box>
                    <Box marginBottom="sm">
                      <TextInput
                        secureTextEntry={true}
                        placeholder="Şifre Onay"
                        value={values.RePassword}
                        onChangeText={handleChange('RePassword')}
                        onBlur={handleBlur('RePassword')}
                        placeholderTextColor={colors.neutral500}
                      />
                      <Text style={[styles.errorValidation]}>
                        {touched.RePassword && errors.RePassword}
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
                )
              }}
            </Formik>
            <Box>
              <Text textAlign="center" color="mutedActionText" fontSize={14}>
                Zaten hesabın var mı?
                <Pressable onPress={() => navigation.navigate('Login')}>
                  <Text color="actionText">Giriş Yap</Text>
                </Pressable>
              </Text>
            </Box>
          </ImageBackground>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}

export default SignupScreen

const styles = StyleSheet.create({
  errorValidation: {
    color: '#5FD068',
    fontSize: 12,
    marginLeft: 8,
    marginTop: 5,
    fontFamily: 'Nunito-SemiBold',
  },
  pageTitle: {
    fontFamily: 'Nunito-Bold',
  },
})
