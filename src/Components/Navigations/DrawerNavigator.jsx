import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons,MaterialCommunityIcons } from '@expo/vector-icons'; // Ensure to install @expo/vector-icons
import Dashboard from '../../Screens/Dashboard';
import UserProfilePage from '../../Screens/UserProfilePage';
import CartPage from '../../Screens/CartPage';
import ScanProduct from '../../Screens/ScanProduct';
import BillHistory from '../../Screens/BillHistory';
import ProceedBill from '../../Screens/ProceedBill';
import CustomDrawerContent from './CustomDrawerContent';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: '#4e92cc' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center', // Ensures the title is centered
        headerTitle: () => (
          <View style={styles.headerCenter}>
            <Image
              source={require('../../assets/images/onBoard/cart.png')} // Adjust the path to your actual image
              style={styles.headerLogo}
            />
            <Text style={styles.headerTitle}>Cartify</Text>
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity
            style={styles.cartIcon}
            onPress={() => navigation.navigate('Cart')}
          >
            <MaterialCommunityIcons name="cart-variant" size={24} color="#ffffff" />
          </TouchableOpacity>
        ),
      })}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Profile" component={UserProfilePage} />
      <Drawer.Screen name="ScanProduct" component={ScanProduct} />
      <Drawer.Screen name="Cart" component={CartPage} />
      <Drawer.Screen name="Bill" component={ProceedBill} />
      <Drawer.Screen name="BillHistory" component={BillHistory} />
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
    justifyContent: 'center', // Ensures content within the header is centered
    flex: 1, // Ensures it takes up the entire available header space
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
