import React from 'react'
import { Box, Text } from '@/atoms'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { View, TouchableOpacity, StyleSheet } from 'react-native'

import { SvgXml } from 'react-native-svg';
import { Icons } from '../constants';


function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.navbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name

        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({ name: route.name, merge: true })
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          })
        }

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            key={index}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.navbarButton}
          >
            {
              options.title === 'Anasayfa' &&
              (
                <SvgXml
                  xml={Icons.iconHome}
                  width="24"
                  height="24"
                  fill={isFocused ? 'green' : 'gray'}
                />
              )
            }
            {
              options.title === 'Kartlar' &&
              (
                <SvgXml
                  xml={Icons.iconTag}
                  width="24"
                  height="24"
                  fill={isFocused ? 'green' : 'gray'}
                />
              )
            }
            {
              options.title === 'QR' &&
              (
                <SvgXml
                  xml={Icons.iconQR}
                  width="30"
                  height="30"
                  fill={isFocused ? 'green' : 'gray'}
                />
              )
            }
            {
              options.title === 'Ürünler' &&
              (
                <SvgXml
                  xml={Icons.iconMap}
                  width="24"
                  height="24"
                  fill={isFocused ? 'green' : 'gray'}
                />
              )
            }
            {
              options.title === 'Sepet' &&
              (
                <SvgXml
                  xml={Icons.iconCart}
                  width="24"
                  height="24"
                  fill={isFocused ? 'green' : 'gray'}
                />
              )
            }
            {
              label !== 'QR' &&
              (
                <Text
                  fontSize={12}
                  style={[{ color: isFocused ? '#1c844a' : '#343434' }, styles.navbarButtonText]}
                >
                  {label}
                </Text>
              )
            }
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default TabBar


const styles = StyleSheet.create({
  navItem: {
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 15,
    paddingBottom: 15,
    shadowColor: '#999',
    shadowOffset: {
      width: 0,
      height: 133,
    },
    shadowOpacity: 0.17,
    shadowRadius: 4.65,
    elevation: 6,
  },
  navItemText: {
    color: '#1b854b',
    fontFamily: 'Nunito-ExtraBold',
  },
  navbar: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 70,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 1,
    shadowRadius: 16.0,
    elevation: 24,
  },
  navbarQR: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navbarQRText: {
    color: '#fff',
    backgroundColor: '#1b854b',
    width: 50,
    borderRadius: 50,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navbarQrIcon: {
    width: 26,
    resizeMode: 'contain',
  },
  navbarButton: {
    width: '20%',
    display: 'flex',
    alignItems: 'center',
  },
  navbarButtonText: {
    color: '#9795A4',
    textAlign: 'center',
    fontSize: 11,
    fontFamily: 'Nunito-ExtraBold',
    marginTop:4
  },
  navbarButtonTextActive: {
    color: '#1b854b',
    textAlign: 'center',
    fontSize: 11,
    fontFamily: 'Nunito-ExtraBold',
  },
  navIcon: {
    color: '#9795A4',
    marginBottom: 5,
  },
  navIconActive: {
    color: '#1b854b',
  },
});