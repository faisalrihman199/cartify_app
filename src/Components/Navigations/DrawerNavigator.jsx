import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Dashboard from '../../Screens/Dashboard';
import UserProfilePage from '../../Screens/UserProfilePage';
import CartPage from '../../Screens/CartPage';
import ScanProduct from '../../Screens/ScanProduct';
import BillHistory from '../../Screens/BillHistory';
import ProceedBill from '../../Screens/ProceedBill';
import CustomDrawerContent from './CustomDrawerContent';
import AdminDrawer from './AdminDrawer';
import AdminDashboard from '../../Screens/AdminDashboard';
import CategoriesPage from '../../Screens/ChildAdmin/CategoriesPage';
import ProductPage from '../../Screens/ChildAdmin/ProductPage';
import Brands from '../../Screens/ChildAdmin/BrandsPage';
import POSBill from '../../Screens/ChildAdmin/POSBill';
import AddProductPage from '../../Screens/ChildAdmin/AddProductPage';
import PaymentScreen from '../../Screens/PaymentScreen';

import { StripeProvider } from '@stripe/stripe-react-native';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const [user, setUser] = useState(null);

  // Function to get user from AsyncStorage
  const getUserFromAsyncStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error retrieving user from AsyncStorage:", error);
      return null;
    }
  };

  // Fetch user on component mount
  useEffect(() => {
    (async () => {
      const storedUser = await getUserFromAsyncStorage();
      console.log("Stored User:", storedUser);
      setUser(storedUser);
    })();
  }, []);

  // Dynamic drawer content and initial route
  const isAdmin = user?.role === 'admin';
  const initialRoute = isAdmin ? 'AdminDashboard' : 'Dashboard';
  function PaymentScreenWrapper() {
    return (
      <StripeProvider publishableKey="pk_test_51PkvQAJnCuHDmbHeWHW7KiCwby2II1wzS8LLXfGK0LEHtjyC55ytBUJXaxPsyB4Hmv9I0hUA2xw9ahjOqrKjaMew001f4u75D0" >
        <PaymentScreen />
      </StripeProvider>
    );
  }
  return (
    <Drawer.Navigator
      initialRouteName={initialRoute}
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: '#4e92cc' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center',
        headerTitle: () => (
          <View style={styles.headerCenter}>
            
            <Image
              source={require('../../assets/images/onBoard/cart.png')}
              style={styles.headerLogo}
            />
            <Text style={styles.headerTitle}>Cartify</Text>
          </View>
        ),
        headerRight: () => (
          !isAdmin && (
            <TouchableOpacity
              style={styles.cartIcon}
              onPress={() => navigation.navigate('Cart')}
            >
              <MaterialCommunityIcons name="cart-variant" size={24} color="#ffffff" />
            </TouchableOpacity>
          )
        ),
      })}
      drawerContent={(props) =>
        isAdmin ? <AdminDrawer {...props} /> : <CustomDrawerContent {...props} />
      }
    >
      {isAdmin ? (
        <>
          <Drawer.Screen name="AdminDashboard" component={AdminDashboard} />
          <Drawer.Screen name="Categories" component={CategoriesPage} />
          <Drawer.Screen name="Brands" component={Brands} />
          <Drawer.Screen name="POSBills" component={POSBill} />
          <Drawer.Screen name="Products" component={ProductPage} />
          <Drawer.Screen name="AddProduct" component={AddProductPage} />
          <Drawer.Screen name="BillHistory" component={BillHistory} />
        </>
      ) : (
        <>
          <Drawer.Screen name="Dashboard" component={Dashboard} />
          <Drawer.Screen name="Profile" component={UserProfilePage} />
          <Drawer.Screen name="ScanProduct" component={ScanProduct} />
          <Drawer.Screen name="Cart" component={CartPage} />
          <Drawer.Screen name="Bill" component={ProceedBill} />
          <Drawer.Screen name="BillHistory" component={BillHistory} />
          <Drawer.Screen name="PaymentScreen" component={PaymentScreenWrapper} />
        </>
      )}
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  cartIcon: {
    marginRight: 15,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  headerLogo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default DrawerNavigator;
