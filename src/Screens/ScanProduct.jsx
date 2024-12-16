import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import icons
import Scanning from '../Components/Scanning/Scanning';
import { useAPI } from '../Context/APIContext';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const ScanProductPage = () => {
  const [productInfo, setProductInfo] = useState({});
  const [scanning, setScanning] = useState(false);
  const [barcode, setBarcode] = useState(null);
  const [cartProducts, setCartProducts] = useState([]); // Array to store cart products
  const [refreshing, setRefreshing] = useState(false); // State for refresh control
  const { oneProduct } = useAPI();

  const changeProductInfo = () => {
    setScanning(true);
  };

  // Load cart from AsyncStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('cart');
        if (savedCart) {
          setCartProducts(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };
    loadCart();
  }, []);

  // Save cart to AsyncStorage whenever it updates
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(cartProducts));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    };
    saveCart();
  }, [cartProducts]);

  useEffect(() => {
    if (barcode) {
      // Assuming oneProduct is a function that takes barcode and returns product info
      oneProduct(barcode).then((response) => {
        console.log("Response :", response);
        
        if (response.success) {
          const { data } = response;
          setProductInfo({
            id: data.id,
            name: data.productName,
            category:data.category?.name, // You'll need to map this from your categories
            brand:   data.brand?.name, // Map it similarly for the brand if necessary
            price: data.productPrice,
            productCode: data.productCode,
            description: data.description,
            quantity: 1, // Reset quantity to 1 for each new product
          });
        } else {
          // Handle the error scenario here
          console.log(response.message);
        }
      });
    }
  }, [barcode, oneProduct]);

  const handleAddToCart = () => {
    if (productInfo) {
      setCartProducts((prevCart) => {
        const updatedCart = [...prevCart, productInfo];
        console.log('Updated Cart:', updatedCart); // Print the updated cart in the console
        return updatedCart;
      });
    }
  };

  // Check if the product is already in the cart
  const isProductInCart = cartProducts.some((item) => item.id === productInfo.id);

  // Function to handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        setCartProducts(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart during refresh:', error);
    }
    setRefreshing(false);
  };

  return (
    scanning ? (
      <Scanning setScanning={setScanning} setBarcode={setBarcode} />
    ) : (
      <View style={styles.container}>
        <Text style={styles.title}>Scan Product</Text>

        {/* Barcode Scanner Button */}
        <TouchableOpacity style={styles.scanButton} onPress={changeProductInfo}>
          <Ionicons name="qr-code" size={30} color="#fff" />
          <Text style={styles.scanButtonText}>Scan Barcode</Text>
        </TouchableOpacity>

        {/* Scrollable Product Info Display */}
        {Object.keys(productInfo).length > 0 && (
          <ScrollView
            style={styles.productTableContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={styles.productTable}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Product Name</Text>
                <Text style={styles.tableCell}>{productInfo.name}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Category</Text>
                <Text style={styles.tableCell}>{productInfo.category}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Brand</Text>
                <Text style={styles.tableCell}>{productInfo.brand}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Price</Text>
                <Text style={styles.tableCell}>${productInfo.price}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Product Code</Text>
                <Text style={styles.tableCell}>{productInfo.productCode}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Description</Text>
                <Text style={styles.tableCell}>{productInfo.description}</Text>
              </View>
            </View>
          </ScrollView>
        )}

        {/* Add to Cart Button (fixed at the bottom of the screen) */}
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            (!productInfo || isProductInCart) && styles.disabledButton, // Disable style
          ]}
          onPress={handleAddToCart}
          disabled={!productInfo || isProductInCart} // Disable button if no product info or product is already in cart
        >
          <Text style={styles.addToCartText}>
            {isProductInCart ? 'Already in Cart' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
    justifyContent: 'flex-start', // No need to space out content, the Add to Cart button will be at the bottom
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  scanButton: {
    backgroundColor: '#4e92cc',
    padding: 15,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  scanButtonText: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 10,
  },
  productTableContainer: {
    flex: 1,
    marginBottom: 20,
  },
  productTable: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: '40%', // Controls the width of the header
  },
  tableCell: {
    fontSize: 16,
    color: '#333',
    width: '60%', // Controls the width of the cell
  },
  addToCartButton: {
    backgroundColor: '#006d77',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20, // Fixed at the bottom of the screen
    left: 20,
    right: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  addToCartText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default ScanProductPage;
