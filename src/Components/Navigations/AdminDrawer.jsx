import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'; 
import { useNavigation } from "@react-navigation/native";

const AdminDrawer = (props) => {
    const navigation = useNavigation();

    

    return (
        <LinearGradient colors={["#4e92cc", "#006d77"]} style={styles.container}>
            {/* User Info */}
            <View style={styles.userInfo}>
                <Image
                    source={{ uri: 'https://randomuser.me/api/portraits/men/9.jpg' }}
                    style={styles.profilePic}
                />
                <Text style={styles.userName}>Admin</Text>
            </View>

            {/* Menu Items */}
            <TouchableOpacity
                style={styles.drawerItemContainer}
                onPress={() => props.navigation.navigate('Categories')}
            >
                <Ionicons name="list-outline" size={20} color="#ffffff" style={styles.icon} />
                <Text style={styles.drawerItem}>Categories</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
                style={styles.drawerItemContainer}
                onPress={() => props.navigation.navigate('Brands')}
            >
                <MaterialIcons name="warehouse" size={20} color="#ffffff" style={styles.icon} />
                <Text style={styles.drawerItem}>Brands</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
                style={styles.drawerItemContainer}
                onPress={() => props.navigation.navigate('POSBills')}
            >
                <MaterialIcons name="receipt-long" size={20} color="#ffffff" style={styles.icon} />
                <Text style={styles.drawerItem}>POS Bills</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
                style={styles.drawerItemContainer}
                onPress={() => props.navigation.navigate('BillHistory')}
            >
                <MaterialCommunityIcons name="file-document" size={20} color="#ffffff" style={styles.icon} />
                <Text style={styles.drawerItem}>All Bills</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
                style={styles.drawerItemContainer}
                onPress={() => props.navigation.navigate('Products')}
            >
                <MaterialCommunityIcons name="cube" size={20} color="#ffffff" style={styles.icon} />
                <Text style={styles.drawerItem}>Products</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity
                style={styles.drawerItemContainer}
                onPress={() => props.navigation.navigate('AddProduct')}
            >
                <MaterialCommunityIcons name="cube" size={20} color="#ffffff" style={styles.icon} />
                <Text style={styles.drawerItem}> Add Product</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            {/* Logout Button */}
            <View style={styles.bottomSection}>
                <TouchableOpacity
                    style={styles.drawerItemContainer}
                    onPress={() => navigation.navigate("Login")}
                >
                    <MaterialIcons name="logout" size={20} color="#ffffff" style={styles.icon} />
                    <Text style={styles.drawerItem}>Logout</Text>
                </TouchableOpacity>
            </View>

        </LinearGradient>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
  },
  drawerItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  drawerItem: {
    fontSize: 18,
    fontWeight: '500',
    color: '#ffffff',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ffffff',
    marginVertical: 10,
  },
  bottomSection: {
    marginTop: 'auto',
    marginBottom: 30,
  },
});

export default AdminDrawer;
