import React, { useEffect, useState } from 'react'
import Header from '@/components/header'
import { ScrollView, View } from 'react-native'
import { Image, StyleSheet } from 'react-native'
import { Pressable, ImageBackground, Text } from '@/atoms'
//import { NavigationContainer } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import { fetchData } from '@/services/methods'
import { userStateAtom } from '@/states/auth'
import { useAtom } from 'jotai'

type HomeContainer = {
  campaign: Array<Object>;
  bonus: Number;
}

function HomeScreen() {

  const navigation = useNavigation()

  const [homeContainer, setHomeContainer] = useState<HomeContainer>({
    campaign: [],
    bonus: 0
  })

  const [userState,] = useAtom(userStateAtom)

  useEffect(() => {
    console.log(homeContainer)
  }, [homeContainer])

  useEffect(() => {
    fetchData('Home', {
      method: 'POST',
      authToken: userState.data
    })
      .then((res) => {
        setHomeContainer(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

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
          <Pressable style={styles.card}>
            <ImageBackground
              source={require('@/assets/images/card-bg.png')}
              style={styles.cardBg}
            >
              <ImageBackground
                source={require('@/assets/images/qr-code-scan.png')}
                style={styles.cardQr}
              />
              <Text style={styles.cardText}>Ercan Güven</Text>
              <Text style={styles.cardTitle}>Bonus Harca</Text>
              <Text style={styles.cardPrice}>{homeContainer.bonus}</Text>
            </ImageBackground>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate('Products')}
          >
            <Image
              style={styles.buttonImg}
              source={require('@/assets/images/icon-1.png')}
            />
            <Text style={styles.buttonText}>ÖN{'\n'}SİPARİŞ</Text>
          </Pressable>
          <Pressable style={styles.button}
            onPress={() => navigation.navigate('Feedback')}
          >
            <Image
              style={styles.buttonImg}
              source={require('@/assets/images/icon-2.png')}
            />
            <Text style={styles.buttonText}>GERİ{'\n'}BİLDİRİM</Text>
          </Pressable>
          <Pressable style={styles.button}>
            <Image
              style={styles.buttonImg}
              source={require('@/assets/images/icon-3.png')}
            />
            <Text style={styles.buttonText}>ŞUBELER</Text>
          </Pressable>
          <Pressable style={styles.button}>
            <Image
              style={styles.buttonImg}
              source={require('@/assets/images/icon-4.png')}
            />
            <Text style={styles.buttonText}>BONUS{'\n'}HARCA</Text>
          </Pressable>
          <View style={styles.slider}>
            <ScrollView horizontal={true}>
              {
                homeContainer.campaign &&
                homeContainer.campaign.map((camp: any, index) => (
                  <Pressable
                    style={styles.sliderItem}
                    key={index}
                  >
                    <Image
                      style={styles.sliderImg}
                      source={{
                        uri: camp.image,
                        width: 200, height: 160,
                      }}
                    />
                  </Pressable>
                ))
              }
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
            </ScrollView>
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
    fontFamily: 'Nunito-Regular'
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
    fontFamily: 'Nunito-SemiBold'
  },
  slider: {
    //width: '100%',
    //dislay: 'flex',
  },
  sliderItem: {
    width: 'auto',
    marginRight: 15,
  },
  sliderImg: {
    borderRadius: 14,
  },
})

export default HomeScreen

