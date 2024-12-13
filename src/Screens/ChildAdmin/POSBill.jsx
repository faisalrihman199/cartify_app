import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAPI } from '../../Context/APIContext';
import * as FileSystem from 'expo-file-system'; // For file management in React Native
import * as Linking from 'expo-linking';
import * as Sharing from 'expo-sharing';
import { Buffer } from 'buffer';




const POSBill = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBillIndex, setCurrentBillIndex] = useState(0);
  const [bills, setBills] = useState([]); // State for holding bills fetched from API
  const { posBills, paidBill, printBill } = useAPI();

  useEffect(() => {
    // Fetch bills from the API on component mount
    posBills()
      .then(response => {
        if (response.success && response.data && Array.isArray(response.data.pendingBills)) {
          const fetchedBills = response.data.pendingBills.map(bill => ({
            customerName: bill.customerName,
            billID: bill.billId,
            id:bill.id,
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
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to fetch bills');
        console.error('Error fetching bills:', error);
      });
  }, [posBills]);

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
        // API call to fetch the bill
        const response = await printBill(currentBill.billID);  
        if (!response) {
          throw new Error('Failed to fetch the file.');
        }
        let base64Data;
        if (typeof response === 'string') {
          // Assume response is Base64 if it's a string
          base64Data = response;
        } else {
          // Convert binary response to Base64
          base64Data = Buffer.from(response, 'binary').toString('base64');
        }
        // Ensure the data is a valid Base64 string
        if (!/^[A-Za-z0-9+/=]+$/.test(base64Data)) {
          throw new Error('Invalid Base64 data received.');
        }
        const fileUri = `${FileSystem.documentDirectory}${currentBill.billID}.pdf`;
        // Write the Base64 string to a file
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
  
        // Share the file if sharing is available
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        } else {
          console.log('Sharing is not available on this device.');
        }
      } else {
        throw new Error('No bill selected or invalid bill ID.');
      }
    } catch (error) {
      console.error('Error:', error.message || error);
    }
  };

  
  

  const handlePaid = () => {
    if (currentBill && currentBill.billID) {
      
      paidBill(currentBill.id)
        .then(response => {
         
          
          if (response.success) {
            // Alert on success
            Alert.alert('Success', `Bill ID: ${currentBill.billID} has been marked as paid.`);
          } else {
            // Alert on failure
            Alert.alert('Error', `Failed to mark Bill ID: ${currentBill.billID} as paid.`);
          }
        })
        .catch(error => {
          // Handle error if API call fails
          Alert.alert('Error', 'Failed to mark the bill as paid.');
          console.error('Error marking bill as paid:', error);
        });
    } else {
      // Alert if currentBill or billID is not available
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
      <ScrollView style={styles.scrollableContent}>
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
                <Text style={styles.tableHeader}>Weight</Text> {/* Added Weight Column */}
                <Text style={styles.tableHeader}>Total</Text>
              </View>
              {currentBill.cartItems.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.name}</Text>
                  <Text style={[styles.tableCell, styles.centered]}>{item.quantity}</Text> {/* Centered Quantity */}
                  <Text style={styles.tableCell}>${item.price.toFixed(2)}</Text>
                  <Text style={styles.tableCell}>{item.weight}g</Text> {/* Displaying Weight */}
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
