import React, { useEffect, useState } from 'react'
import Header from '@/components/header'
import { ScrollView, View } from 'react-native'
import { Image, StyleSheet } from 'react-native'
import { Pressable, ImageBackground, Text } from '@/atoms'
//import { NavigationContainer } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import { fetchData } from '@/services/methods'
import { userInfoStateAtom, userStateAtom } from '@/states/auth'
import { useAtom } from 'jotai'
import moment from 'moment'
import { backgroundColor } from '@shopify/restyle'

type HomeContainer = {
  campaign: Array<Object>
  bonus: Number
}

type CurrentOrder = {
  order?: number
  orderLines?: Array<Object>
  variants?: Array<Object>
}

function HomeScreen() {
  const navigation = useNavigation()

  const [homeContainer, setHomeContainer] = useState<HomeContainer>({
    campaign: [],
    bonus: 0,
  })

  const [userState] = useAtom(userStateAtom)
  const [userInfoState, setUserInfoState] = useAtom(userInfoStateAtom)
  const [currentOrder, setCurrentOrder] = useState<Object>({
    order: null,
    orderLines: null,
    variants: null
  })


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await fetchData('Home', {
        method: 'POST',
        authToken: userState.data,
      })
        .then(res => {
          setHomeContainer(res)
          setUserInfoState(() => {
            const {
              aciklama,
              adi,
              soyadi,
              gsm,
              email,
              password,
              cinsiyet,
              bonus,
            } = res.user
            let buffer = {
              aciklama,
              adi,
              soyadi,
              gsm,
              email,
              password,
              cinsiyet,
              bonus: homeContainer.bonus
            }
            return buffer
          })
        })
        .catch(err => {
          console.log(err)
        })
      fetchData('MyOrders', {
        method: 'POST',
        authToken: userState.data
      })
        .then((res) => {
          let buffer: CurrentOrder = {}
          buffer.order = res.orders.some((order: any) => order.siparisDurumS === "YeniSiparis") ?
            res.orders.find((order: any) => order.siparisDurumS === "YeniSiparis") : null
          console.log(buffer.order)
          if (buffer.order) {
            buffer.orderLines = res.orderLines.filter((line: any) => line.orderID === buffer.order.orderID)
            buffer.variants = res.variants.filter((variant: any) => variant.orderID === buffer.order.orderID)
          }
          setCurrentOrder(buffer)
          console.log(buffer)
        })
        .catch((err) => {
          console.log(err)
        })
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <Header />
      <ScrollView>
        <ImageBackground
          source={require('@/assets/images/text-bg.png')}
          resizeMode="cover"
          minHeight="100%"
          flex={1}
        >
          <View style={styles.wrapper}>
            {
              currentOrder.order &&
              (
                <View style={styles.currentOrder}>
                  <View style={styles.orderStatus}>
                    {
                      currentOrder.order.siparisDurum === 0 ?
                        (<Text style={{
                          textAlign: 'center',
                          fontFamily: 'Nunito-Regular',
                          color: '#1B854B'
                        }}
                        >
                          Siparişiniz Hazırlanıyor
                        </Text>) : (<Text style={{
                          textAlign: 'center',
                          fontFamily: 'Nunito-Regular',
                          color: '#1B854B'
                        }}
                        >
                          Siparişiniz Hazır
                        </Text>)

                    }
                  </View>
                  <View
                    style={styles.box}
                  >
                    <View style={styles.boxTitle}>
                      <Text style={styles.boxTitleTextSmall}>
                        {moment(currentOrder.order.deliveryDate).format("DD.MM.YYYY hh:mm")}
                      </Text>
                    </View>
                    <View style={styles.boxContent}>
                      {
                        currentOrder.orderLines &&
                        currentOrder.orderLines.map((orderLine: any, indexLine: any) =>
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
                              <View style={styles.productContent}>
                                <Text style={styles.productTitle}>
                                  {orderLine.description}
                                </Text>
                                {
                                  currentOrder.variants &&
                                  currentOrder.variants.filter((variant: any) =>
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
                          currentOrder.orderLines.reduce(
                            (accm: Number, curr: any) => accm += curr.price
                            , 0).toFixed(1)
                        }₺
                      </Text>
                    </View>
                  </View>
                </View>
              )
            }
            <Pressable style={styles.card}>
              <ImageBackground
                source={require('@/assets/images/card-bg.png')}
                style={styles.cardBg}
              >
                <ImageBackground
                  source={require('@/assets/images/qr-code-scan.png')}
                  style={styles.cardQr}
                />
                <Text style={styles.cardText}>
                  {userInfoState.adi + ' ' + userInfoState.soyadi}
                </Text>
                <Text style={styles.cardTitle}>Bonus</Text>
                <Text style={styles.cardPrice}>{homeContainer.bonus}</Text>
              </ImageBackground>
            </Pressable>
            <View style={styles.slider}>
              {homeContainer.campaign &&
                homeContainer.campaign.map((camp: any, index) => (
                  <Pressable style={styles.sliderItem} key={index}>
                    <Image
                      style={styles.sliderImg}
                      source={{
                        uri: camp.image,
                      }}
                    />
                  </Pressable>
                ))}
              {/* <Pressable style={styles.sliderItem}>
                <Image
                  style={styles.sliderImg}
                  source={require('@/assets/images/kampanya-2.png')}
                />
              </Pressable>
              <Pressable style={styles.sliderItem}>
                <Image
                  style={styles.sliderImg}
                  source={require('@/assets/images/kampanya-1.png')}
                />
              </Pressable> */}
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '4%',
    paddingBottom: 90,
    flexWrap: 'wrap',
  },
  sectionContainer: {
    fontSize: 20,
    backgroundColor: '#fff',
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    color: '#343434',
    padding: '4%',
  },
  button: {
    width: '48%',
    backgroundColor: '#1b854b',
    borderRadius: 14,
    color: '#fff',
    paddingTop: 35,
    paddingBottom: 35,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: '4%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonImg: {
    width: 46,
    height: 46,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 15,
    // fontFamily: 'Nunito-Bold',
    fontFamily: 'Nunito-Regular',
  },
  card: {
    width: '100%',
    backgroundColor: '#1b854b',
    borderRadius: 14,
    marginBottom: '4%',
    padding: 15,
  },
  cardBg: {
    resizeMode: 'cover',
    height: 160,
  },
  cardQr: {
    width: 64,
    height: 64,
  },
  cardText: {
    color: '#fff',
    position: 'absolute',
    right: 0,
    top: 0,
    fontSize: 18,
    fontFamily: 'Nunito-Regular',
  },
  cardTitle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    fontSize: 30,
    color: '#fff',
    fontFamily: 'Nunito-Regular',
  },
  cardPrice: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    fontSize: 26,
    fontWeight: '200',
    color: '#fff',
    //fontFamily: 'Dosis-Regular',
    fontFamily: 'Nunito-SemiBold',
  },
  slider: {
    width: '100%',
    dislay: 'flex',
  },
  sliderItem: {
    width: 'auto',
  },
  sliderImg: {
    borderRadius: 14,
    margin: 'auto',
    marginBottom: 14,
    height: 280,
    width: '100%'
  },
  currentOrder: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    height: 'auto',
    width: '100%',
    margin: 'auto',
    backgroundColor: '#F7F7F7',
    borderRadius: 14,
    marginBottom: 14,
    padding: 6,
    elevation: 1
  },
  orderStatus: {
    paddingBottom: 8
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
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#0b0b0b',
  },
  product: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 12
  },
  productImage: {
    width: 50,
    height: 55,
    marginRight: 10,
  },
  productLeft: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 150,
  },
  productTitle: {
    fontSize: 12,
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
  productContent: {
    flex: 1,
    justifyContent: 'flex-start',
    marginLeft: 0
  }

})

export default HomeScreen
