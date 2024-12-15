import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, RefreshControl } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAPI } from '../../Context/APIContext';
import * as FileSystem from 'expo-file-system'; // For file management in React Native
import * as Linking from 'expo-linking';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';  // Import expo-print for printing functionality

const POSBill = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBillIndex, setCurrentBillIndex] = useState(0);
  const [bills, setBills] = useState([]); // State for holding bills fetched from API
  const [isRefreshing, setIsRefreshing] = useState(false); // State to manage refreshing
  const { posBills, paidBill, printBill } = useAPI();

  useEffect(() => {
    fetchBills(); // Fetch bills on component mount
  }, [posBills]);

  const fetchBills = async () => {
    setIsRefreshing(true);
    try {
      const response = await posBills();
      if (response.success && response.data && Array.isArray(response.data.pendingBills)) {
        const fetchedBills = response.data.pendingBills.map(bill => ({
          customerName: bill.customerName,
          billID: bill.billId,
          id: bill.id,
          cartItems: bill.productData.map(product => ({
            name: product.product,
            quantity: parseInt(product.quantity, 10),
            price: parseFloat(product.price),
            totalPrice: parseFloat(product.total),
            weight: parseFloat(product.weight), // Adding weight field
          })),
          totalWeight: parseFloat(bill.totalWeight),
          totalBill: parseFloat(bill.totalBilling),
        }));
        setBills(fetchedBills);
      } else {
        Alert.alert('Error', 'No bills data found');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch bills');
      console.error('Error fetching bills:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredBills = bills.filter(bill => bill.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
  const currentBill = filteredBills[currentBillIndex];

  // Calculate the total bill
  const totalBill = currentBill?.cartItems.reduce((acc, item) => acc + item.totalPrice, 0) || 0;

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentBillIndex(0); // Reset to the first result when searching
  };

  const handlePrintBill = async () => {
    try {
      if (currentBill && currentBill.billID) {
        // Create HTML content for the bill
        const htmlContent = `
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; }
                .header { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
                .bill-id, .customer-name { font-size: 16px; margin-bottom: 5px; }
                .table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
                .table th, .table td { padding: 8px; text-align: left; border: 1px solid #ddd; }
                .total { font-size: 18px; font-weight: bold; text-align: right; }
                .footer { text-align: center; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="header">POS System</div>
              <div class="bill-id">Bill ID: ${currentBill.billID}</div>
              <div class="customer-name">Customer: ${currentBill.customerName}</div>

              <table class="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Weight</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${currentBill.cartItems.map(item => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.quantity}</td>
                      <td>$${item.price.toFixed(2)}</td>
                      <td>${item.weight}g</td>
                      <td>$${item.totalPrice.toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <div class="total">Total: $${totalBill.toFixed(2)}</div>
              <div class="total">Total Weight: ${currentBill.totalWeight}g</div>

              <div class="footer">Thank you for shopping with us!</div>
            </body>
          </html>
        `;
        
        // Use expo-print to print the HTML content
        await Print.printAsync({
          html: htmlContent,
        });
      } else {
        throw new Error('No bill selected or invalid bill ID.');
      }
    } catch (error) {
      console.error('Error printing bill:', error.message || error);
    }
  };

  const handlePaid = () => {
    if (currentBill && currentBill.billID) {
      paidBill(currentBill.id)
        .then(response => {
          if (response.success) {
            Alert.alert('Success', `Bill ID: ${currentBill.billID} has been marked as paid.`);
          } else {
            Alert.alert('Error', `Failed to mark Bill ID: ${currentBill.billID} as paid.`);
          }
        })
        .catch(error => {
          Alert.alert('Error', 'Failed to mark the bill as paid.');
          console.error('Error marking bill as paid:', error);
        });
    } else {
      Alert.alert('Error', 'No bill selected or invalid bill ID.');
    }
  };

  const handleNextBill = () => {
    if (currentBillIndex < filteredBills.length - 1) {
      setCurrentBillIndex(currentBillIndex + 1);
    }
  };

  const handlePrevBill = () => {
    if (currentBillIndex > 0) {
      setCurrentBillIndex(currentBillIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollableContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={fetchBills}
          />
        }
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Customer Name"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Bill Information */}
        {currentBill ? (
          <View style={styles.receiptContainer}>
            <Text style={styles.storeName}>POS System</Text>
            <Text style={styles.billID}>Bill ID: {currentBill.billID}</Text>
            <Text style={styles.customerName}>Customer: {currentBill.customerName}</Text>

            {/* Cart Items Table */}
            <View style={styles.cartTable}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Product</Text>
                <Text style={styles.tableHeader}>Quantity</Text>
                <Text style={styles.tableHeader}>Price</Text>
                <Text style={styles.tableHeader}>Weight</Text>
                <Text style={styles.tableHeader}>Total</Text>
              </View>
              {currentBill.cartItems.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.name}</Text>
                  <Text style={[styles.tableCell, styles.centered]}>{item.quantity}</Text>
                  <Text style={styles.tableCell}>${item.price.toFixed(2)}</Text>
                  <Text style={styles.tableCell}>{item.weight}g</Text>
                  <Text style={styles.tableCell}>${item.totalPrice.toFixed(2)}</Text>
                </View>
              ))}
            </View>

            {/* Total Price */}
            <Text style={styles.totalText}>Total Price: ${totalBill.toFixed(2)}</Text>
            <Text style={styles.totalText}>Total Weight: {currentBill.totalWeight}g</Text>
          </View>
        ) : (
          <Text style={styles.noBillText}>No bills found for this search</Text>
        )}
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        {/* Prev/Next Buttons */}
        <View style={styles.navButtonsContainer}>
          <TouchableOpacity style={styles.navButton} onPress={handlePrevBill}>
            <FontAwesome5 name="chevron-left" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleNextBill}>
            <FontAwesome5 name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Paid and Print Buttons */}
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity style={styles.paidButton} onPress={handlePaid}>
            <Text style={styles.actionButtonText}>Paid</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.printButton} onPress={handlePrintBill}>
            <Text style={styles.actionButtonText}>Print</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    justifyContent: 'space-between',
  },
  scrollableContent: {
    flexGrow: 1,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
  },
  searchInput: {
    fontSize: 16,
    padding: 10,
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  receiptContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: 'black',
    elevation: 3,
  },
  storeName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4e92cc',
    marginBottom: 10,
  },
  billID: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  customerName: {
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  cartTable: {
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: '20%', // Adjusted width for more balanced columns
  },
  tableCell: {
    fontSize: 16,
    color: '#333',
    width: '20%',
  },
  centered: {
    textAlign: 'center', // Added to center quantity
  },
  totalText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    textAlign: 'right',
  },
  noBillText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  actionButtonsContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  navButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  navButton: {
    backgroundColor: '#4e92cc',
    padding: 10,
    borderRadius: 8,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paidButton: {
    backgroundColor: '#4e92cc',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  printButton: {
    backgroundColor: '#34a853',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});
export default POSBill;
