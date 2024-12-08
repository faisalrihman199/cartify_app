import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const CartPage = () => {
  // Example cart data - this would normally be managed by a state or fetched from a backend
  const [cartItems, setCartItems] = useState([
    { name: 'Product 1', quantity: 2, price: 10, totalPrice: 20 },
    { name: 'Product 2', quantity: 1, price: 15, totalPrice: 15 },
    { name: 'Product 3', quantity: 3, price: 7, totalPrice: 21 },
  ]);

  // Calculate the total bill
  const totalBill = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleProceedToBilling = () => {
    // Proceed to billing functionality, e.g., navigating to a checkout page
    console.log('Proceeding to billing...');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      {/* Cart Items Table */}
      <ScrollView style={styles.cartTableContainer}>
        <View style={styles.cartTable}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Product</Text>
            <Text style={styles.tableHeader}>Quantity</Text>
            <Text style={styles.tableHeader}>Price</Text>
            <Text style={styles.tableHeader}>Total</Text>
          </View>
          {cartItems.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.name}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>${item.price}</Text>
              <Text style={styles.tableCell}>${item.totalPrice}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Total Bill and Proceed Button in One Row */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Bill: ${totalBill}</Text>
        <TouchableOpacity style={styles.proceedButton} onPress={handleProceedToBilling}>
          <Text style={styles.proceedButtonText}>Proceed to Billing</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  cartTableContainer: {
    flex: 1,
    marginBottom: 20,
  },
  cartTable: {
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
    width: '25%', // Controls the width of the header
  },
  tableCell: {
    fontSize: 16,
    color: '#333',
    width: '25%', // Controls the width of the cell
  },
  totalContainer: {
    flexDirection: 'row', // Align items horizontally
    justifyContent: 'space-between', // Space out the text and button
    alignItems: 'center', // Vertically center the items
    marginBottom: 20,
  },
  totalText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginRight: 10, // To give some space between the text and the button
  },
  proceedButton: {
    backgroundColor: '#4e92cc',
    padding: 12,
    paddingHorizontal:20,
    borderRadius: 10,
    alignItems: 'center',
  },
  proceedButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default CartPage;
