import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons,FontAwesome } from '@expo/vector-icons';

const BillHistoryPage = () => {
  // Sample bills data
  const [bills, setBills] = useState([
    { billID: 'BILL123456', date: '2024-12-9', totalAmount: 50.00 },
    { billID: 'BILL123457', date: '2024-12-02', totalAmount: 75.00 },
    { billID: 'BILL123458', date: '2024-12-03', totalAmount: 100.00 },
  ]);

  const [searchText, setSearchText] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Filter bills based on Bill ID and Date Range
  const filteredBills = bills.filter(bill => {
    const billDate = new Date(bill.date);
    return (
      bill.billID.toLowerCase().includes(searchText.toLowerCase()) &&
      billDate >= startDate && billDate <= endDate
    );
  });

  const handleViewBill = (billID) => {
    console.log(`Viewing details for Bill ID: ${billID}`);
  };

  const handleDownloadBill = (billID) => {
    console.log(`Downloading Bill ID: ${billID}`);
  };

  // Handling Date Picker Change
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bill History</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by Bill ID"
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Date Range Pickers */}
      <View style={styles.datePickers}>
        <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>Start Date: {startDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>End Date: {endDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
      </View>

      {/* DateTime Picker Modals */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={onStartDateChange}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={onEndDateChange}
        />
      )}

      {/* Scrollable list of bills */}
      <ScrollView style={styles.billList}>
        {filteredBills.map((bill, index) => (
          <View key={index} style={styles.billCard}>
            <Text style={styles.billID}>Bill ID: {bill.billID}</Text>
            <Text style={styles.billDate}>Date: {bill.date}</Text>
            <Text style={styles.billAmount}>Total Amount: ${bill.totalAmount.toFixed(2)}</Text>

            <View style={styles.buttonsContainer}>
              
              <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownloadBill(bill.billID)}>
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
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
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
  billDate: {
    fontSize: 14,
    marginBottom: 5,
  },
  billAmount: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
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
