// API Imports
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Alert } from 'react-native'
import { useAtom } from 'jotai'
import moment from 'moment';
import { useTheme } from '@shopify/restyle'
import * as Yup from 'yup'

// Component Imports
import { Box, Button, Text, TextInput } from '@/atoms'
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import Header from '@/components/header'
import { SvgXml } from 'react-native-svg'
import { Icons } from '@/constants'
import { fetchData } from '@/services/methods'

// Service Imports
import { userInfoStateAtom, userStateAtom } from '@/states/auth'
import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage";
import { Formik } from 'formik';
import { RegisterFormModel } from '@/models/models';
import { ActivityIndicator } from 'react-native-paper';

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

type PastOrders = {
  orders: Array<Object>;
  orderLines: Array<Object>;
  variants: Array<Object>;
}

const MMKV = new MMKVLoader().initialize();

function ProfileScreen() {

  const { colors, spacing } = useTheme()
  const navigation = useNavigation()

  const [, setUserLoginAsync] = useMMKVStorage("userLoginAsync", MMKV)


  const [userState, setUserState] = useAtom(userStateAtom)
  const [userInfoState, setUserInfoState] = useAtom(userInfoStateAtom)

  const [pastOrdersLoading, setPastOrdersLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [pastOrders, setPastOrders] = useState<PastOrders>({
    orders: [],
    orderLines: [],
    variants: []
  })

  const initialFormValues: RegisterFormModel = {
    Adi: userInfoState.adi,
    Soyadi: userInfoState.soyadi,
    Cep: userInfoState.gsm,
    Email: userInfoState.email,
    Password: userInfoState.password,
    RePassword: '',
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPastOrdersLoading(true)
      fetchData('MyOrders', {
        method: 'POST',
        authToken: userState.data
      })
        .then((res) => {
          const buffer = res
          setPastOrdersLoading(false)
          setPastOrders(buffer)
        })
        .catch((err) => {
          console.log(err)
        })
    });

    return unsubscribe;
  }, [navigation]);

  const submitUpdate = (values: Object) => {
    setIsLoading(true)
    fetch('https://api.entegre.pro/ui/UIntegration/UpdateUser', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userState.data}`
      },
      body: JSON.stringify(values)
    })
      .then((res) => {
        return res.json()
      })
      .then(res => {
        console.log(res)
        setIsLoading(false)
        Alert.alert(
          res.status ? "Güncelleme Başarılı" : "Hata",
          res.message,
          [
            {
              text: "Tamam",
              onPress: () => navigation.navigate("Home")
            }
          ]
        )
      })
      .catch(err => console.log(err))
  }

  // const repeatOrder = (orderID: Number) => {
  //   Alert.alert(
  //     "Uyarı",
  //     "Siparişi tekrarla henüz geliştirme aşamasındadır.",
  //     [
  //       {
  //         text: "Cancel",
  //         onPress: () => console.log("Cancel Pressed"),
  //         style: "cancel"
  //       },
  //       {
  //         text: "OK",
  //         onPress: () => console.log("OK Pressed")
  //       }
  //     ]
  //   )
  // }

  const handleSignOut = () => {
    Alert.alert(
      "Çıkış",
      "Çıkış yapmak istediğinizden emin misiniz ?",
      [
        {
          text: "İptal",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Çıkış Yap",
          onPress: () => {
            setUserState((prev) => {
              return {
                ...prev,
                data: '',
                message: '',
                status: false
              }
            })
            setUserInfoState((prev) => {
              return {
                ...prev,
                aciklama: '',
                bonus: 0,
                cinsiyet: 0,
                email: '',
                gsm: '',
                adi: '',
                soyadi: '',
                password: ''
              }
            })
            setUserLoginAsync({ phoneNumber: "", password: "" })
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            })
          }
        }
      ]
    )
  }

  return (
    <>
      <Header />
      <ScrollView>
        <View style={styles.wrapper}>
          <View style={styles.profileTitle}>
            <Text style={styles.title}>Hesabım</Text>
            <Pressable
              style={{
                backgroundColor: '#1B854B',
                padding: 8,
                borderRadius: 14
              }}
              onPress={() => handleSignOut()}
            >
              <Text style={{ color: '#fff' }}>
                Çıkış Yap
              </Text>
            </Pressable>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.boxTitle}>
              <Text style={styles.boxTitleText}>Geçmiş Siparişlerim</Text>
            </View>
            {
              pastOrdersLoading && (
                <View style={{ height: 65, display: 'flex', justifyContent: 'center' }}>
                  <View style={{ alignSelf: 'center' }}>
                    <ActivityIndicator size={19} animating={true} color='#1B854B' style={{}} />
                  </View>
                </View>
              )
            }
            {
              !pastOrdersLoading && (
                <ScrollView
                  nestedScrollEnabled={true}
                  style={{ maxHeight: '40%' }}
                >
                  {
                    pastOrders &&
                    pastOrders.orders.reverse().map((order: any, index) =>
                    (
                      <View
                        style={styles.box}
                        key={index}
                      >
                        <View style={styles.boxTitle}>
                          <Text style={styles.boxTitleTextSmall}>
                            {moment(order.deliveryDate).format("DD.MM.YYYY  hh:mm")}
                          </Text>
                          {/* <Pressable
                            style={styles.boxTitleRemove}
                            onPress={() => repeatOrder(order.orderID)}
                          >
                            <Text style={styles.boxTitleRemoveText}>
                              Siparişi Tekrarla
                            </Text>
                          </Pressable> */}
                        </View>
                        <View style={styles.boxContent}>
                          {
                            pastOrders.orderLines &&
                            pastOrders.orderLines.filter((ordersLines: any) =>
                              ordersLines.orderID === order.orderID
                            ).map((orderLine: any, indexLine) =>
                            (
                              <View
                                style={styles.product}
                                key={indexLine}
                              >
                                <View style={styles.productLeft}>
                                  <Image
                                    style={styles.productImage}
                                    source={require('../assets/images/product.png')}
                                  />
                                  <View style={styles.productContet}>
                                    <Text style={styles.productTitle}>
                                      {orderLine.description}
                                    </Text>
                                    {
                                      pastOrders.variants &&
                                      pastOrders.variants.filter((variant: any) =>
                                        variant.orderID === order.orderID &&
                                        variant.lineID === orderLine.lineID
                                      ).map((variant: any, indexVariant) =>
                                      (
                                        <Text
                                          style={styles.productTitleSmall}
                                          key={indexVariant}
                                        >
                                          {variant.priceDescription}
                                        </Text>
                                      )
                                      )
                                    }
                                  </View>
                                </View>
                                <Text style={styles.productPrice}>{orderLine.price}₺</Text>
                              </View>
                            )
                            )
                          }

                          <Text style={styles.productPrice}>Toplam : {order.total}</Text>
                        </View>
                      </View>
                    )
                    )
                  }
                </ScrollView>
              )
            }

            <View style={styles.box}>
              <View style={styles.boxTitle}>
                <Text style={styles.boxTitleText}>Kişisel Bilgiler</Text>
              </View>
              <View style={[styles.boxContent]}>
                <Formik
                  initialValues={initialFormValues}
                  validationSchema={validationSchema}
                  onSubmit={(values) => submitUpdate(values)}
                >
                  {

                    ({ handleChange,
                      handleBlur,
                      handleSubmit,
                      values,
                      errors,
                      touched,
                      isSubmitting }) => {
                      return (
                        <>
                          <Box marginBottom="sm">
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
                          <Box marginBottom="sm">
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
                              placeholder="Şifreyi Tekrarla"
                              value={values.RePassword}
                              onChangeText={handleChange('RePassword')}
                              onBlur={handleBlur('RePassword')}
                              placeholderTextColor={colors.neutral500}
                            />
                            <Text style={[styles.errorValidation]}>
                              {touched.RePassword && errors.RePassword}
                            </Text>
                          </Box>
                          {
                            isLoading && (
                              <ActivityIndicator
                                color="#1B854B"
                                style={{ marginBottom: 5 }}
                              />
                            )
                          }
                          <Button
                            label="GÜNCELLE"
                            onPress={handleSubmit}
                            backgroundColor="buttonBackground"
                            marginTop="sm"
                            padding="md"
                            borderRadius="sm"
                            shadowColor="black"
                            shadowOpacity={0.4}
                            shadowRadius={8.3}
                            elevation={20}
                            shadowOffset={{ width: 0, height: 6 }}
                          />
                        </>
                      )
                    }
                  }
                </Formik>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '4%',
    paddingBottom: 90,
  },
  primaryBtn: {
    marginTop: '4%',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1B854B',
    padding: 15,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 16,
  },
  primaryBtnText: {
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 18,
    color: '#fff',
  },
  sectionContainer: {
    fontSize: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
    color: '#343434',
    shadowColor: '#999',
    shadowOffset: {
      width: 0,
      height: 133,
    },
    shadowOpacity: 0.17,
    shadowRadius: 4.65,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    color: '#1B854B',
    fontFamily: 'Nunito-Bold',
  },
  boxContent: {
    padding: 15,
  },
  boxContentAddress: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boxContentTimes: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boxTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopColor: '#E6E6E6',
    borderTopWidth: 1,
    borderBottomColor: '#E6E6E6',
    borderBottomWidth: 1,
  },
  boxTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#464646',
  },
  boxTitleTextSmall: {
    fontSize: 15,
    fontWeight: 'normal',
    color: '#0b0b0b',
  },
  product: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  productLeft: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 150
  },
  productTitle: {
    fontSize: 13,
    fontFamily: 'Nunito-SemiBold',
    color: '#000',
    marginBottom: 2,
  },
  productTitleSmall: {
    fontSize: 12,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B854B'
  },
  address: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addressTop: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressIcons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressIcon: {
    marginLeft: 6,
  },
  addressIconSvg: {
    color: '#9795A4',
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  addressText: {
    fontSize: 11,
    marginTop: 6,
    lineHeight: 16,
  },
  addressActive: {
    backgroundColor: '#1B854B',
  },
  addressTitleActive: {
    color: '#fff',
  },
  addressIconSvgActive: {
    color: '#fff',
  },
  addressTextActive: {
    color: '#fff',
  },
  time: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 16,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B854B',
  },
  timeActive: {
    backgroundColor: '#1B854B',
  },
  timeTitleActive: {
    color: '#fff',
  },
  timeTextActive: {
    color: '#fff',
  },
  custom: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customInputs: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    padding: 12,
    fontFamily: 'Nunito-SemiBold',
    fontSize: 13,
    marginBottom: '4%',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.9,
    shadowRadius: 3.3,
    elevation: 3,
  },
  inputBtn: {
    backgroundColor: '#000',
    borderColor: '#000',
    color: '#fff',
  },
  inputBtnText: {
    color: '#fff',
  },
  order: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#1B854B',
    padding: 20,
  },
  orderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  orderPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  errorValidation: {
    color: '#FF1E00',
    fontSize: 12,
    marginLeft: 8,
    marginTop: 5,
    fontFamily: 'Nunito-SemiBold',
  }
})

export default ProfileScreen
