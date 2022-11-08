import React, { useCallback, useEffect, useState } from 'react'
import Header from '@/components/header'
import { RefreshControl, ScrollView, View } from 'react-native'
import { Image, StyleSheet } from 'react-native'
import { Pressable, ImageBackground, Text } from '@/atoms'
//import { NavigationContainer } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import { fetchData } from '@/services/methods'
import { userInfoStateAtom, userStateAtom } from '@/states/auth'
import { useAtom } from 'jotai'
import { SvgXml } from 'react-native-svg'
import { Icons } from '@/constants'
import { SafeAreaView } from 'react-native-safe-area-context'

type HomeContainer = {
  campaign: Array<Object>
  bonus: Number
}

function HomeScreen() {
  const navigation = useNavigation()

  const [refreshing, setRefreshing] = useState(false);

  const wait = (timeout: any) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(500).then(() => setRefreshing(false));
    fetchData('Home', {
      method: 'POST',
      authToken: userState.data,
    })
      .then(res => {
        console.log("RESS", res)
        setHomeContainer(res)
        setCurrentOrder(res.order)
        setUserInfoState(() => {
          const {
            aciklama,
            adi,
            soyadi,
            gsm,
            email,
            password,
            cinsiyet
          } = res.user
          console.log("RES ", res.bonus)
          const cariID = res.cariID

          const buffer = {
            aciklama,
            adi,
            soyadi,
            gsm,
            email,
            password,
            cinsiyet,
            bonus: res.bonus,
            cariID,
          }
          console.log("BUFFER ", buffer)
          return buffer
        })
      })
      .catch(err => {
        console.log(err)
      })
  }, []);

  const [homeContainer, setHomeContainer] = useState<HomeContainer>({
    campaign: [],
    bonus: 0,
  })

  const [userState] = useAtom(userStateAtom)
  const [userInfoState, setUserInfoState] = useAtom(userInfoStateAtom)
  const [currentOrder, setCurrentOrder] = useState(null)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await fetchData('Home', {
        method: 'POST',
        authToken: userState.data,
      })
        .then(res => {
          console.log("RESS", res)
          setHomeContainer(res)
          setCurrentOrder(res.order)
          setUserInfoState(() => {
            const {
              aciklama,
              adi,
              soyadi,
              gsm,
              email,
              password,
              cinsiyet
            } = res.user
            console.log("RES ", res.bonus)
            const cariID = res.cariID

            const buffer = {
              aciklama,
              adi,
              soyadi,
              gsm,
              email,
              password,
              cinsiyet,
              bonus: res.bonus,
              cariID,
            }
            console.log("BUFFER ", buffer)
            return buffer
          })
        })
        .catch(err => {
          console.log(err)
        })
    })

    return unsubscribe
  }, [, navigation])

  return (
    <>
      <SafeAreaView style={{ backgroundColor: '#fff', paddingBottom: 90 }}>
        <Header />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <ImageBackground
            source={require('@/assets/images/text-bg.png')}
            resizeMode="cover"
            minHeight="100%"
            flex={1}
          >
            <View style={styles.wrapper}>
              {!currentOrder && (
                <Pressable
                  style={{
                    backgroundColor: 'orange',
                    borderRadius: 14,
                    width: '100%',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}
                  onPress={() => navigation.navigate('Products')}
                >
                  <View style={{ flex: 1, flexDirection: 'row', padding: 10 }}>
                    <SvgXml
                      xml={Icons.iconCoffee}
                      width="21"
                      height="21"
                      fill="#fff"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={{ color: '#fff', fontFamily: 'Nunito-Bold' }}>
                      Hemen Siparişini Oluştur
                    </Text>
                  </View>
                </Pressable>
              )}
              {currentOrder && (
                <View style={styles.currentOrder}>
                  <View style={styles.orderStatus}>
                    {currentOrder.siparisDurum === 20 ? (
                      <Text
                        style={{
                          textAlign: 'center',
                          fontFamily: 'Nunito-Bold',
                          color: '#1B854B',
                          fontSize: 15,
                        }}
                      >
                        Siparişiniz Hazır, {currentOrder.branch}nden Teslim
                        Alabilirsiniz
                      </Text>
                    ) : (
                      <Text
                        style={{
                          textAlign: 'center',
                          fontFamily: 'Nunito-Bold',
                          color: '#1B854B',
                          fontSize: 15,
                        }}
                      >
                        Siparişiniz Hazırlanıyor...
                      </Text>
                    )}
                  </View>
                </View>
              )}
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
                  <Text style={styles.cardTitle}>{homeContainer.bonus ? "CoffeCo Puan :" : " "} </Text>
                  <Text style={styles.cardPrice}>{homeContainer.bonus ? homeContainer.bonus : " "}</Text>
                </ImageBackground>
              </Pressable>
              <View style={styles.slider}>
                {homeContainer.campaign &&
                  homeContainer.campaign.map((camp: any, index) => (
                    <View key={index}>
                      <Pressable style={styles.sliderItem}>
                        <Image
                          style={styles.sliderImg}
                          source={{
                            uri: camp.image,
                          }}
                        />
                      </Pressable>
                      <View style={styles.sliderTitle}>
                        <Text style={styles.sliderTitleText}>
                          {camp.shortDescription}
                        </Text>
                      </View>
                    </View>
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
      </SafeAreaView>
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
    margin: 'auto',
    marginBottom: 14,
    height: 280,
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  sliderTitle: {
    marginTop: -35,
  },
  sliderTitleText: {
    borderRadius: 28,
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
    fontSize: 14,
    color: '#444444',
    backgroundColor: '#fff',
    marginBottom: 20,
    shadowColor: '#000',
    paddingTop: 14,
    paddingBottom: 0,
    paddingLeft: 10,
    paddingRight: 10,
    lineHeight: 20,
    justifyContent: 'center', //Centered horizontally
    alignItems: 'center', //Centered vertically
    flex: 1,
    alignSelf: 'center',
    textAlignVertical: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
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
    padding: 10,
    elevation: 1,
  },
  orderStatus: {},

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
    textAlign: 'center',
  },
  product: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 12,
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
    color: '#1B854B',
  },
  productContent: {
    flex: 1,
    justifyContent: 'flex-start',
    marginLeft: 0,
  },
})

export default HomeScreen
