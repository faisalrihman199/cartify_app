import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Platform, RefreshControl } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useAPI } from '../Context/APIContext';

const BillHistoryPage = () => {
  // Sample bills data
  const [bills, setBills] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);  // for swipe refresh control
  const { billHostory } = useAPI();

  // Fetch bills when the page mounts
  const fetchBills = () => {
    billHostory(startDate, endDate, searchText)
      .then((res) => {
        console.log("Bills fetched:", res);
        // Extract posBills from response and update state
        setBills(res.data.posBills);  // Assuming the response structure contains 'data.posBills'
      })
      .catch((err) => {
        console.log("Error fetching bills:", err);
      });
  };

  useEffect(() => {
    fetchBills();
  }, []); // Empty array means this runs once when the component mounts

  // Filter bills based on Bill ID and Date Range
  const filteredBills = bills.filter((bill) => {
    const billDate = new Date(bill.createdAt);
    return (
      bill.billId.toLowerCase().includes(searchText.toLowerCase()) &&
      (startDate ? billDate >= startDate : true) &&
      (endDate ? billDate <= endDate : true)
    );
  });

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
