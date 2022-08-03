// API Imports
import React from 'react'
import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { StackActions } from '@react-navigation/native';


// Component Imports
import { Text } from '@/atoms'
import Header from '@/components/header'
import { Image, Pressable, ScrollView, StyleSheet, View, TouchableHighlight, Modal } from 'react-native'
import { Icons } from '@/constants'
import { SvgXml } from 'react-native-svg'
import NumericInput from 'react-native-numeric-input'
import { ActivityIndicator, Checkbox, TextInput } from 'react-native-paper';
import Toast from 'react-native-simple-toast';


// Service Imports
import { fetchData } from '@/services/methods'
import { userStateAtom, basketAtom, userInfoStateAtom } from '@/states/auth'

type BasketModel = {
  totalPrice: Number;
  orderID?: Number | null;
  products: Array<Object>;
  variants: Array<Object>;
}

type ProductsQuantity = Array<{
  lineID: Number;
  Qty: Number;
}>

type SendOrder = {
  OrderID?: Number;
  BranchID?: Number;
  DeliveryMinute?: Number;
  DeliveryNote?: String;
  Bonus?: Boolean;
}

function OrderScreen({ navigation }) {

  const [arbitraryTime, setArbitraryTime] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [basketInfo, setBasketInfo] = useState<BasketModel>({
    totalPrice: 0,
    orderID: null,
    products: [],
    variants: [],
  })
  const [branches, setBranches] = useState([])
  const [productsQuantity, setProductsQuantity] = useState<ProductsQuantity>([])
  const [sendOrderInfo, setSendOrderInfo] = useState<SendOrder>({
    OrderID: 0,
    BranchID: 0,
    DeliveryMinute: 0,
    DeliveryNote: '',
    Bonus: false
  })
  const [activeBranchId, setActiveBranchId] = useState<Number>(0)
  const [deliveryTimes, setDeliveryTimes] = useState([
    { duration: 15, time: '16:30', isActive: false },
    { duration: 30, time: '16:45', isActive: false },
    { duration: 45, time: '17:00', isActive: false },
  ])

  const [userState,] = useAtom(userStateAtom)
  const [basketState, setBasketState] = useAtom(basketAtom)
  const [userInfoState,] = useAtom(userInfoStateAtom)

  useEffect(() => {

    fetchData('Branches', {
      method: 'POST',
      authToken: userState.data
    })
      .then((data) => {
        setBranches(data)
        console.log('Şubeler alındı', branches)
      })
      .catch((err) => {
        console.log('Şubeler alınamadı')
      })

    setTimeout(() => {
      fetchData('Basket', {
        method: 'POST',
        authToken: userState.data
      })
        .then((response) => {
          return response
        })
        .then((data) => {
          let basketBuffer: BasketModel = {
            totalPrice: data.order.total.toFixed(1),
            orderID: data.order.orderID,
            products: data.lines,
            variants: data.variants
          }
          setBasketInfo(basketBuffer)
          setBasketState(Number(basketInfo.totalPrice.toFixed(1)))
          setSendOrderInfo((prev) => {
            let bufferPrev = prev
            bufferPrev.OrderID = data.order.orderID
            bufferPrev.BranchID = 0
            return bufferPrev
          })
          console.log(sendOrderInfo)
          let buffer: ProductsQuantity = []
          buffer = data.lines.map((item: any) => {
            return {
              lineID: item.lineID,
              Qty: item.qty
            }
          })
          setProductsQuantity(buffer)
        })
        .catch(err => console.log(err))
    }, 400)

  }, [basketState])

  const emptyTheBasket = () => {
    fetchData('RemoveBasket', {
      method: 'POST',
      authToken: userState.data,
      paramLabel: 'orderID',
      key: basketInfo.orderID
    })
      .then((res) => {
        setBasketInfo({
          totalPrice: 0,
          orderID: null,
          products: [],
          variants: [],
        })
        setBasketState(0)
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    setSendOrderInfo(prev => {
      const buffer = prev
      buffer.DeliveryMinute = deliveryTimes.some((time) => time.isActive) ? deliveryTimes.filter((time) => time.isActive)[0].duration : 0
      return { ...buffer }
    })

  }, [deliveryTimes])

  const removeProduct = (orderID: Number, lineID: Number) => {
    console.log('test')
  }

  const numericInputHandler = (lineID: Number, value: Number) => {
    let buffer: any = productsQuantity?.map((item) => {
      item.lineID === lineID ? { ...item, Qty: value } : item
    })
    setProductsQuantity(buffer)
    console.log(buffer)
  }

  const arbitraryTimeHandler = () => {
    setArbitraryTime(!arbitraryTime)
    setDeliveryTimes((prev) => {
      const buffer = prev.map((item) => {
        return {
          ...item,
          isActive: false
        }
      })
      return [
        ...buffer
      ]
    }
    )
  }

  const branchPressHandler = (branchID: Number) => {
    setActiveBranchId(branchID)
    setSendOrderInfo((prev: any) => {
      const buffer = prev
      buffer.BranchID = branchID
      return {
        ...buffer
      }
    })
  }

  const sendOrder = () => {
    setIsLoading(true)
    fetch('https://api.entegre.pro/ui/UIntegration/SendOrder', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userState.data}`
      },
      body: JSON.stringify(sendOrderInfo)
    })
      .then((res: any) => {
        setIsLoading(false)
        if (res.status) {
          setModalVisible(true)
          emptyTheBasket()
        } else {
          Toast.showWithGravity('Hata, sipariş alınamadı : ' + res.message, Toast.LONG, Toast.TOP)

        }

      })
      .catch((err) => {
        Toast.showWithGravity('Hata, sipariş alınamadı : ' + err, Toast.LONG, Toast.TOP)
        console.log(err)
      })
  }

  const touchProps = {
    activeOpacity: 1,
    underlayColor: '#f0f5f7',
    style: styles.boxTitleRemove,
    // onHideUnderlay: () => setIsPress(false),
    // onShowUnderlay: () => setIsPress(true),
    onPress: () => emptyTheBasket(),
  }

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        style={styles.modal}
        visible={modalVisible}
      >
        <View style={styles.modalContent}>
          <Image
            style={styles.modalIcon}
            source={require('@/assets/images/siparis-onay.png')}
          />
          <Text style={styles.modalText}>Siparişiniz'i aldık, Belirttiğin süre sonunda dükkanımızda hazır olacak!</Text>
          <Pressable
            style={styles.modalClose}
            onPress={() => {
              setModalVisible(false)
              navigation.navigate('Home')
            }}
          >
            <Text style={styles.modalCloseText}>Tamam</Text>
          </Pressable>

        </View>
      </Modal>
      <Header />
      <ScrollView>
        <View style={styles.wrapper}>
          <Text style={styles.title}>Sepetim</Text>
          <View style={styles.sectionContainer}>
            <View style={styles.box}>
              <View style={styles.boxTitle}>
                <Text style={styles.boxTitleText}>Ürünler</Text>
                {
                  basketInfo.orderID &&
                  (<TouchableHighlight {...touchProps}>
                    <Text style={styles.boxTitleRemoveText}>Sepet'i Boşalt</Text>
                  </TouchableHighlight>)
                }
              </View>
              <View style={styles.boxContent}>
                {
                  !basketInfo.orderID && (
                    <Text
                      style={{ textAlign: 'center', fontFamily: 'Nunito-Bold' }}
                    >
                      Sepetiniz boş
                    </Text>
                  )
                }
                {
                  basketInfo.orderID &&
                  basketInfo.products.map((product: any) => {
                    return (
                      <View
                        style={styles.product}
                        key={product.lineID}
                      >
                        <View style={{ flex: 3, flexDirection: 'row' }}>
                          <View style={styles.productLeft}>
                            <Image
                              style={styles.productImage}
                              source={require('@/assets/images/product.png')}
                            />
                            <View style={styles.productContent}>
                              <Text style={styles.productTitle}>
                                {product.description}
                              </Text>
                              {
                                basketInfo.variants.filter((variant: any) => variant.lineID === product.lineID).map((variant: any, index) => {
                                  return (
                                    <Text
                                      style={styles.productTitleSmall}
                                      key={index}
                                    >
                                      {variant.priceDescription}
                                    </Text>
                                  )
                                })
                              }
                            </View>
                            <Text style={styles.productPrice}>{(product.price * product.qty).toFixed(1)}₺</Text>
                          </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                          <NumericInput
                            onChange={value => {
                              const buffer: any = productsQuantity.map((item) => {
                                item.lineID === product.lineID ? { ...item, Qty: value } : item
                              })
                              setProductsQuantity(buffer)
                            }}
                            value={product.qty}
                            minValue={0}
                            rounded
                            iconSize={5}
                            totalWidth={80}
                            totalHeight={38}
                            type='up-down'
                          />
                        </View>
                      </View>
                    )
                  })
                }
              </View>
            </View>
            {
              basketInfo.orderID &&
              (
                <>
                  <View style={styles.boxTitle}>
                    <Text style={{ fontFamily: 'Nunito-SemiBold' }}>
                      {userInfoState.bonus} Bonus Kullanılsın mı ?
                    </Text>
                    <Checkbox
                      status={sendOrderInfo.Bonus ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setSendOrderInfo((prev) => {
                          const buffer = prev
                          buffer.Bonus = !prev.Bonus
                          return { ...buffer }
                        });
                      }}
                      color="#1B854B"
                    />
                  </View>
                  <View style={styles.box}>
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
                              onPress={() =>
                                branchPressHandler(branch.branchID)
                              }
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
                  <View style={styles.box}>
                    <View style={styles.boxTitle}>
                      <Text style={styles.boxTitleText}>Teslimat Saati</Text>
                    </View>
                    <View style={[styles.boxContent, styles.boxContentTimes]}>
                      {deliveryTimes &&
                        deliveryTimes.map((deliveryTime, index) => (
                          <Pressable
                            key={index}
                            onPress={() => {
                              setDeliveryTimes((prev) => {
                                const buffer = prev.map((item, i) => {
                                  return {
                                    ...item,
                                    isActive: index === i ? true : false
                                  }
                                })
                                return [
                                  ...buffer
                                ]
                              }
                              )
                            }}
                            style={deliveryTime.isActive ?
                              [styles.time, styles.timeActive] : [styles.time]
                            }
                          >
                            <Text
                              style={deliveryTime.isActive ?
                                [styles.timeTitle, styles.timeTitleActive] : [styles.timeTitle]
                              }
                            >
                              {deliveryTime.duration + 'dk'}
                            </Text>
                            <Text style={deliveryTime.isActive ? { color: 'white' } : { color: 'gray' }}>{deliveryTime.time}</Text>
                          </Pressable>
                        )
                        )
                      }
                    </View>
                    <View style={styles.boxContent}>
                      <View style={styles.custom}>
                        <Pressable
                          onPress={() => arbitraryTimeHandler()}
                          style={styles.customText}
                        >
                          <Text style={styles.customTextTitle}>
                            Dakika belirle
                          </Text>
                          <SvgXml
                            xml={Icons.iconArrowDown}
                            height="18"
                            width="18"
                            fill="gray"
                            style={{ marginTop: 5 }}
                          />
                        </Pressable>
                        {
                          arbitraryTime &&
                          (<View style={styles.customInputs}>
                            <TextInput
                              placeholder="Dakika giriniz"
                              activeOutlineColor='#1b854b'
                              dense
                              keyboardType="phone-pad"
                              mode='outlined'
                              value={() => String(sendOrderInfo.DeliveryMinute)}
                              onChangeText={text => setSendOrderInfo((prev) => {
                                const buffer = prev
                                buffer.DeliveryMinute = Number(text)
                                return { ...buffer }
                              })
                              }
                              style={{ marginBottom: 5, marginRight: 5, backgroundColor: '#fff' }}
                            />
                            <Text style={{ color: 'gray', fontSize: 13, fontFamily: 'Nunito-Regular', marginTop: 1 }}>{sendOrderInfo.DeliveryMinute + ' dakika sonra dükkandan al'}</Text>
                            {/* <Pressable style={[styles.input, styles.inputBtn]}>
                              <Text style={styles.inputBtnText}>Onayla</Text>
                            </Pressable> */}
                          </View>)
                        }
                      </View>
                    </View>
                    <View style={styles.boxTitle}>
                      <Text style={styles.boxTitleText}>Sipariş Notu</Text>
                    </View>
                    <View style={{ padding: 15 }}>
                      <TextInput
                        placeholder='Notunuz...'
                        mode='outlined'
                        value={() => {
                          return sendOrderInfo.DeliveryNote
                        }}
                        onChangeText={(note) => setSendOrderInfo((prev) => {
                          const buffer = prev
                          buffer.DeliveryNote = note
                          return { ...buffer }
                        })}
                        activeOutlineColor='#1b854b'
                        style={{ backgroundColor: '#fff' }}
                      />
                    </View>
                  </View>
                </>

              )
            }
          </View>
          {
            isLoading &&
            (
              <ActivityIndicator animating={true} color='#1B854B' style={{ marginBottom: 15 }} />
            )
          }
          {
            basketInfo.orderID && (
              <Pressable
                style={styles.order}
                onPress={() =>
                  sendOrder()
                }
              >
                <Text style={styles.orderText}>SİPARİŞ VER</Text>
                <Text style={styles.orderPrice}>{basketInfo.totalPrice}₺</Text>
              </Pressable>
            )
          }
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
    height: 50,
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
    alignSelf: 'center'
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
    borderColor: '#'
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
    borderColor: '#1B854B'
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
    height: 27
  },
  customInputs: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    marginTop: 12,
    marginBottom: 25
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
    padding: 10
  },
  boxTitleRemoveText: {
    fontFamily: 'Nunito-Bold',
    textAlign: 'center'
  },
  modal: {},
  modalText: {
    fontSize: 15,
    fontFamily: 'Nunito-Regular',
    marginTop: 16
  },
  modalIcon: {},
  modalContent: {
    backgroundColor: '#fff',
    paddingTop: 120,
    paddingBottom: 120,
    paddingLeft: 30,
    paddingRight: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '30%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 16,
    borderColor: 'gray',
    borderWidth: 2
  },
  modalClose: {
    marginTop: 20,
    padding: 10,
    fontFamily: 'Nunito-SemiBold',
    backgroundColor: '#1B854B',
    borderRadius: 10
  },
  modalCloseText: {
    color: '#fff',
    fontFamily: 'Nunito-SemiBold'
  },
  customTextTitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: 'gray'
  },
  productContent: {
    flex: 1,
    justifyContent: 'flex-start',
    marginLeft: 0
  }
})

export default OrderScreen
