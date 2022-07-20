import React from 'react'
import {
  StyleSheet,
  View,
  Image,
} from 'react-native'
import { Text, Pressable, ImageBackground } from '@/atoms'
import { useAtom } from 'jotai'
import { userStateAtom } from '../states/auth'

export default function Header() {

  return (
    <View style={styles.header}>
      <ImageBackground
        source={require('@/assets/images/top-bg.png')}
        style={styles.headerBg}
      >
        <Pressable style={styles.logo}>
          <Image
            style={styles.logoImg}
            source={require('@/assets/images/logo.png')}
          />
        </Pressable>
        <Pressable style={styles.profile}>
          <Image
            style={styles.profileImg}
            source={require('@/assets/images/profile.jpg')}
          />
          <Text style={styles.profileText}>Ercan G.</Text>
        </Pressable>
      </ImageBackground>
    </View>
  )
}
const styles = StyleSheet.create({
  logo: {
    paddingRight: 15,
    paddingLeft: 5,
    backgroundColor: '#fff',
  },
  logoImg: {
    width: 64,
    height: 64,
  },
  header: {
    backgroundColor: '#fff',
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
    borderRadius: 64,
    borderWidth: 3,
    borderColor: '#1B854B',
  },
  profileText: {
    position: 'absolute',
    bottom: -5,
    left: -44,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#000',
  },
})
