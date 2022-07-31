// API Imports
import React, { useEffect, useState } from 'react'
import { color, useTheme } from '@shopify/restyle'
import { useAtom } from 'jotai'
import { useNavigation } from '@react-navigation/native'
import { StackActions } from '@react-navigation/native'

// Component Imports
import { StyleSheet, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, ScrollView, View, Image, Pressable, } from 'react-native'
import { Formik } from 'formik'
import { Box, Text, ImageBackground, TextInput, Button } from '@/atoms/'

// Service/State Imports
import { login } from '@/services/auth'
import { categoriesAtom, productsAtom, userStateAtom } from '@/states/auth'

// Model Imports
import { UserState } from '@/models/models'
import CheckBox from '@react-native-community/checkbox';
import { Checkbox } from 'react-native-paper';

type FormValues = {
    phoneNumber: string;
    password: string;
}

function LoginScreen() {

    const [rememberMe, setRememberMe] = useState(false)
    const [userState, setUserState] = useAtom(userStateAtom)

    const navigation = useNavigation()
    const { colors, spacing } = useTheme()

    const submitLogin = async (values: FormValues) => {

        const response = await login(values.phoneNumber, values.password)
            .then((res: any) => {
                const buffer: UserState = res ? res : {}
                console.log(buffer, 'Deneme')
                setUserState(buffer)
                console.log(userState)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        if (userState.status) {
            console.log('Ata')
            navigation.dispatch(
                StackActions.replace('Main')
            );
        } else {
            console.log(userState.message)
        }
    }, [userState])

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
                            {/* <Text color="loginHeader" fontSize={36} marginBottom="xl">
                Giriş Yap
              </Text> */}
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
                                        {
                                            !userState.status && userState.data !== '' &&
                                            (
                                                <Text style={styles.errorValidation}>Telefon numarası ya da şifre hatalı</Text>
                                            )
                                        }
                                        <View style={styles.altBox}>
                                            <View>
                                                <View style={styles.rememberMe}>
                                                    <Text style={styles.rememberMeText}>Beni Hatırla : </Text>
                                                    <Checkbox
                                                        status={rememberMe ? 'checked' : 'unchecked'}
                                                        onPress={() => setRememberMe((prev) => !prev)}
                                                        color="#1B854B"
                                                    />
                                                </View>
                                            </View>
                                            <View>
                                                <Pressable
                                                    onPress={() => navigation.navigate('ForgetPassword')}
                                                >
                                                    <Text style={[styles.rememberMeText, { color: '#1B854B', marginLeft: 15, fontSize: 14 }]}>Şifremi unuttum?</Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    </>
                                )}
                            </Formik>

                            <View style={styles.link}>
                                <Text style={styles.linkText}>Hesabın yok mu ?</Text>
                                <Pressable
                                    onPress={() => navigation.navigate('Signup')}
                                >
                                    <Text style={styles.linkBold}>Hemen Kaydol 25 Bonus kazan!</Text>
                                </Pressable>
                            </View>
                        </Box>
                    </ImageBackground>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    errorValidation: {
        color: 'red',
        fontSize: 14,
        alignSelf: 'center',
        fontFamily: 'Nunito-SemiBold',
        marginTop: 20
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
        fontSize: 14
    },
    logoBottom: {
        alignSelf: 'center',
        height: 200,
        width: 200,
        marginBottom: 60
    },
    altBox: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 15
    },
    link: {
        marginTop: '4%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    linkText: {
        color: '#7F8487',
        fontFamily: 'Nunito-Regular',
        textAlign: 'center',
        fontSize: 14
    },
    linkBold: {
        marginLeft: 6,
        fontFamily: 'Nunito-Regular',
        color: '#1B854B',
        textAlign: 'center',
        fontSize: 14
    }
})
