// API Imports
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Alert } from 'react-native'
import { useAtom } from 'jotai'
import moment from 'moment';

// Component Imports
import { Button, Text } from '@/atoms'
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import Header from '@/components/header'
import { SvgXml } from 'react-native-svg'
import { Icons } from '@/constants'
import { fetchData } from '@/services/methods'

// Service Imports
import { userInfoStateAtom, userStateAtom } from '@/states/auth'

type PastOrders = {
  orders: Array<Object>;
  orderLines: Array<Object>;
  variants: Array<Object>;
}

function ProfileScreen() {

  const navigation = useNavigation()

  const [userState,] = useAtom(userStateAtom)
  const [userInfoState,] = useAtom(userInfoStateAtom)

  const [pastOrders, setPastOrders] = useState<PastOrders>({
    orders: [],
    orderLines: [],
    variants: []
  })

  useEffect(() => {
    fetchData('MyOrders', {
      method: 'POST',
      authToken: userState.data
    })
      .then((res) => {
        const buffer = res
        setPastOrders(buffer)
        console.log(buffer)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const repeatOrder = (orderID: Number) => {
    Alert.alert(
      "Uyarı",
      "Siparişi tekrarla henüz geliştirme aşamasındadır.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => console.log("OK Pressed")
        }
      ]
    )
  }

  const handleUpdate = () => {
    console.log('Handle Update')
  }

  const handleExit = () => {
    console.log('Exit')
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
              onPress={() => handleExit()}
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
              pastOrders &&
              pastOrders.orders.filter((order: any) =>
                order.siparisDurumS === 'YeniSiparis'
              ).reverse().map((order: any, index) =>
              (
                <View
                  style={styles.box}
                  key={index}
                >
                  <View style={styles.boxTitle}>
                    <Text style={styles.boxTitleTextSmall}>
                      {moment(order.deliveryDate).format("DD.MM.YYYY hh:mm")}
                    </Text>
                    <Pressable
                      style={styles.boxTitleRemove}
                      onPress={() => repeatOrder(order.orderID)}
                    >
                      <Text style={styles.boxTitleRemoveText}>
                        Siparişi Tekrarla
                      </Text>
                    </Pressable>
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

                    <Text style={styles.productPrice}> Toplam: {' '}
                      {
                        pastOrders.orderLines.filter((orderLine: any) =>
                          orderLine.orderID === order.orderID)
                          .reduce(
                            (accm: Number, curr: any) => accm += curr.price
                            , 0)
                      }₺
                    </Text>
                  </View>
                </View>
              )
              )
            }

            {
              pastOrders &&
              pastOrders.orders.filter((order: any) =>
                order.siparisDurumS === 'TeslimEdildi'
              ).reverse().map((order: any, index) =>
              (
                <View
                  style={styles.box}
                  key={index}
                >
                  <View style={styles.boxTitle}>
                    <Text style={styles.boxTitleTextSmall}>
                      {order.deliveryDate}
                    </Text>
                    <Pressable
                      style={styles.boxTitleRemove}
                      onPress={() => repeatOrder(order.orderID)}
                    >
                      <Text style={styles.boxTitleRemoveText}>
                        Siparişi Tekrarla
                      </Text>
                    </Pressable>
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

                    <Text style={styles.productPrice}>Toplam : 19 TL</Text>
                  </View>
                </View>
              )
              )
            }
            <View style={styles.box}>
              <View style={styles.boxTitle}>
                <Text style={styles.boxTitleText}>Kişisel Bilgiler</Text>
              </View>
              <View style={[styles.boxContent]}>
                <TextInput
                  style={styles.input}
                  placeholder="Ad Soyad"
                  value={userInfoState.adi + ' ' + userInfoState.soyadi}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Telefon"
                  value={userInfoState.gsm}
                />
                <TextInput
                  style={styles.input}
                  placeholder="E-Posta"
                  value={userInfoState.email}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Şifre"
                  secureTextEntry={true}
                  value={userInfoState.password}
                />
                <TextInput style={styles.input} placeholder="Şifre Tekrar" secureTextEntry={true} />
              </View>
            </View>
          </View>
          <Button
            label="GÜNCELLE"
            onPress={handleUpdate}
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
  },
  productTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  productTitleSmall: {
    fontSize: 12,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B854B',
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
  }
})

export default ProfileScreen
