// API Imports
import React from 'react'
import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'

// Component Imports
import { Text } from '@/atoms'
import Header from '@/components/header'
import { Image, Pressable, ScrollView, StyleSheet, View, TextInput, TouchableHighlight } from 'react-native'
import { Icons } from '@/constants'
import { SvgXml } from 'react-native-svg'

// Service Imports
import { fetchData } from '@/services/methods'
import { userStateAtom, basketAtom } from '@/states/auth'
import { variableDeclaration } from '@babel/types'

type BasketModel = {
  totalPrice: Number;
  orderID?: Number | null;
  products: Array<Object>;
  variants: Array<Object>;
}

function OrderScreen() {

  const [basketInfo, setBasketInfo] = useState<BasketModel>({
    totalPrice: 0,
    orderID: null,
    products: [],
    variants: []
  })
  const [userState,] = useAtom(userStateAtom)
  const [basketState, setBasketState] = useAtom(basketAtom)
  // var [isPress, setIsPress] = useState(false);


  useEffect(() => {

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
            totalPrice: data.order.total,
            orderID: data.order.orderID,
            products: data.lines,
            variants: data.variants
          }
          setBasketInfo(basketBuffer)
          setBasketState(basketInfo.totalPrice)
          console.log(basketInfo)
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
          variants: []
        })
        setBasketState(0)
        console.log(basketInfo.orderID)
      })
      .catch((err) => console.log(err))
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
                        <View style={styles.productLeft}>
                          <Image
                            style={styles.productImage}
                            source={require('@/assets/images/product.png')}
                          />
                          <View style={styles.productContet}>
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
                        </View>
                        <Text style={styles.productPrice}>{product.price}</Text>
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
                  <View style={styles.box}>
                    <View style={styles.boxTitle}>
                      <Text style={styles.boxTitleText}>Teslim Alınacak Şube</Text>
                    </View>
                    <View style={[styles.boxContent, styles.boxContentAddress]}>
                      <View style={[styles.address, styles.addressActive]}>
                        <View style={styles.addressTop}>
                          <Text
                            style={[styles.addressTitle, styles.addressTitleActive]}
                          >
                            Ankara Şubesi
                          </Text>
                          <View style={styles.addressIcons}>
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
                          </View>
                        </View>
                        <Text style={[styles.addressText, styles.addressTextActive]}>
                          Yenişehir Mah. Cumhuriyet Bulv. Işılpark Sitesi B Bl. Daire
                          14 YENİŞEHİR /PENDİK /İstanbul
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.box}>
                    <View style={styles.boxTitle}>
                      <Text style={styles.boxTitleText}>Teslimat Saati</Text>
                    </View>
                    <View style={[styles.boxContent, styles.boxContentTimes]}>
                      <Pressable style={styles.time}>
                        <Text style={styles.timeTitle}>10 dk</Text>
                        <Text style={styles.timeText}>16:30</Text>
                      </Pressable>
                      <Pressable style={[styles.time, styles.timeActive]}>
                        <Text style={[styles.timeTitle, styles.timeTitleActive]}>
                          10 dk
                        </Text>
                        <Text style={[styles.timeText, styles.timeTextActive]}>
                          16:30
                        </Text>
                      </Pressable>
                      <Pressable style={styles.time}>
                        <Text style={styles.timeTitle}>10 dk</Text>
                        <Text style={styles.timeText}>16:30</Text>
                      </Pressable>
                    </View>
                    <View style={styles.boxContent}>
                      <View style={styles.custom}>
                        <View style={styles.customText}>
                          <Text style={styles.customTextTitle}>
                            ya da istediğin saati gir
                          </Text>
                        </View>
                        <View style={styles.customInputs}>
                          <TextInput
                            style={[styles.input, styles.inputText]}
                            value="16:55"
                          />
                          <Pressable style={[styles.input, styles.inputBtn]}>
                            <Text style={styles.inputBtnText}>Onayla</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </View>
                </>

              )
            }
          </View>
          {
            basketInfo.orderID && (
              <Pressable style={styles.order}>
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
    marginRight: 10,
  },
  productLeft: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  productTitleSmall: {
    fontSize: 12,
  },
  productPrice: {
    fontSize: 18,
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
  }
})

export default OrderScreen
