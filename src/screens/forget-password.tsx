import Header from '@/components/header'
import React, { useState } from 'react'
import { color, useTheme } from '@shopify/restyle'
import {
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  View,
  Pressable,
  Alert
} from 'react-native'
import { Formik } from 'formik'
import { Box, Text, ImageBackground, TextInput, Button } from '@/atoms/'
import { ResponseModel } from '@/models/models'
import * as Yup from 'yup'
import { ActivityIndicator } from 'react-native-paper'
import { StackActions } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

const validationSchemaOne = Yup.object({
  Cep: Yup.string()
    .trim()
    .max(10, 'Telefon numarası 10 karakter olmalıdır.')
    .min(10, 'Telefon numarası 10 karakter olmalıdır.')
    .required('Telefon numarası gereklidir'),
  Email: Yup.string()
    .email('Geçersiz E-Posta adresi')
    .required('E-Postannız gereklidir.')
})

const validationSchemaTwo = Yup.object({
  Password: Yup.string()
    .trim()
    .min(8, 'Şifre çok kısa')
    .required('Şifre girmediniz'),
  RePassword: Yup.string().equals(
    [Yup.ref('Password'), null],
    'Şifreler uyuşmuyor'
  ),
})

const ForgetPassword = ({ navigation }) => {

  const { colors } = useTheme()
  const [firstResponse, setFirstResponse] = useState<ResponseModel>({
    status: false,
    data: '',
    message: ''
  })
  const [secondResponse, setSecondResponse] = useState<ResponseModel>({
    status: false,
    data: null,
    message: ''
  })

  const [email, setEmail] = useState('')

  const [codeMatch, setCodeMatch] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const submitRequest = (values: any) => {
    setEmail(values.Email)
    console.log(values)
    setIsLoading(true)
    fetch('https://api.coffeco.com.tr/ui/UIntegration/ForgotPassword', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    })
      .then((res) => {
        console.log(res)
        return res.json()
      })
      .then((resp) => {
        console.log(resp, 'RESP')
        setIsLoading(false)
        setFirstResponse(resp)
      })
      .catch((err) => {
        setIsLoading(false)
        console.log(err, 'ATA')
      })
  }

  const submitRequestTwo = (values: any) => {
    setIsLoading(true)
    fetch('https://api.coffeco.com.tr/ui/UIntegration/SetPassword', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    })
      .then((res) => {
        return res.json()
      })
      .then((resp) => {
        setIsLoading(false)
        setSecondResponse(resp)
        Alert.alert(
          resp.status ? "Şifre başarıyla yenilendi." : resp.message,
          resp.message,
          [
            {
              text: "Giriş Yap",
              onPress: () => navigation.dispatch(StackActions.replace('Auth'))
            }
          ]
        )
        console.log(resp)
      })
      .catch((err) => {
        console.log(err)
      })
  }



  return (
    <SafeAreaView style={{
      flex: 1,
      paddingBottom: 10,
      backgroundColor: '#fff'
    }}
    >
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

              {
                !firstResponse.status &&
                (
                  <Formik
                    initialValues={{ Cep: '', Email: '', Password: '', RePassword: '', Soyadi: '' }}
                    validationSchema={validationSchemaOne}
                    onSubmit={(values: any) => submitRequest(values)}
                  >
                    {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
                      <>
                        <Box width="100%" marginBottom="xl">
                          <TextInput
                            keyboardType="phone-pad"
                            placeholder="Telefon Numarası"
                            placeholderTextColor={colors.neutral500}
                            value={values.Cep}
                            onChangeText={handleChange('Cep')}
                            onBlur={handleBlur('Cep')}
                          />
                          <Text style={[styles.errorValidation]}>
                            {touched.Cep && errors.Cep}
                          </Text>
                        </Box>
                        <Box width="100%" marginBottom="xl">
                          <TextInput
                            placeholder="E-Mail"
                            placeholderTextColor={colors.neutral500}
                            value={values.Email}
                            onChangeText={handleChange('Email')}
                            onBlur={handleBlur('Email')}
                          />
                          <Text style={[styles.errorValidation]}>
                            {touched.Email && errors.Email}
                          </Text>
                        </Box>
                        {
                          isLoading &&
                          (
                            <ActivityIndicator animating={true} color='#1B854B' style={{ marginBottom: 15 }} />
                          )
                        }
                        <Button
                          label="ŞİFREYİ DEĞİŞTİR"
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
                        {
                          !firstResponse.status &&
                          (
                            <Text style={styles.errorValidation}>{firstResponse.message}</Text>
                          )
                        }
                      </>
                    )}
                  </Formik>
                )
              }
              {
                firstResponse.status &&
                (
                  <Formik
                    initialValues={{ Code: '', Email: email, Password: '', RePassword: '', sessionID: firstResponse.data }}
                    validationSchema={validationSchemaTwo}
                    onSubmit={(values: any) => submitRequestTwo(values)}
                  >
                    {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
                      <>
                        <Box width="100%" marginBottom="xl">
                          <TextInput
                            keyboardType="phone-pad"
                            placeholder="Onay Kodu (Mailinize gelmiştir)"
                            placeholderTextColor={colors.neutral500}
                            value={values.Code}
                            onChangeText={handleChange('Cep')}
                            onBlur={handleBlur('Cep')}
                          />
                          <Text style={[styles.errorValidation]}>
                            {touched.Code && errors.Code}
                          </Text>
                        </Box>
                        <Box width="100%" marginBottom="xl">
                          <TextInput
                            placeholder="Yeni Şifre"
                            placeholderTextColor={colors.neutral500}
                            value={values.Password}
                            onChangeText={handleChange('Password')}
                            onBlur={handleBlur('Password')}
                          />
                          <Text style={[styles.errorValidation]}>
                            {touched.Password && errors.Password}
                          </Text>
                        </Box>
                        <Box width="100%" marginBottom="xl">
                          <TextInput
                            placeholder="Yeni Şifre Tekrar"
                            placeholderTextColor={colors.neutral500}
                            value={values.RePassword}
                            onChangeText={handleChange('RePassword')}
                            onBlur={handleBlur('RePassword')}
                          />
                          <Text style={[styles.errorValidation]}>
                            {touched.RePassword && errors.RePassword}
                          </Text>
                        </Box>
                        {
                          isLoading &&
                          (
                            <ActivityIndicator animating={true} color='#1B854B' style={{ marginBottom: 15 }} />
                          )
                        }
                        <Button
                          label="GÖNDER"
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
                        {
                          !firstResponse.status &&
                          (
                            <Text style={styles.errorValidation}>{firstResponse.message}</Text>
                          )
                        }
                      </>
                    )}
                  </Formik>
                )
              }

              <View style={styles.link}>
                <Pressable onPress={() => navigation.goBack()}>
                  <Text style={styles.linkText}>Geri Dön</Text>
                </Pressable>
              </View>
            </ImageBackground>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
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
  errorValidation: {
    color: '#FF1E00',
    fontSize: 12,
    marginLeft: 8,
    marginTop: 5,
    fontFamily: 'Nunito-SemiBold',
  }
})
