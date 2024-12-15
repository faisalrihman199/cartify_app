import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAPI } from '../Context/APIContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const ProceedBillPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [billID, setBillID] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalBilling, setTotalBilling] = useState(0);
  const [isCartEmpty, setIsCartEmpty] = useState(true); // State to track if cart is empty
  const [billData,setBillData]=useState(null);
  const { proceedBill, sendPOS } = useAPI();
  const navigate = useNavigation();

  const fetchCartData = async () => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      const cart = cartData ? JSON.parse(cartData) : [];
      
      if (cart.length === 0) {
        setIsCartEmpty(true); // Set to true if cart is empty
        return; // Early return if the cart is empty
      }
      
      setCartItems(cart);
      setIsCartEmpty(false); // Set to false if cart is not empty

      const name = await AsyncStorage.getItem('customerName');
      const bill = await AsyncStorage.getItem('billID');

      setCustomerName(name || 'John Doe');
      setBillID(bill || 'BILL123456');

      const refinedData = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      proceedBill({ productData: refinedData })
        .then((res) => {
          console.log("Response :", res);
          if (res.success) {
            setBillData(res.data);
            setBillID(res.data.billId);
            setCustomerName(res.data.customerName);
            setTotalBilling(res.data.totalBilling);
            setTotalWeight(res.data.totalWeight);
          }
        })
        .catch((err) => {
          console.log("Error :", err);
          Alert.alert(err.response?.data?.message || "An error occurred");
        });
    } catch (error) {
      console.error('Error fetching data from AsyncStorage:', error);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchCartData();
    setIsRefreshing(false);
  };

  const totalBill = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleDownloadBill = () => {
    console.log('Downloading bill as PDF...');
  };

  const handleSendToPOS = () => {
    if (billID) {
      sendPOS(billID)
        .then(async (res) => {
          console.log("Response :", res);
          if (res.success) {
            await AsyncStorage.removeItem('cart');
            Alert.alert(res.message);
          } else {
            Alert.alert(res.message);
          }
        })
        .catch((err) => {
          console.log("Error :", err);
          Alert.alert(err.response?.data?.message || "An error occurred");
        });
    }
  };

  const handlePayOnline = () => {
    console.log('Processing online payment...');
    if(billID){
      navigate.navigate('PaymentScreen',{state:billData});
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchCartData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollableContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {!isCartEmpty && (
          <View style={styles.receiptContainer}>
            <Text style={styles.storeName}>Cartify</Text>
            <Text style={styles.billID}>Bill ID: {billID}</Text>
            <Text style={styles.customerName}>Customer: {customerName}</Text>

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

            <Text style={styles.totalText}>Total Price: ${totalBill}</Text>
            <Text style={styles.totalText}>Total Weight: {totalWeight} grams</Text>
          </View>
        )}

        {isCartEmpty && (
          <Text style={styles.emptyCartText}>Your cart is empty. Please add items to proceed.</Text>
        )}
      </ScrollView>

      <View style={styles.downloadButtonContainer}>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownloadBill}
          disabled={isCartEmpty} // Disable button if cart is empty
        >
          <Text style={styles.downloadButtonText}>Download Bill as PDF</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSendToPOS}
          disabled={isCartEmpty} // Disable button if cart is empty
        >
          <Text style={styles.actionButtonText}>Send to POS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handlePayOnline}
          disabled={isCartEmpty} // Disable button if cart is empty
        >
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
    justifyContent: 'space-between',
  },
  scrollableContent: {
    flexGrow: 1,
  },
  receiptContainer: {
    backgroundColor: '#fff',
    padding: 20,
    margin: '5%',
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
  emptyCartText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  downloadButtonContainer: {
    alignItems: 'center',
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
    marginBottom: 20,
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
