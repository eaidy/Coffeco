// API Imports
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAtom } from 'jotai'

// Component Imports
import {
  StyleSheet,
  View,
  Image,
} from 'react-native'
import { Text, Pressable, ImageBackground } from '@/atoms'

// State Imports
import { userInfoStateAtom, userStateAtom } from '@/states/auth'

export default function Header() {

  const [userState,] = useAtom(userStateAtom)
  const [userInfoState,] = useAtom(userInfoStateAtom)

  const navigation = useNavigation()

  return (
    <View style={styles.header}>
      <ImageBackground
        source={require('@/assets/images/top-bg.png')}
        style={styles.headerBg}
      >
        <Pressable
          style={styles.logo}
          onPress={() => { navigation.navigate('Home') }}
        >
          <Image
            style={styles.logoImg}
            source={require('@/assets/images/864.png')}
          />
        </Pressable>
        {
          userState.status &&
          (<Pressable
            style={styles.profile}
          >
            <Image
              style={styles.profileImg}
              source={{
                uri: 'https://panel.coffeco.com.tr/polar/icerik/img/profil-small.jpg'
              }}
            />
            <Text style={styles.profileText}>{userInfoState.adi + ' ' + userInfoState.soyadi}</Text>
          </Pressable>)
        }
      </ImageBackground>
    </View>
  )
}
const styles = StyleSheet.create({
  logo: {
    paddingRight: 3,
    paddingLeft: 3,
    borderRadius: 64,
    backgroundColor: '#fff',
  },
  logoImg: {
    width: 64,
    height: 64,
  },
  header: {
    backgroundColor: '#fff',
    borderBottomColor: '#1B854B',
    borderBottomWidth: 2
  },
  headerBg: {
    backgroundColor: '#fff',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 80,
    resizeMode: 'repeat',
  },
  profile: {
    borderRadius: 64,
    height: 64,
    paddingRight: 10,
  },
  profileImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#1B854B',
  },
  profileText: {
    position: 'absolute',
    bottom: -5,
    left: -80,
    fontFamily: 'Nunito-SemiBold',
    textAlign: 'left',
    fontSize: 14,
    width: 160,
    color: '#000',
  },
})
