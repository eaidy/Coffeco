// API Imports
import React, { Component, useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { useNavigation } from '@react-navigation/native'

// Component Imports
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  TextInput,
  Image,
  Pressable,
} from 'react-native'
import { SvgXml } from 'react-native-svg'
import Header from '@/components/header'

// Model Imports
import { ResponseModel, Variants, Variant } from '@/models/models'

function ProductScreen({ route }: any) {

  const [variantParents, setVariantParents] = useState<Variants>([])
  const [variantChilds, setVariantChilds] = useState<Variants>([])

  const navigation = useNavigation()

  const { productResponse } = route.params

  let temp: Variants

  const buffer = productResponse.variants

  useEffect(() => {
    // Parent Variants Filter
    temp = buffer.filter((variant: Variant) => variant.parentID === 0) // 0 means the variant is a parent
    setVariantParents(temp)
    // Child Variants Filter
    temp = buffer.filter((variant: Variant) => variant.parentID === 1) // 1 means the variant is a child
    setVariantChilds(temp)
  }, [])

  return (
    <>
      <Header />
      <View style={styles.pageWrapper}>
        <ImageBackground
          source={require('@/assets/images/product-bg.jpg')}
          style={styles.detailBg}
        >
          <Pressable
            onPress={() => navigation.goBack()}
          >
            <Text>
              Geri Dön
            </Text>
          </Pressable>
          <Image
            style={styles.detailImage}
            source={require('@/assets/images/product.png')}
          />
          <Text style={styles.detailTitle}>Cappucino</Text>
          <Text style={styles.detailText}>Laktozsuz süt seçeneği ile</Text>
        </ImageBackground>
        <View style={styles.optionList}>

          <ScrollView style={styles.optionListScroll}>

            {
              variantParents.map((variantParent: Variant) =>
              (
                <Pressable
                  style={styles.option}
                  key={variantParent.priceID}
                >
                  <Text style={styles.optionTitle}>{variantParent.description}</Text>
                  <View style={styles.optionSelect}>
                    <Text style={styles.optionSelectText}>Seçiniz Test</Text>
                    {/* <SvgXml
                          xml={iconArrow}
                          width="24"
                          height="24"
                          style={styles.navIcon}
                        /> */}
                  </View>
                  <View>
                    {
                      variantChilds.filter((isParentsChild) => isParentsChild.parentID === variantParent.priceID)
                        .map((variantChild) =>
                        (
                          <Pressable
                            key={variantChild.priceID}
                          >
                            <Text>
                              {variantChild.description}
                            </Text>
                          </Pressable>
                        ))
                    }
                  </View>
                </Pressable>
              ))
            }
          </ScrollView>

          <View style={styles.optionListFooter}>
            <TextInput
              style={styles.optionNumber}
              placeholder="Adet"
              keyboardType="numeric"
            />
            <Pressable style={styles.optionCart}>
              <Text style={styles.optionCartText}>Sepet'e Ekle</Text>
              <Text style={styles.optionCartPrice}>15 Puan</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  pageWrapper: {
    height: '100%',
  },
  detailBg: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
    paddingTop: 15,
  },
  detailImage: {
    height: '50%',
  },
  detailTitle: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Nunito-ExtraBold',
    alignSelf: 'flex-start',
    paddingLeft: '4%',
    marginBottom: 5,
  },
  detailText: {
    color: '#f7f7f7',
    fontFamily: 'Nunito-Regular',
    alignSelf: 'flex-start',
    paddingLeft: '4%',
  },
  optionList: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    bottom: 0,
    left: 0,
    position: 'absolute',
    height: '53%',
    width: '100%',
    elevation: 15,
    paddingTop: 25,
    paddingBottom: 80,
    color: '#000',
  },
  optionListScroll: {
    flex: 1,
    elevation: 36,
  },
  option: {
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    shadowColor: '#000',
    backgroundColor: '#fff',
    marginBottom: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionTitle: {
    fontFamily: 'Nunito-Bold',
    color: '#000',
  },
  optionSelect: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  navIcon: {
    color: '#9795A4',
    marginLeft: 10,
  },
  optionListFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '4%',
    paddingRight: '4%',
    paddingTop: 10,
    paddingBottom: 10,
  },
  optionNumber: {
    width: '30%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    borderRadius: 14,
    textAlign: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionCart: {
    width: '66%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1b854b',
    borderRadius: 14,
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionCartText: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
  optionCartPrice: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
  },
  optionSelectText: {

  }
})

export default ProductScreen
