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
import { ActivityIndicator } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

function ProductsScreen() {
  // States
  const [categoriesItems, setCategories] = useAtom(categoriesAtom)
  const [products, setProducts] = useAtom(productsAtom)
  const [userState] = useAtom(userStateAtom)

  const [activeCategoryID, setActiveCategoryID] = useState<number>() // For active category style
  const [clickedCategory, setClickedCategory] = useState(-1)

  const navigation = useNavigation()

  const categoryPressHandler = (category: Category) => {
    setClickedCategory(category.categoriID)
    fetchData('Products', {
      key: category.categoriID,
      paramLabel: 'CategoryId',
      authToken: userState.data,
      method: 'POST',
    })
      .then(res => {
        setProducts(res)
        setClickedCategory(-1)
        setActiveCategoryID(category.categoriID)
        console.log(res)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    /* Fetch and set the categories initially when the main page loads */

    fetchData('Categories', {
      authToken: userState.data,
      method: 'GET',
    })
      .then((res: any) => {
        setCategories(res)
        categoryPressHandler(res[0])
        //console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const productPressHandler = (productID: number) => {
    fetchData('Product', {
      key: productID,
      paramLabel: 'ID',
      authToken: userState.data,
      method: 'POST',
    }).then(res => {
      console.log(res)
      navigation.navigate('Product', {
        productResponse: res,
      })
    })
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      paddingBottom: 150,
      backgroundColor: '#fff'
    }}>
      <Header />
      <View style={styles.pageWrapper}>
        <ScrollView contentContainerStyle={styles.categories} horizontal={true}>
          {categoriesItems &&
            categoriesItems.map((categoryItem: Category, index) => (
              <Pressable
                key={index}
                style={
                  activeCategoryID === categoryItem.categoriID
                    ? [styles.navItem, styles.navItemActive]
                    : [styles.navItemActive, styles.navItem]
                }
                onPress={() => categoryPressHandler(categoryItem)}
              >
                {clickedCategory === categoryItem.categoriID && (
                  <ActivityIndicator
                    size={16}
                    animating={true}
                    color="#1B854B"
                    style={{ marginRight: 8 }}
                  />
                )}
                <Text
                  style={
                    activeCategoryID === categoryItem.categoriID
                      ? [styles.navItemTextActive]
                      : [styles.navItemText]
                  }
                >
                  {categoryItem.category}
                </Text>
              </Pressable>
            ))}
        </ScrollView>
        <ScrollView contentContainerStyle={styles.productList}>
          {products &&
            products.map((product: Product) => (
              <Pressable
                style={styles.product}
                key={product.productID}
                onPress={() => productPressHandler(product.productID)}
              >
                <View>
                  <Image
                    style={styles.productImg}
                    source={
                      product.photo !== 'https://panel.coffeco.com.tr/'
                        ? { uri: product.photo }
                        : require('@/assets/images/product.png')
                    }
                  />
                  <View style={styles.productBottom}>
                    <Text style={styles.productTitle}>
                      {product.productName}
                    </Text>
                    <Text style={styles.productText}>
                      {product.shortDescription}
                    </Text>
                    <Text style={styles.productBonus}>
                      {product.bonus.toFixed(2)} CoffeeCo Puan kazan
                    </Text>
                    <Text style={styles.productPrice}>{product.price} ₺</Text>
                    <View style={styles.productPlus}>
                      <Text style={styles.productPlusText}>+</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  pageWrapper: {
    backgroundColor: '#fbfbfb',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 12,
  },
  navItemTextActive: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
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
    marginTop: 10,
  },
  productTitle: {
    color: '#000',
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    minHeight: 30,
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
    fontFamily: 'Nunito-Bold',
  },
  productBonus: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#1b854b',
    marginTop: 3,
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
    borderRadius: 35,
    paddingBottom: 2,
  },
  productPlusText: {
    color: '#fff',
    fontSize: 20,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
})
export default ProductsScreen
