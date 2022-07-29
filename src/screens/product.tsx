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
import {SvgXml} from 'react-native-svg';
import { Icons } from '../constants';
import Header from '@/components/header'
import Toast from 'react-native-simple-toast';

//State Imports
import { basketAtom, userStateAtom } from '@/states/auth'

// Model Imports
import { ResponseModel, Variants, Variant, ProductBasketModel, BasketModel } from '@/models/models'
import NumericInput from 'react-native-numeric-input'

type VariantsExpand = Array<Boolean>

type ChildVariant = {
  description: string;
  price: number;
  bonus: number;
  salePrice: number;
  priceID: number;
  parentID: number;
  isActive: Boolean;
}

type ChildVariants = Array<ChildVariant>


function ProductScreen({ route }: any) {

  const [userState,] = useAtom(userStateAtom)
  const [basketState, setBasketState] = useAtom(basketAtom)

  const [variantParents, setVariantParents] = useState<Variants>([])
  const [variantChilds, setVariantChilds] = useState<ChildVariants>([])
  const [variantsExpand, setVariantsExpand] = useState<VariantsExpand>([])
  const [Qty, setQty] = useState<number>(1)

  const navigation = useNavigation()

  const { productResponse } = route.params
  const [totalPrice, setTotalPrice] = useState<number>(0)

  let tempParents: Variants
  let tempChilds: ChildVariants

  const buffer = productResponse.variants

  useEffect(() => {
    // Parent Variants Filter
    tempParents = buffer.filter((variant: Variant) => variant.parentID === 0) // 0 means the variant is a parent
    setVariantParents(tempParents)
    setVariantsExpand(tempParents.map(() => false))
    // Child Variants Filter
    tempChilds = buffer.filter((variant: ChildVariant) => variant.parentID === 1) // 1 means the variant is a child
    tempChilds = tempChilds.map((variant: ChildVariant) => {
      return {
        ...variant,
        isActive: false
      }
    })
    setVariantChilds(tempChilds)
  }, [])

  useEffect(() => {
    let total = 0
    total = (Qty * productResponse.product.price).toFixed(1) // varyant fiyatları eklenecek
    setTotalPrice(total)
  }, [variantChilds, Qty])

  const variantChildPressHandler = (variantChild: ChildVariant) => {
    // If variantChild is already active, don't bother executing the function
    if (variantChild.isActive) {
      return
    }

    let variantChildsBuffer = [...variantChilds],
      variant: any

    console.log(variantChildsBuffer)

    for (variant of variantChildsBuffer) {
      if (variant.parentID === variantChild.parentID && variant.priceID !== variantChild.priceID) {
        variant.isActive = false
      }
      else if (variant.parentID === variantChild.parentID && variant.priceID === variantChild.priceID) {
        variant.isActive = true
      }
    }
    setVariantChilds(variantChildsBuffer)
  }

  const addBasketHandler = async () => {
    let productApiObject: ProductBasketModel = {
      ProductID: 0,
      Qty: 0,
      Variants: ""
    },
      variantsApiArray: Array<{ id: number, value: number }>

    productApiObject.ProductID = productResponse.product.productID
    productApiObject.Qty = Qty

    variantsApiArray = variantChilds.filter((variant) => variant.isActive).map((variant) => { return { id: variant.priceID, value: 1 } })

    productApiObject.Variants = JSON.stringify(variantsApiArray)
    console.log(productApiObject)

    await fetch('https://api.entegre.pro/ui/UIntegration/AddBasket', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userState.data}`
      },
      body: JSON.stringify(productApiObject)
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        console.log(data)
        Toast.showWithGravity('Ürün sepete eklendi', Toast.SHORT, Toast.TOP);
      })
      .catch((err) => {
        console.log(err)
        Toast.showWithGravity(`Hata, ${err}`, Toast.SHORT, Toast.TOP);
      })


    await fetch('https://api.entegre.pro/ui/UIntegration/Basket', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userState.data}`
      }
    })
      .then((res) => {
        return res.json()
      })
      .then((data: any) => {
        setBasketState(data.data.order.total)
        console.log(basketState + ' Ata')
      })
      .catch((err) => {
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
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>
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
        {
          variantParents !== [] &&
          (
            <View style={styles.optionList}>
              <ScrollView style={styles.optionListScroll}>

                {
                  variantParents.map((variantParent: Variant, parentIndex) =>
                  (
                    <Pressable
                      style={styles.option}
                      key={parentIndex}
                      onPress={() => setVariantsExpand(variantsExpand.map((item, index) => index === parentIndex ? !item : item))}
                    >
                      <Text style={styles.optionTitle}>{variantParent.description}</Text>
                      <View style={styles.optionSelect}>
                        <Text style={styles.optionSelectText}>Seçiniz</Text>
                        <SvgXml
                              xml={Icons.iconArrow}
                              width="24"
                              height="24"
                              style={styles.navIcon}
                            />
                      </View>
                      {
                        (<View style={styles.sizeSelect}>
                          {
                            variantsExpand[parentIndex] &&
                            variantChilds.filter((isParentsChild) => isParentsChild.parentID === variantParent.priceID)
                              .map((variantChild, childIndex) =>
                              (
                                <Pressable
                                  style={variantChild.isActive ? [styles.optionVariantActive] : [styles.optionVariantInactive]}
                                  key={childIndex}
                                  onPress={() => variantChildPressHandler(variantChild)}
                                >
                                  <Text
                                    style={variantChild.isActive ? [styles.variantTextActive] : [styles.variantTextInactive]}
                                  >
                                    {variantChild.description}
                                  </Text>
                                </Pressable>
                              ))
                          }
                        </View>
                        )
                      }
                    </Pressable>
                  ))
                }
              </ScrollView>

              <View style={styles.optionListFooter}>
                <NumericInput
                  onChange={value => setQty(value)}
                  minValue={0}
                  rounded
                  iconSize={5}
                  totalWidth={100}
                  totalHeight={50}
                  type='up-down'
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
                  <Text style={styles.optionCartPrice}>{totalPrice}₺</Text>
                </Pressable>
              </View>

            </View>
          )
        }
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  pageWrapper: {
    height: '100%',
  },
  sizeSelect:{
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
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
    flexWrap: 'wrap',
    padding: 10,
    borderRadius: 14,
    shadowColor: '#000',
    backgroundColor: '#fff',
    marginBottom: 10,
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

  },
  optionVariantActive: {
    // marginRight: 15,
    backgroundColor: '#1b854b',
    marginTop: 10,
    marginRight:10,
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
    }
  },
  optionVariantInactive: {
    backgroundColor: '#f0f5f7',
    marginTop: 10,
    marginRight:10,
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
    }
  },
  variantTextActive: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    textAlign: 'center'
  },
  variantTextInactive: {
    fontFamily: 'Nunito-Bold',
    textAlign: 'center'
  },
  backButton: {
    position: 'absolute',
    right: 15,
    top: 15
  },
  backButtonText: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  }
})

export default ProductScreen
