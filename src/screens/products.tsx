// API Imports
import React, { useEffect, useState } from 'react'
import { useAtom } from 'jotai'

// Components Imports
import { Pressable, Text } from '@/atoms'
import { Modal, Image, ScrollView, StyleSheet, View, ImageBackground, TextInput } from 'react-native'
import Header from '@/components/header'
import { SvgXml } from 'react-native-svg'

// Service Imports
import { fetchData } from '@/services/methods'
import { categoriesAtom, productsAtom, userStateAtom } from '@/states/auth'

// Model Imports
import { Category } from '../states/auth'
import { Product } from '@/models/models'

type ProductModalState = {
  modalState: boolean;
  modalData: Object;
  modalProductData: Object;
}

function ProductsScreen() {

  // States
  const [categoriesItems, setCategories] = useAtom(categoriesAtom)
  const [products, setProducts] = useAtom(productsAtom)
  const [userState,] = useAtom(userStateAtom)

  const [productModalState, setProductModalState] = useState<ProductModalState>({
    modalState: false,
    modalData: {},
    modalProductData: {}
  })
  let bufferObject: ProductModalState = {
    modalState: false,
    modalData: {},
    modalProductData: {}
  }

  useEffect(() => {  /* Fetch and set the categories initially when the main page loads */

    fetchData('Categories', {
      authToken: userState.data,
      method: 'GET'
    })
      .then((res: any) => {
        setCategories(res)
        //console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })

  }, [])

  const categoryPressHandler = (category: Category) => {
    fetchData('Products', {
      key: category.categoriID,
      paramLabel: 'CategoryId',
      authToken: userState.data,
      method: 'POST'
    })
      .then((res) => {
        setProducts(res)
        console.log(products)
      })
  }

  const productPressHandler = (productID: number) => {
    fetchData('Product', {
      key: productID,
      paramLabel: 'ID',
      authToken: userState.data,
      method: 'POST'
    })
      .then((res) => {
        bufferObject.modalData = res
        bufferObject.modalState = !productModalState?.modalState
        bufferObject.modalProductData = res.product
        setProductModalState({ ...bufferObject })
        console.log(bufferObject)
      })
  }

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={productModalState.modalState}
        onRequestClose={() => {
          console.log("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.pageWrapperTwo}>
              <ImageBackground
                source={require('@/assets/images/product-bg.jpg')}
                style={styles.detailBg}
              >
                <Image
                  style={styles.detailImage}
                  source={require('@/assets/images/product.png')}
                />
                <Text style={styles.detailTitle}>{productModalState.modalProductData.productName}</Text>
                <Text style={styles.detailText}>Laktozsuz süt seçeneği ile</Text>
              </ImageBackground>
              {/* <View style={styles.optionList}>
                <ScrollView style={styles.optionListScroll}>
                  <Pressable style={styles.option}>
                    <Text style={styles.optionTitle}>Boyut</Text>
                    <View style={styles.optionSelect}>
                      <Text style={styles.optionSelectText}>Seçiniz</Text>
                      <SvgXml
                        xml={iconArrow}
                        width="24"
                        height="24"
                        style={styles.navIcon}
                      />
                    </View>
                  </Pressable>
                  <Pressable style={styles.option}>
                    <Text style={styles.optionTitle}>Süt</Text>
                    <View style={styles.optionSelect}>
                      <Text style={styles.optionSelectText}>Seçiniz</Text>
                      <SvgXml
                        xml={iconArrow}
                        width="24"
                        height="24"
                        style={styles.navIcon}
                      />
                    </View>
                  </Pressable>
                  <Pressable style={styles.option}>
                    <Text style={styles.optionTitle}>Şurup</Text>
                    <View style={styles.optionSelect}>
                      <Text style={styles.optionSelectText}>Seçiniz</Text>
                      <SvgXml
                        xml={iconArrow}
                        width="24"
                        height="24"
                        style={styles.navIcon}
                      />
                    </View>
                  </Pressable>
                  <Pressable style={styles.option}>
                    <Text style={styles.optionTitle}>Krema</Text>
                    <View style={styles.optionSelect}>
                      <Text style={styles.optionSelectText}>Seçiniz</Text>
                      <SvgXml
                        xml={iconArrow}
                        width="24"
                        height="24"
                        style={styles.navIcon}
                      />
                    </View>
                  </Pressable>
                  <Pressable style={styles.option}>
                    <Text style={styles.optionTitle}>Shot</Text>
                    <View style={styles.optionSelect}>
                      <Text style={styles.optionSelectText}>Seçiniz</Text>
                      <SvgXml
                        xml={iconArrow}
                        width="24"
                        height="24"
                        style={styles.navIcon}
                      />
                    </View>
                  </Pressable>
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
              </View> */}
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                bufferObject = {
                  modalState: false,
                  modalData: {},
                  modalProductData: {}
                }
                setProductModalState({ ...bufferObject })
              }}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Header />

      <View style={styles.pageWrapper}>
        <ScrollView contentContainerStyle={styles.categories} horizontal={true}>
          {categoriesItems &&
            categoriesItems.map((categoryItem: Category) => (
              <Pressable
                style={[styles.navItem, styles.navItemActive]}
                onPress={() => categoryPressHandler(categoryItem)}
                key={categoryItem.categoriID}
              >
                <Text
                  style={[styles.navItemText,
                  styles.navItemTextActive]}
                >
                  {categoryItem.category}
                </Text>
              </Pressable>
            ))
          }
        </ScrollView>
        <ScrollView contentContainerStyle={styles.productList}>
          {
            products &&
            products.map((product: Product) => (
              <View
                style={styles.product}
                key={product.productID}
              >
                <Image
                  style={styles.productImg}
                  source={require('@/assets/images/urun-1.png')}
                />
                <View style={styles.productBottom}>
                  <Text style={styles.productTitle}>{product.productName}</Text>
                  <Text style={styles.productText}>Laktozsuz süt seçeneği ile</Text>
                  <Text style={styles.productPrice}>{product.price}</Text>
                  <Pressable
                    style={styles.productPlus}
                    onPress={() => productPressHandler(product.productID)}
                  >
                    <Text style={styles.productPlusText}>+</Text>
                  </Pressable>
                </View>
              </View>
            ))
          }
        </ScrollView>
      </View>
    </>
  )
}
const styles = StyleSheet.create({
  pageWrapper: {
    backgroundColor: '#fbfbfb',
    paddingBottom: 80,
  },
  categories: {
    //dislay: 'flex',
    height: 80,
    padding: '4%',
    alignItems: 'center',
  },
  navItem: {
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 12,
    paddingBottom: 12,
    lineHeight: 1,
    shadowColor: '#999',
    shadowOffset: {
      width: 0,
      height: 133,
    },
    shadowOpacity: 0.17,
    shadowRadius: 4.65,
    elevation: 6,
  },
  navItemActive: {
    backgroundColor: '#1b854b',
  },
  navItemText: {
    color: '#1b854b',
    fontFamily: 'Nunito-ExtraBold',
  },
  navItemTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: '4%',
    paddingBottom: 170,
  },
  product: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    shadowColor: '#999',
    marginBottom: '4%',
    shadowOffset: {
      width: 0,
      height: 133,
    },
    shadowOpacity: 0.17,
    shadowRadius: 4.65,
    elevation: 6,
  },
  productImg: {
    resizeMode: 'cover',
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 14,
  },
  productBottom: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 70,
    marginTop: -15,
  },
  productTitle: {
    color: '#000',
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 17,
  },
  productText: {
    color: '#969696',
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    marginTop: 4,
  },
  productPrice: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    fontSize: 18,
    color: '#1b854b',
    fontFamily: 'Nunito-ExtraBold',
  },
  productPlus: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1b854b',
    borderRadius: 50,
  },
  productPlusText: {
    color: '#fff',
    fontSize: 20,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },

  pageWrapperTwo: {
    height: '80%',
    width: '80%'
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
export default ProductsScreen
