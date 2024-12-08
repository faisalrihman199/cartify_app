import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const ProceedBillPage = () => {
  const customerName = 'John Doe';  // Example customer name
  const billID = 'BILL123456'; // Example bill ID
  const cartItems = [
    { name: 'Product 1', quantity: 2, price: 10, totalPrice: 20 },
    { name: 'Product 2', quantity: 1, price: 15, totalPrice: 15 },
    { name: 'Product 3', quantity: 3, price: 7, totalPrice: 21 },
    { name: 'Product 3', quantity: 3, price: 7, totalPrice: 21 },
    { name: 'Product 3', quantity: 3, price: 7, totalPrice: 21 },
    { name: 'Product 3', quantity: 3, price: 7, totalPrice: 21 },
    // Add more items for larger bills if needed
  ];

  // Calculate the total bill
  const totalBill = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleDownloadBill = () => {
    // Logic for downloading the bill as a PDF
    console.log('Downloading bill as PDF...');
  };

  const handleSendToPOS = () => {
    // Logic for sending the bill to POS
    console.log('Sending bill to POS...');
  };

  const handlePayOnline = () => {
    // Logic for processing online payment
    console.log('Processing online payment...');
  };

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView style={styles.scrollableContent}>
        {/* Receipt Container with black borders */}
        <View style={styles.receiptContainer}>
          <Text style={styles.storeName}>Cartify</Text>
          <Text style={styles.billID}>Bill ID: {billID}</Text>
          <Text style={styles.customerName}>Customer: {customerName}</Text>

          {/* Cart Items Table */}
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

          {/* Total Price */}
          <Text style={styles.totalText}>Total Price: ${totalBill}</Text>
        </View>
      </ScrollView>

      {/* Download Bill Button */}
      <View style={styles.downloadButtonContainer}>
        <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadBill}>
          <Text style={styles.downloadButtonText}>Download Bill as PDF</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons at Bottom */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleSendToPOS}>
          <Text style={styles.actionButtonText}>Send to POS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handlePayOnline}>
          <Text style={styles.actionButtonText}>Pay Online</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    justifyContent: 'space-between', // Ensures space between content and bottom buttons
  },
  scrollableContent: {
    flexGrow: 1, // This makes sure the content grows and pushes the buttons down
  },
  receiptContainer: {
    backgroundColor: '#fff',
    padding: 20,
    margin: '5%',
    marginBottom: 20,
    borderRadius: 15,
    borderWidth: 0.5,        // Black border width
    borderColor: 'black',
    elevation: 3, // Add elevation for Android shadow
  },
  storeName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  billID: {
    fontSize: 16,
    marginBottom: 5,
  },
  customerName: {
    fontSize: 16,
    marginBottom: 15,
  },
  cartTable: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
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
    width: '25%',
  },
  tableCell: {
    fontSize: 16,
    color: '#333',
    width: '25%',
  },
  totalText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
  },
  downloadButtonContainer: {
    alignItems: 'center', // Center the button horizontally
    marginVertical: 20,
  },
  downloadButton: {
    backgroundColor: '#4e92cc',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  downloadButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginBottom: 20, // Space for bottom buttons
  },
  actionButton: {
    backgroundColor: '#4e92cc',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default ProceedBillPage;
