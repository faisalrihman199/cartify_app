import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Platform, RefreshControl, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useAPI } from '../Context/APIContext';
import * as Print from 'expo-print';

const BillHistoryPage = () => {
  // State variables
  const [bills, setBills] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { billHostory, printBill } = useAPI();

  // Fetch bills
  const fetchBills = () => {
    billHostory(startDate, endDate, searchText)
      .then((res) => {
        console.log("Bills fetched:", res);
        setBills(res.data.posBills); // Assuming the response contains 'data.posBills'
      })
      .catch((err) => {
        console.log("Error fetching bills:", err);
      });
  };

  useEffect(() => {
    fetchBills();
  }, []); // Fetch bills once when the page mounts

  // Filter bills based on Bill ID and Date Range
  const filteredBills = bills.filter((bill) => {
    const billDate = new Date(bill.createdAt);
    return (
      bill.billId.toLowerCase().includes(searchText.toLowerCase()) &&
      (startDate ? billDate >= startDate : true) &&
      (endDate ? billDate <= endDate : true)
    );
  });

  // Handle download button click (fetch and print bill)
  const handleDownloadBill = (billId) => {
    printBill(billId)
      .then((res) => {
        if (res.success) {
          // Generate the HTML for printing
          const billData = res.data;

          // If there are multiple products, we loop through the products
          const productList = Array.isArray(billData.product) ? billData.product : [billData.product]; // To handle multiple products
          const productsHTML = productList.map(product => `
            <tr>
              <td style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">${product.productName}</td>
              <td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${product.productPrice}</td>
              <td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${billData.quantity}</td>
              <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">${(parseFloat(product.productPrice) * billData.quantity).toFixed(2)}</td>
            </tr>
          `).join('');

          const billHTML = `
            <html>
              <head>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    margin: 40px;
                    color: #333;
                  }
                  .header {
                    text-align: center;
                    margin-bottom: 30px;
                  }
                  .header h1 {
                    font-size: 28px;
                    color: #4e92cc;
                  }
                  .header p {
                    font-size: 18px;
                    color: #666;
                  }
                  .bill-details {
                    margin-bottom: 30px;
                    padding: 20px;
                    background-color: #fafafa;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                  }
                  .bill-details p {
                    font-size: 16px;
                    line-height: 1.6;
                    margin: 10px 0;
                  }
                  .bill-details p strong {
                    color: #4e92cc;
                  }
                  table {
                    width: 100%;
                    margin-top: 20px;
                    border-collapse: collapse;
                  }
                  th, td {
                    padding: 10px;
                    text-align: left;
                    font-size: 16px;
                  }
                  th {
                    background-color: #4e92cc;
                    color: #fff;
                    text-align: center;
                  }
                  td {
                    border-bottom: 1px solid #ddd;
                  }
                  .total {
                    font-weight: bold;
                    font-size: 20px;
                    text-align: right;
                    margin-top: 20px;
                    color: #333;
                  }
                  .footer {
                    text-align: center;
                    margin-top: 40px;
                    font-size: 14px;
                    color: #888;
                  }
                </style>
              </head>
              <body>
                <div class="header">
                  <h1>Invoice - ${billData.billId}</h1>
                  <p>Status: Paid | Date: ${new Date(billData.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="bill-details">
                  <p><strong>Customer Name:</strong> ${billData.customer.name}</p>
                  <p><strong>Bill ID:</strong> ${billData.billId}</p>
                  <p><strong>Date:</strong> ${new Date(billData.createdAt).toLocaleDateString()}</p>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${productsHTML}
                  </tbody>
                </table>
                <div class="total">
                  <p>Total: $${parseFloat(billData.totalPrice).toFixed(2)}</p>
                </div>
                <div class="footer">
                  <p>Thank you for your purchase!</p>
                </div>
              </body>
            </html>
          `;

          // Print the bill HTML content
          Print.printAsync({
            html: billHTML,
          }).catch((error) => {
            console.log('Error printing bill:', error);
            Alert.alert('Error printing bill');
          });
        } else {
          Alert.alert(res.message || 'Failed to fetch bill data');
        }
      })
      .catch((err) => {
        console.log('Error in printBill:', err);
        Alert.alert('Error fetching bill details');
      });
  };

  // Date picker handlers
  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === 'ios' ? true : false);
    setStartDate(currentDate);
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === 'ios' ? true : false);
    setEndDate(currentDate);
  };

  // Handle the search button press
  const handleSearch = () => {
    fetchBills();
  };

  // Handle swipe to refresh
  const onRefresh = () => {
    setIsRefreshing(true);
    fetchBills();  // Fetch bills again on refresh
    setIsRefreshing(false);
  };

  // Format the date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats the date as MM/DD/YYYY
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bill History</Text>

      {/* Search Bar with Icon */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Bill ID"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchIcon} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Date Range Pickers */}
      <View style={styles.datePickers}>
        <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>{startDate ? startDate.toLocaleDateString() : 'Start Date'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>{endDate ? endDate.toLocaleDateString() : 'End Date'}</Text>
        </TouchableOpacity>
      </View>

      {/* DateTime Picker Modals */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={onStartDateChange}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={onEndDateChange}
        />
      )}

      {/* Scrollable list of bills */}
      <ScrollView
        style={styles.billList}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {filteredBills.map((bill) => (
          <View key={bill.id} style={styles.billCard}>
            <Text style={styles.billID}>Bill ID: {bill.billId}</Text>
            <Text style={styles.billStatus}>Status: {bill.status}</Text>
            <Text style={styles.billDate}>Date: {formatDate(bill.createdAt)}</Text>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownloadBill(bill.billId)}>
                <FontAwesome name="arrow-circle-down" size={20} color="#fff" />
                <Text style={styles.buttonText}>Download Bill</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    flex: 1,
  },
  searchIcon: {
    backgroundColor: '#4e92cc',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  datePickers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateButton: {
    backgroundColor: '#4e92cc',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  billList: {
    marginBottom: 20,
  },
  billCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  billID: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  billStatus: {
    fontSize: 14,
    marginBottom: 5,
  },
  billDate: {
    fontSize: 14,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  downloadButton: {
    backgroundColor: '#4e92cc',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
});

export default BillHistoryPage;
