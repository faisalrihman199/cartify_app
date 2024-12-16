import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // For managing the refreshing state
  const navigate = useNavigation();

  // Load cart items from AsyncStorage
  const loadCartItems = async () => {
    try {
      const savedCartItems = await AsyncStorage.getItem('cart');
      console.log("Saved Cart :", savedCartItems);
      
      if (savedCartItems) {
        const parsedItems = JSON.parse(savedCartItems);
        const updatedItems = parsedItems.map(item => ({
          ...item,
          price: parseFloat(item.price),
          totalPrice: item.price * item.quantity,
        }));
        setCartItems(updatedItems); // Set the state with updated cart items
      } else {
        setCartItems([]); // Clear the cart if no items are found
      }
    } catch (error) {
      console.error('Failed to load cart items:', error);
    }
  };

  // Save cart items to AsyncStorage whenever they change
  useEffect(() => {
    const saveCartItems = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Failed to save cart items:', error);
      }
    };
    saveCartItems();
  }, [cartItems]);

  // Increase quantity of a cart item
  const handleIncreaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: item.quantity + 1,
              totalPrice: (item.quantity + 1) * item.price,
            }
          : item
      )
    );
  };

  // Decrease quantity of a cart item
  const handleDecreaseQuantity = (itemId) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === itemId && item.quantity > 1) {
          return {
            ...item,
            quantity: item.quantity - 1,
            totalPrice: (item.quantity - 1) * item.price,
          };
        }
        return item;
      });
      return updatedItems.filter((item) => item.quantity > 0);
    });
  };

  // Remove item from the cart
  const handleRemoveItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // Navigate to Billing page
  const handleProceedToBilling = () => {
    navigate.navigate('Bill');
  };

  // On refresh, reload the cart items from AsyncStorage
  const onRefresh = async () => {
    setRefreshing(true);
    await loadCartItems(); // Re-load cart items when refreshing
    setRefreshing(false);
  };

  // Calculate the total bill
  const totalBill = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      <ScrollView
        style={styles.cartTableContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {cartItems.map((item) => (
          <Swipeable
            key={item.id}
            renderRightActions={() => (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleRemoveItem(item.id)}
              >
                <MaterialIcons name="delete" size={30} color="#fff" />
              </TouchableOpacity>
            )}
          >
            <View style={styles.productCard}>
              <Text style={styles.productName}>{item.name}</Text>
              <View style={styles.productDetails}>
                <Text style={styles.productText}>Price: ${item.price.toFixed(2)}</Text>
                <Text style={styles.productText}>Quantity: {item.quantity}</Text>
                <Text style={styles.productText}>Total: ${item.totalPrice.toFixed(2)}</Text>
              </View>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => handleDecreaseQuantity(item.id)}
                  style={styles.quantityButton}
                >
                  <MaterialIcons name="remove" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleIncreaseQuantity(item.id)}
                  style={styles.quantityButton}
                >
                  <MaterialIcons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </Swipeable>
        ))}
      </ScrollView>

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Bill: ${totalBill.toFixed(2)}</Text>
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
  productCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  productDetails: {
    marginBottom: 10,
  },
  productText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityButton: {
    backgroundColor: '#4e92cc',
    padding: 10,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  proceedButton: {
    backgroundColor: '#4e92cc',
    padding: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  proceedButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default CartPage;
