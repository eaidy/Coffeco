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
import { Icons } from '../constants'
import Header from '@/components/header'
import Toast from 'react-native-simple-toast'
import { Checkbox } from 'react-native-paper'

//State Imports
import { basketAtom, userStateAtom } from '@/states/auth'

// Model Imports
import {
  ResponseModel,
  Variants,
  Variant,
  ProductBasketModel,
  BasketModel,
} from '@/models/models'
import NumericInput from 'react-native-numeric-input'
import { position } from '@shopify/restyle'

type VariantsExpand = Array<Boolean>

type ChildVariant = {
  description: string
  price: number
  bonus: number
  salePrice: number
  priceID: number
  parentID: number
  isActive: Boolean
}

type ChildVariants = Array<ChildVariant>

function ProductScreen({ route }: any) {
  const [userState] = useAtom(userStateAtom)
  const [basketState, setBasketState] = useAtom(basketAtom)

  const [haveVariants, setHaveVariants] = useState(false)
  const [selectedVariants, setSelectedVariants] = useState<any>([])
  const [variantsExpand, setVariantsExpand] = useState<VariantsExpand>([])
  const [Qty, setQty] = useState<number>(1)

  const navigation = useNavigation()

  const { productResponse } = route.params
  const [totalPrice, setTotalPrice] = useState<number>(0)

  useEffect(() => {
    console.log("PRODUCT RESPONSE --->>", productResponse)

    setHaveVariants(() => {
      return productResponse.variants.length !== 0 ? true : false
    })
    let variantsExpandBuffer = productResponse.variants.filter((variant: 0) => variant.parentID === 0).map((expand: any) => false)
    setVariantsExpand(variantsExpandBuffer)
  }, [])

  useEffect(() => {
    let total = 0
    total = Number((Qty * productResponse.product.price).toFixed(1)) // varyant fiyatları eklenecek
    setTotalPrice(total)
  }, [selectedVariants, Qty])

  const variantChildPressHandler = (variantChild: ChildVariant) => {
    // If variantChild is already active, don't bother executing the function
    if (selectedVariants.includes(variantChild)) {
      setSelectedVariants((prev: any) => {
        const updated = prev.filter((variant: any) => variant !== variantChild)
        console.log(updated)
        return [
          ...updated
        ]
      })
      console.log("SELECTD VARIANTS ==> ", selectedVariants)
    } else {
      setSelectedVariants((prev: any) => {
        const updated = prev
        updated.push(variantChild)
        console.log(updated)
        return [
          ...updated
        ]
      })
      console.log("SELECTD VARIANTS ==> ", selectedVariants)
    }
  }

  const addBasketHandler = async () => {
    let productApiObject: ProductBasketModel = {
      ProductID: 0,
      Qty: 0,
      Variants: '',
    },
      variantsApiArray: Array<{ id: number; value: number }>

    productApiObject.ProductID = productResponse.product.productID
    productApiObject.Qty = Qty

    variantsApiArray = selectedVariants
      .map((variant: any) => {
        return { id: variant.priceID, value: 1 }
      })

    productApiObject.Variants = JSON.stringify(variantsApiArray)
    console.log(productApiObject)

    await fetch('https://api.entegre.pro/ui/UIntegration/AddBasket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userState.data}`,
      },
      body: JSON.stringify(productApiObject),
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log(data)
        Toast.showWithGravity('Ürün sepete eklendi', Toast.SHORT, Toast.TOP)
      })
      .catch(err => {
        console.log(err)
        Toast.showWithGravity(`Hata, ${err}`, Toast.SHORT, Toast.TOP)
      })

    await fetch('https://api.entegre.pro/ui/UIntegration/Basket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userState.data}`,
      },
    })
      .then(res => {
        return res.json()
      })
      .then((data: any) => {
        setBasketState(data.data.order.total)
        console.log(basketState + ' Ata')
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        navigation.goBack()
      })
  }

  return (
    <>
      <Header />
      <View style={styles.pageWrapper}>
        <ImageBackground
          source={require('@/assets/images/product-bg.jpg')}
          style={styles.detailBg}
        >
          <View style={{ flex: 3, backgroundColor: 'transparent' }}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>Geri Dön</Text>
            </Pressable>
            <View style={styles.detailPage}>
              <Image
                style={styles.detailImage}
                source={
                  productResponse.product.photo !==
                    'https://panel.coffeco.com.tr/'
                    ? { uri: productResponse.product.photo }
                    : require('@/assets/images/product.png')
                }
              />
              <Text style={styles.detailTitle}>
                {productResponse.product.productName}
              </Text>
              <Text style={styles.detailText}>{productResponse.product.shortDescription}</Text>
            </View>
          </View>
          <View style={{
            flex: 3,
            backgroundColor: 'transparent',
            width: '100%',
            alignSelf: 'center',
            justifyContent: 'flex-end'
          }}
          >
            <View
              style={{
                flex: 1,
                maxHeight: (haveVariants ? '100%' : '25%'),
                justifyContent: 'center',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                alignItems: 'center',
                backgroundColor: '#fff'
              }}
            >
              {
                haveVariants &&
                (<ScrollView style={{
                  flex: 1,
                  width: '100%',
                  padding: 5
                }}
                >
                  {
                    productResponse.variants.filter((isParent: any) => isParent.parentID === 0).map((variantParent: Variant, parentIndex: any) => (
                      <Pressable
                        style={styles.option}
                        key={parentIndex}
                        onPress={() => {
                          setVariantsExpand(
                            variantsExpand.map((item, index) =>
                              index === parentIndex ? !item : item
                            )
                          )
                          console.log(variantsExpand)
                        }
                        }
                      >
                        <Text style={styles.optionTitle}>
                          {variantParent.description}
                        </Text>
                        <View style={styles.optionSelect}>
                          <Text style={styles.optionSelectText}>Seçiniz</Text>
                          <SvgXml
                            xml={Icons.iconArrow}
                            width="24"
                            height="24"
                            style={styles.navIcon}
                          />
                        </View>
                        <View style={styles.sizeSelect}>
                          {

                            variantsExpand[parentIndex] &&
                            (
                              <View style={{ marginTop: 20 }}>
                                {productResponse.variants
                                  .filter(
                                    (isParentsChild: any) =>
                                      isParentsChild.parentID === variantParent.priceID
                                  )
                                  .map((variantChild: any, childIndex: any) => (
                                    <Pressable
                                      key={childIndex}
                                      style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        padding: 2,
                                        marginEnd: 15,
                                        marginStart: 15,
                                        borderColor: 'gray',
                                        borderBottomWidth: 0.5,
                                        marginBottom: 10
                                      }}
                                      onPress={() => {
                                        variantChildPressHandler(variantChild)
                                      }}
                                    >
                                      <Text style={{ flex: 5, fontSize: 15 }}>
                                        {variantChild.description}
                                      </Text>
                                      <View style={{
                                        flex: 1,
                                        position: 'absolute',
                                        right: 15
                                      }}>
                                        <Checkbox
                                          status={selectedVariants.includes(variantChild) ? 'checked' : 'unchecked'}
                                          onPress={() => {
                                            variantChildPressHandler(variantChild)
                                          }}
                                          color="#1B854B"
                                        />
                                      </View>
                                    </Pressable>
                                  ))}
                              </View>
                            )
                          }
                        </View>
                      </Pressable>
                    ))}
                </ScrollView>)
              }
              <View style={styles.optionListFooter}>
                <NumericInput
                  onChange={value => setQty(value)}
                  minValue={1}
                  iconSize={5}
                  totalWidth={100}
                  totalHeight={50}
                  rounded
                  type="up-down"
                  value={Qty}
                />
                {/* <TextInput
                  style={styles.optionNumber}
                  placeholder="Adet"
                  keyboardType="numeric"
                  onChangeText={setQty}
                  value={Qty}
                /> */}
                <Pressable
                  style={styles.optionCart}
                  onPress={() => addBasketHandler()}
                >
                  <Text style={styles.optionCartText}>SEPETE EKLE</Text>
                  <Text style={styles.optionCartPrice}>{totalPrice} ₺</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    height: '100%'
  },
  sizeSelect: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  detailBg: {
    height: '100%',
  },
  detailPage: {
    width: '100%',
    height: '70%',
    display: 'flex',
    alignItems: 'center',
    marginTop: 50,
    justifyContent: 'center',
  },
  detailImage: {
    height: '90%',
    marginTop: 60,
    resizeMode: 'cover',
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 20
  },
  detailTitle: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Nunito-ExtraBold',
    alignSelf: 'center',
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
    bottom: 80,
    left: 0,
    width: '100%',
    position: 'absolute',
    maxHeight: '75%',
    minHeight: 300,
    elevation: 15,
    paddingTop: 15,
    paddingBottom: 70,
    color: '#000',
  },
  optionListSingle: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    bottom: 0,
    left: 0,
    position: 'absolute',
    height: '25%',
    width: '100%',
    elevation: 15,
    paddingTop: 15,
    paddingBottom: 80,
    color: '#000',
  },
  optionListScroll: {
    flex: 1,
    elevation: 36,
    maxHeight: '100%',
  },
  option: {
    width: '95%',
    marginLeft: '2.5%',
    marginRight: '2.5%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: 10,
    borderRadius: 14,
    shadowColor: '#000',
    backgroundColor: '#fff',
    marginBottom: 5,
    marginTop: 15,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 4,
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
    width: '90%',
    backgroundColor: 'transparent',
    paddingBottom: 10,
    left: '5%',
    right: '5%'
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
    fontFamily: 'Nunito-SemiBold',
    fontSize: 15,
  },
  optionCartPrice: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
  optionSelectText: {},
  optionVariantActive: {
    // marginRight: 15,
    backgroundColor: '#1b854b',
    marginTop: 10,
    marginRight: 10,
    borderRadius: 14,
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 8,
    paddingBottom: 8,
    lineHeight: 1,
    shadowColor: '#999',
    shadowOffset: {
      width: 0,
      height: 20,
    },
  },
  optionVariantInactive: {
    backgroundColor: '#f0f5f7',
    marginTop: 10,
    marginRight: 10,
    borderRadius: 14,
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 8,
    paddingBottom: 8,
    lineHeight: 1,
    shadowColor: '#999',
    shadowOffset: {
      width: 0,
      height: 10,
    },
  },
  variantTextActive: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
  },
  variantTextInactive: {
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  backButtonText: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
})

export default ProductScreen
