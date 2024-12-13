import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Import icons

const ScanProductPage = () => {
  const [productInfo, setProductInfo] = useState({
    name: 'Product 1',
    category: 'Electronics',
    brand: 'Brand A',
    price: 10,
    productCode: 'P001',
    description: 'A high-quality product',
    quantity: 1,
  });

  const changeProductInfo = () => {
    // Logic to change the product info with the next scan
    setProductInfo({
      name: 'Product 2',
      category: 'Clothing',
      brand: 'Brand B',
      price: 15,
      productCode: 'P002',
      description: 'Comfortable and stylish',
      quantity: 1,
    });
  };

  const increaseQuantity = () => {
    setProductInfo((prevInfo) => ({
      ...prevInfo,
      quantity: prevInfo.quantity + 1,
    }));
  };

  const decreaseQuantity = () => {
    setProductInfo((prevInfo) => ({
      ...prevInfo,
      quantity: prevInfo.quantity > 1 ? prevInfo.quantity - 1 : 1,
    }));
  };

  const handleAddToCart = () => {
    // Cart functionality will be implemented later
    console.log('Adding to cart...');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Product</Text>

      {/* Barcode Scanner Button */}
      <TouchableOpacity style={styles.scanButton} onPress={changeProductInfo}>
        <Ionicons name="qr-code" size={30} color="#fff" />
        <Text style={styles.scanButtonText}>Scan Barcode</Text>
      </TouchableOpacity>

      {/* Scrollable Product Info Display */}
      <ScrollView style={styles.productTableContainer}>
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

        {/* Quantity Control */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
            <MaterialIcons name="remove" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{productInfo.quantity}</Text>
          <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
            <MaterialIcons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add to Cart Button (fixed at the bottom of the screen) */}
      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={handleAddToCart}
      >
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    backgroundColor: '#4e92cc',
    padding: 10,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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
  addToCartText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default ScanProductPage;
