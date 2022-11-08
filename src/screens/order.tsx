// API Imports
import React, { useCallback } from 'react'
import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { StackActions, useNavigation } from '@react-navigation/native'

// Component Imports
import { Text } from '@/atoms'
import Header from '@/components/header'
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  TouchableHighlight,
  Modal,
  Alert,
  RefreshControl,
} from 'react-native'
import { Icons } from '@/constants'
import { SvgXml } from 'react-native-svg'
import NumericInput from 'react-native-numeric-input'
import { ActivityIndicator, Checkbox, TextInput } from 'react-native-paper'
import Toast from 'react-native-simple-toast'

// Service Imports
import { fetchData } from '@/services/methods'
import { userStateAtom, basketAtom, userInfoStateAtom } from '@/states/auth'
import { SafeAreaView } from 'react-native-safe-area-context'

type BasketModel = {
  totalPrice: number
  orderID?: number | undefined
  products: Array<Object>
  variants: Array<Object>
  bonusEarned?: number
}

type SendOrder = {
  OrderID?: Number
  BranchID?: Number
  DeliveryMinute?: number
  DeliveryNote?: String
  Bonus?: Boolean
}

function OrderScreen() {
  const navigation = useNavigation()

  const [refreshing, setRefreshing] = useState(false);

  const wait = (timeout: any) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(500).then(() => setRefreshing(false));
    setBasketState((prev) => prev + 1)
  }, []);

  const [isLoading, setIsLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [basketInfo, setBasketInfo] = useState<BasketModel>({
    totalPrice: 0,
    orderID: undefined,
    products: [],
    variants: [],
    bonusEarned: 0
  })
  const [isBonusUsed, setIsBonusUsed] = useState(false)
  const [branches, setBranches] = useState([])
  const [sendMessage, setSendMessage] = useState<string>("")
  const [sendOrderInfo, setSendOrderInfo] = useState<SendOrder>({
    OrderID: 0,
    BranchID: 0,
    DeliveryMinute: 0,
    DeliveryNote: '',
    Bonus: false,
  })
  const [activeBranchId, setActiveBranchId] = useState<Number>(0)
  const [deliveryTimes, setDeliveryTimes] = useState([
    { duration: 15, isActive: false },
    { duration: 30, isActive: false },
    { duration: 45, isActive: false },
  ])
  const [pageLoad, setPageLoad] = useState(false)

  const [userState] = useAtom(userStateAtom)
  const [basketState, setBasketState] = useAtom(basketAtom)
  const [userInfoState] = useAtom(userInfoStateAtom)

  useEffect(() => {
    setPageLoad(() => true)

    fetchData('Branches', {
      method: 'POST',
      authToken: userState.data,
    })
      .then(data => {
        setBranches(data)
      })
      .catch(err => {
        console.log('Şubeler alınamadı')
      })

    fetchData(`Basket?Bonus=${isBonusUsed}`, {
      method: 'POST',
      authToken: userState.data,
    })
      .then(data => {
        if (data) {
          console.log("BASKET RESPONSE -->", data)
          let basketBuffer: BasketModel = {
            totalPrice: Number(data.order.total.toFixed(2)),
            orderID: data.order.orderID,
            products: data.lines,
            variants: data.variants,
            bonusEarned: data.order.bonusEarned
          }
          console.log("BASKET BUFF ->>", basketBuffer)
          setBasketInfo(basketBuffer)
          setBasketState(Number(basketInfo.totalPrice.toFixed(2)))
          setSendOrderInfo(prev => {
            let bufferPrev = prev
            bufferPrev.OrderID = data.order.orderID
            bufferPrev.BranchID = 0
            return bufferPrev
          })
          setPageLoad(() => false)
        } else {
          setPageLoad(() => false)
        }
      })
      .catch(err => {
        console.log(err, "Bu mu ?")
        setPageLoad(() => false)
      })
  }, [basketState])

  const emptyTheBasket = () => {
    fetchData('RemoveBasket', {
      method: 'POST',
      authToken: userState.data,
      paramLabel: 'orderID',
      key: basketInfo.orderID,
    })
      .then(res => {
        setBasketInfo({
          totalPrice: 0,
          orderID: undefined,
          products: [],
          variants: [],
          bonusEarned: 0
        })
        setBasketState(0)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    setSendOrderInfo(prev => {
      const buffer = prev
      buffer.DeliveryMinute = deliveryTimes.some(time => time.isActive)
        ? deliveryTimes.filter(time => time.isActive)[0].duration
        : 0
      return { ...buffer }
    })
  }, [deliveryTimes])

  const removeProduct = (orderID: Number, lineID: Number) => {
    Alert.alert(
      'Ürün Silinecek',
      'Ürünü silmek istediğinizden emin misiniz ?',
      [
        {
          text: 'Ürünü Sil',
          onPress: () => {
            if (basketInfo.products.length !== 1) {
              fetchData(`RemoveBasketLine?Bonus=${isBonusUsed}`, {
                method: 'POST',
                authToken: userState.data,
                body: { OrderID: orderID, LineID: lineID },
              })
                .then(res => {
                  setBasketState(prev => {
                    return prev + 1
                  })
                  Toast.showWithGravity('Ürün silindi.', Toast.LONG, Toast.TOP)
                })
                .catch(err => {
                  Toast.showWithGravity(
                    'Ürün silinemedi.',
                    Toast.LONG,
                    Toast.TOP
                  )
                  console.log(err)
                })
            } else {
              emptyTheBasket()
            }
          },
          style: 'cancel',
        },
        {
          text: 'Vazgeç',
        },
      ]
    )
  }

  const numericInputHandler = (lineID: Number, value: Number) => {
    fetchData(`UpdateBasketLine?Bonus=${isBonusUsed}`, {
      method: 'POST',
      authToken: userState.data,
      body: {
        OrderID: basketInfo.orderID,
        LineID: lineID,
        Qty: value,
      },
    })
      .then(data => {
        setBasketState(prev => prev + 1)
      })
      .catch(err => console.log(err))
  }

  const branchPressHandler = (branchID: Number) => {
    setActiveBranchId(branchID)
    setSendOrderInfo((prev: any) => {
      const buffer = prev
      buffer.BranchID = branchID
      return {
        ...buffer,
      }
    })
  }

  const sendOrder = () => {
    if (sendOrderInfo.BranchID === 0) {
      Toast.showWithGravity('Lütfen şube seçiniz.', Toast.LONG, Toast.TOP)
      return
    }

    if (sendOrderInfo.DeliveryMinute === 0) {
      Toast.showWithGravity(
        'Lütfen teslim sürenizi seçiniz.',
        Toast.LONG,
        Toast.TOP
      )
      return
    }

    if (sendOrderInfo.DeliveryMinute < 15) {
      Toast.showWithGravity(
        'Teslim süresi minimum 15 dakika olmalıdır.',
        Toast.LONG,
        Toast.TOP
      )
      return
    }

    setIsLoading(true)

    fetch('https://api.coffeco.com.tr/ui/UIntegration/SendOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userState.data}`,
      },
      body: JSON.stringify(sendOrderInfo),
    })
      .then(resp => { return resp.json() })
      .then((res: any) => {
        setIsLoading(false)
        if (res.status) {
          setSendMessage(res.message)
          setModalVisible(true)
        } else {
          Toast.showWithGravity(
            'Hata, sipariş alınamadı : ' + res.message,
            Toast.LONG,
            Toast.TOP
          )
        }
      })
      .catch(err => {
        Toast.showWithGravity(
          'Hata, sipariş alınamadı : ' + err,
          Toast.LONG,
          Toast.TOP
        )
        console.log(err)
      })
  }

  // const calculateDeliveryTime = (duration: number) => {
  //   let today = new Date()
  //   let hoursNmbr = today.getHours()
  //   let minsNmbr = today.getMinutes()
  //   let hours = ''
  //   let minutes = ''
  //   if (minsNmbr + duration < 60) {
  //     minutes =
  //       minsNmbr + duration < 10
  //         ? `0${minsNmbr + duration}`
  //         : `${minsNmbr + duration}`
  //     hours = hoursNmbr < 10 ? `0${hoursNmbr}` : `${hoursNmbr}`
  //   } else {
  //     minutes =
  //       minsNmbr + duration - 60 < 10
  //         ? `0${minsNmbr + duration - 60}`
  //         : `${minsNmbr + duration - 60}`
  //     hours = hoursNmbr + 1 < 10 ? `0${hoursNmbr}` : `${hoursNmbr + 1}`
  //   }
  //   return hours + ':' + minutes
  // }

  const touchProps = {
    activeOpacity: 1,
    underlayColor: '#f0f5f7',
    style: styles.boxTitleRemove,
    // onHideUnderlay: () => setIsPress(false),
    // onShowUnderlay: () => setIsPress(true),
    onPress: () =>
      Alert.alert(
        "Sepet'i Boşalt",
        "Sepet'i boşaltmak istediğinizden emin misiniz ?",
        [
          {
            text: "Sepet'i Boşalt",
            onPress: () => {
              emptyTheBasket()
            },
            style: 'cancel',
          },
          {
            text: 'Vazgeç',
            onPress: () => console.log('Vazgeçildi.'),
          },
        ]
      ),
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: '#fff'
    }}>
      <Modal
        animationType="slide"
        transparent={true}
        style={styles.modal}
        visible={modalVisible}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalIcon}>
            <Image
              source={require('@/assets/images/siparis-onay.png')}
            />
          </View>
          <Text style={styles.modalText}>
            {sendMessage}
          </Text>
          <Pressable
            style={styles.modalClose}
            onPress={() => {
              setModalVisible(false)
              navigation.dispatch(StackActions.replace('Main'))
            }}
          >
            <Text style={styles.modalCloseText}>Tamam</Text>
          </Pressable>
        </View>
      </Modal>
      <Header />
      {
        pageLoad ? (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <ActivityIndicator
              animating={true}
              color="#1B854B"
              style={{ height: 50, width: 50, marginBottom: 15 }}
            />
          </View>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          >
            <View style={styles.wrapper}>
              <Text style={styles.title}>Sepetim</Text>
              <View style={styles.sectionContainer}>
                <View>
                  {basketInfo.orderID && (
                    <View style={styles.boxTitle}>
                      <Text style={styles.boxTitleText}>Ürünler</Text>
                      {basketInfo.orderID && (
                        <TouchableHighlight {...touchProps}>
                          <Text style={styles.boxTitleRemoveText}>
                            Sepet'i Boşalt
                          </Text>
                        </TouchableHighlight>
                      )}
                    </View>
                  )}
                  <View style={styles.boxContent}>
                    {!basketInfo.orderID && (
                      <View>
                        <Text
                          style={{
                            textAlign: 'center',
                            fontFamily: 'Nunito-SemiBold',
                            fontSize: 22
                          }}
                        >
                          Sepetiniz boş...
                        </Text>
                        <View style={{ alignSelf: 'center', padding: 40 }}>
                          <SvgXml
                            xml={Icons.iconBasket}
                            width="150"
                            height="150"
                            fill={'gray'}
                          />
                        </View>
                        <Pressable
                          onPress={() => navigation.navigate('Products')}
                          style={{ padding: 5 }}
                        >
                          <Text
                            style={{
                              fontFamily: 'Nunito-Regular',
                              color: '#1B854B',
                              textAlign: 'center',
                            }}
                          >
                            Ürünlere göz at!
                          </Text>
                        </Pressable>
                      </View>
                    )}
                    {basketInfo.orderID &&
                      basketInfo.products.map((product: any) => {
                        return (
                          <View style={styles.product} key={product.lineID}>
                            <View style={{ flex: 3, flexDirection: 'row' }}>
                              <View style={styles.productLeft}>
                                <Image
                                  style={styles.productImage}
                                  source={
                                    product.image !== 'https://panel.coffeco.com.tr/'
                                      ? { uri: product.image }
                                      : require('@/assets/images/product.png')
                                  }
                                />
                                <View style={styles.productContent}>
                                  <Text style={styles.productTitle}>
                                    {product.description}
                                  </Text>
                                  {
                                    basketInfo.variants
                                      .filter(
                                        (variant: any) =>
                                          variant.lineID === product.lineID
                                      )
                                      .map((variant: any, index) => {
                                        return (
                                          <Text key={index} style={styles.productTitleSmall}>
                                            {variant.priceDescription}
                                          </Text>
                                        )
                                      })
                                  }
                                </View>
                                <Text style={styles.productPrice}>{(product.price * product.qty).toFixed(2)}₺</Text>
                              </View>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                              <NumericInput
                                onChange={value =>
                                  numericInputHandler(product.lineID, value)
                                }
                                value={product.qty}
                                minValue={1}
                                rounded
                                iconStyle={{ color: "#444444" }}
                                textColor="#666666"
                                iconSize={8}
                                totalWidth={78}
                                totalHeight={37}
                                type="up-down"
                              />
                            </View>
                            <Pressable
                              onPress={() =>
                                removeProduct(basketInfo.orderID, product.lineID)
                              }
                              style={{ marginLeft: 10 }}
                            >
                              <SvgXml
                                xml={Icons.iconDelete}
                                width="24"
                                height="24"
                                fill="gray"
                              />
                            </Pressable>
                          </View>
                        )
                      })}
                  </View>
                </View>
                {basketInfo.orderID && (
                  <>
                    <View style={[styles.boxTitle, { justifyContent: 'flex-start' }]}>
                      <Text style={{
                        color: '#1B854B',
                        fontSize: 15
                      }}
                      >
                        + {basketInfo.bonusEarned?.toFixed(2)}
                      </Text>
                      <Text style={{
                        color: '#555555',
                        fontSize: 12,
                        marginLeft: 15
                      }}
                      >
                        CoffeCo Puan Kazanacaksınız
                      </Text>
                    </View>
                    {(
                      <View style={[styles.boxTitle]}>
                        <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 18, color: '#1B854B' }}>
                          {userInfoState.bonus}
                        </Text>
                        <Text style={{ fontFamily: 'Nunito-Regular', fontSize: 13, }}>
                          CoffeeCo Puanınız var. Kullan ?
                        </Text>
                        <View>
                          <Checkbox
                            status={isBonusUsed ? 'checked' : 'unchecked'}
                            onPress={() => {
                              setIsBonusUsed((prev) => !prev)
                              setSendOrderInfo(prev => {
                                const buffer = prev
                                buffer.Bonus = isBonusUsed
                                return { ...buffer }
                              })
                              console.log("SEND ORDER INFO -->>", sendOrderInfo)
                              setBasketState(prev => prev + 1)
                            }}
                            color="#1B854B"
                          />
                        </View>
                      </View>
                    )}
                    <View>
                      <View style={styles.boxTitle}>
                        <Text style={styles.boxTitleText}>
                          Teslim Alınacak Şube
                        </Text>
                      </View>
                      <View style={[styles.boxContent, styles.boxContentAddress]}>
                        {branches &&
                          branches.map((branch: any, index) => (
                            <View
                              key={index}
                              style={
                                activeBranchId === branch.branchID
                                  ? [styles.address, styles.addressActive]
                                  : [styles.address]
                              }
                            >
                              <Pressable
                                onPress={() => branchPressHandler(branch.branchID)}
                              >
                                <View style={styles.addressTop}>
                                  <Text
                                    style={[
                                      styles.addressTitle,
                                      styles.addressTitleActive,
                                    ]}
                                  >
                                    {branch.city}
                                  </Text>
                                  <View style={styles.addressIcons}>
                                    {activeBranchId === branch.branchID && (
                                      <Pressable style={styles.addressIcon}>
                                        <SvgXml
                                          xml={Icons.iconCheck}
                                          width="18"
                                          height="18"
                                          style={[
                                            styles.addressIconSvg,
                                            styles.addressIconSvgActive,
                                          ]}
                                        />
                                      </Pressable>
                                    )}
                                  </View>
                                </View>
                                <Text
                                  style={[
                                    styles.addressText,
                                    styles.addressTextActive,
                                  ]}
                                >
                                  {branch.name}
                                </Text>
                              </Pressable>
                            </View>
                          ))}
                      </View>
                    </View>
                    <View>
                      <View style={styles.boxTitle}>
                        <Text style={styles.boxTitleText}>Teslimat Zamanı</Text>
                      </View>
                      <View style={[styles.boxContent, styles.boxContentTimes]}>
                        {deliveryTimes &&
                          deliveryTimes.map((deliveryTime, index) => (
                            <Pressable
                              key={index}
                              onPress={() => {
                                setDeliveryTimes(prev => {
                                  const buffer = prev.map((item, i) => {
                                    return {
                                      ...item,
                                      isActive: index === i ? true : false,
                                    }
                                  })
                                  return [...buffer]
                                })
                              }}
                              style={
                                deliveryTime.isActive
                                  ? [styles.time, styles.timeActive]
                                  : [styles.time]
                              }
                            >
                              <Text
                                style={
                                  deliveryTime.isActive
                                    ? [styles.timeTitle, styles.timeTitleActive]
                                    : [styles.timeTitle]
                                }
                              >
                                {deliveryTime.duration + 'dk'}
                              </Text>
                            </Pressable>
                          ))}
                      </View>
                      <View style={styles.boxTitle}>
                        <Text style={styles.boxTitleText}>Sipariş Notu</Text>
                      </View>
                      <View
                        style={{
                          padding: 15,
                        }}
                      >
                        <TextInput
                          placeholder="Notunuz..."
                          mode="outlined"
                          value={sendOrderInfo.DeliveryNote}
                          onChangeText={note =>
                            setSendOrderInfo(prev => {
                              const buffer = prev
                              buffer.DeliveryNote = note
                              return { ...buffer }
                            })
                          }
                          activeOutlineColor="#1b854b"
                          style={{ backgroundColor: '#fff' }}
                        />
                      </View>
                    </View>
                  </>
                )}
              </View>
              {isLoading && (
                <ActivityIndicator
                  animating={true}
                  color="#1B854B"
                  style={{ paddingTop: 10, paddingBottom: 10 }}
                />
              )}
              {basketInfo.orderID && (
                <Pressable style={styles.order} onPress={() => sendOrder()}>
                  <Text style={styles.orderText}>SİPARİŞ VER</Text>
                  <Text style={styles.orderPrice}>{basketInfo.totalPrice} ₺</Text>
                </Pressable>
              )}
            </View>
          </ScrollView>
        )
      }
    </SafeAreaView >
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
    lineHeight: 38,
    marginBottom: 15,
  },
  boxContent: {
    padding: 12,
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
    padding: 12,
    borderBottomColor: '#E6E6E6',
    borderBottomWidth: 1,
  },
  boxTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#464646',
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
    height: 70,
    marginRight: 6,
  },
  productLeft: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productTitle: {
    fontSize: 11,
    fontFamily: 'Nunito-Bold',
    color: '#000',
  },
  productTitleSmall: {
    fontFamily: 'Nunito-Regular',
    fontSize: 10,
  },
  productPrice: {
    fontSize: 13,
    fontFamily: 'Nunito-SemiBold',
    color: '#1B854B',
    marginRight: 10,
    marginBottom: 2,
    alignSelf: 'center',
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
  adressTopActive: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    borderColor: '#',
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
    borderWidth: 2,
    borderColor: '#1B854B',
  },
  addressTitleActive: {
    color: '#6d6d6d',
  },
  addressIconSvgActive: {
    color: '#1B854B',
  },
  addressTextActive: {
    color: '#6d6d6d',
  },
  time: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 16,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingTop: 8,
    paddingBottom: 8,
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
    paddingTop: 5,
    paddingBottom: 3,
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
  customText: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 27,
  },
  customInputs: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    marginTop: 12,
    marginBottom: 25,
  },
  input: {
    margin: 5,
    height: 42,
    paddingLeft: 24,
    paddingRight: 24,
    borderRadius: 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1B854B',
    color: '#454545',
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
  boxTitleRemove: {
    borderRadius: 14,
    padding: 10,
  },
  boxTitleRemoveText: {
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
  },
  modal: {
  },
  modalText: {
    fontSize: 15,
    fontFamily: 'Nunito-Regular',
    marginTop: 16,
    textAlign: 'center'
  },
  modalIcon: {
    paddingBottom: 10
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingTop: 70,
    paddingBottom: 70,
    paddingLeft: 30,
    paddingRight: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '30%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 16,
    borderColor: '#DDDDDD',
    borderWidth: 2,
  },
  modalClose: {
    marginTop: 20,
    padding: 10,
    fontFamily: 'Nunito-SemiBold',
    backgroundColor: '#1B854B',
    borderRadius: 10,
  },
  modalCloseText: {
    color: '#fff',
    fontFamily: 'Nunito-SemiBold',
  },
  customTextTitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: 'gray',
  },
  productContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginLeft: 0,
  },
})

export default OrderScreen
