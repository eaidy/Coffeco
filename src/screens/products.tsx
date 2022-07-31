// API Imports
import React, { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { useNavigation } from '@react-navigation/native'

// Components Imports
import { Pressable, Text } from '@/atoms'
import { Image, ScrollView, StyleSheet, View } from 'react-native'
import Header from '@/components/header'

// Service Imports
import { fetchData } from '@/services/methods'
import { categoriesAtom, productsAtom, userStateAtom } from '@/states/auth'

// Model Imports
import { Category } from '@/models/models'
import { Product } from '@/models/models'

function ProductsScreen() {

  // States
  const [categoriesItems, setCategories] = useAtom(categoriesAtom)
  const [products, setProducts] = useAtom(productsAtom)
  const [userState,] = useAtom(userStateAtom)

  const [activeCategoryID, setActiveCategoryID] = useState<number>() // For active category style

  const navigation = useNavigation()

  const categoryPressHandler = (category: Category) => {
    fetchData('Products', {
      key: category.categoriID,
      paramLabel: 'CategoryId',
      authToken: userState.data,
      method: 'POST'
    })
      .then((res) => {
        setProducts(res)
        setActiveCategoryID(category.categoriID)
        console.log(res)
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {  /* Fetch and set the categories initially when the main page loads */

    fetchData('Categories', {
      authToken: userState.data,
      method: 'GET'
    })
      .then((res: any) => {
        setCategories(res)
        categoryPressHandler(res[0])
        //console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })

  }, [])

  const productPressHandler = (productID: number) => {
    fetchData('Product', {
      key: productID,
      paramLabel: 'ID',
      authToken: userState.data,
      method: 'POST'
    })
      .then((res) => {
        console.log(res)
        navigation.navigate('Product', {
          productResponse: res
        })
      })
  }

  return (
    <>
      <Header />
      <View style={styles.pageWrapper}>
        <ScrollView contentContainerStyle={styles.categories} horizontal={true}>
          {categoriesItems &&
            categoriesItems.map((categoryItem: Category) => (
              <Pressable
                style={activeCategoryID === categoryItem.categoriID ?
                  [styles.navItem, styles.navItemActive]
                  : [styles.navItemActive, styles.navItem]}
                onPress={() => categoryPressHandler(categoryItem)}
                key={categoryItem.categoriID}
              >
                <Text
                  style={activeCategoryID === categoryItem.categoriID ?
                    [styles.navItemTextActive]
                    : [styles.navItemText]}
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
                  source={product.photo !== "https://panel.coffeco.com.tr/" ? { uri: product.photo } : require("@/assets/images/product.png")}
                />
                <View style={styles.productBottom}>
                  <Text style={styles.productTitle}>{product.productName}</Text>
                  <Text style={styles.productText}>{product.shortDescription}</Text>
                  <Text style={styles.productBonus}>{product.bonus.toFixed(2)} bonus kazan</Text>
                  <Text style={styles.productPrice}>{product.price}₺</Text>
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
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingLeft: 20,
    paddingRight: 20,
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
    color: '#6d6d6d',
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 12
  },
  navItemTextActive: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12
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
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
  },
  productText: {
    color: '#969696',
    fontFamily: 'Nunito-Regular',
    fontSize: 9,
    marginTop: 3,
  },
  productPrice: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    fontSize: 15,
    color: '#1b854b',
    fontFamily: 'Nunito-Regular',
  },
  productBonus: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#1b854b',
    marginTop: 3
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
    borderRadius: 15,
    paddingBottom: 2
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
  }
})
export default ProductsScreen
