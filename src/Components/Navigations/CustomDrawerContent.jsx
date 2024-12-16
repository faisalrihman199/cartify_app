import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'; 
import { useNavigation } from "@react-navigation/native";
import * as Linking from 'expo-linking';  // Import Linking to open WhatsApp
import { useAPI } from '../../Context/APIContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomDrawerContent = (props) => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);  // State to control modal visibility
    const {getUser}=useAPI();
    const user=getUser()?._j;
    const handleLogout=async()=>{
      await AsyncStorage.removeItem('user');
      navigation.navigate('Login');

    }

    // Function to open WhatsApp
    const openWhatsApp = () => {
        const phoneNumber = '+923021161032';  // Replace with the actual phone number
        const message = 'Hello, I need support.'; // You can customize the message
        const url = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
        
        Linking.openURL(url).catch(err => console.error('Failed to open WhatsApp:', err));
    };

    return (
        <LinearGradient colors={["#4e92cc", "#006d77"]} style={styles.container}>
            {/* User Info */}
            <View style={styles.userInfo}>
                <Image
                    source={{ uri: 'https://randomuser.me/api/portraits/men/9.jpg' }}
                    style={styles.profilePic}
                />
                <Text style={styles.userName}>{user?.name}</Text>
            </View>

            {/* Menu Items */}
            <TouchableOpacity
                style={styles.drawerItemContainer}
                onPress={() => props.navigation.navigate('Dashboard')}
            >
                <Ionicons name="home-outline" size={20} color="#ffffff" style={styles.icon} />
                <Text style={styles.drawerItem}>Dashboard</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            {/* New Menu Items */}
            <TouchableOpacity
                style={styles.drawerItemContainer}
                onPress={() => props.navigation.navigate('ScanProduct')}
            >
                <MaterialCommunityIcons name="barcode-scan" size={20} color="#ffffff" style={styles.icon} />
                <Text style={styles.drawerItem}>Scan Product</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
                style={styles.drawerItemContainer}
                onPress={() => props.navigation.navigate('Cart')}
            >
                <MaterialCommunityIcons name="cart-variant" size={20} color="#ffffff" style={styles.icon} />
                <Text style={styles.drawerItem}>View Cart</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
                style={styles.drawerItemContainer}
                onPress={() => props.navigation.navigate('Bill')}
            >
                <MaterialIcons name="receipt-long" size={20} color="#ffffff" style={styles.icon} />
                <Text style={styles.drawerItem}>Proceed to Bill</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
                style={styles.drawerItemContainer}
                onPress={() => props.navigation.navigate('BillHistory')}
            >
                <MaterialCommunityIcons name="history" size={20} color="#ffffff" style={styles.icon} />
                <Text style={styles.drawerItem}>Bill History</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            {/* Contact Support Button */}
            <TouchableOpacity
                style={styles.drawerItemContainer}
                onPress={() => setModalVisible(true)}  // Show modal on click
            >
                <MaterialIcons name="contact-support" size={20} color="#ffffff" style={styles.icon} />
                <Text style={styles.drawerItem}>Contact Support</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
                style={styles.drawerItemContainer}
                onPress={() => props.navigation.navigate('Profile')}
            >
                <FontAwesome5 name="user-circle" size={20} color="#ffffff" style={styles.icon} />
                <Text style={styles.drawerItem}>User Account</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            {/* Logout Button */}
            <View style={styles.bottomSection}>
                <TouchableOpacity
                    style={styles.drawerItemContainer}
                    onPress={async() => {
                      await AsyncStorage.removeItem('user');
                      navigation.navigate('Login');
                    }}
                >
                    <MaterialIcons name="logout" size={20} color="#ffffff" style={styles.icon} />
                    <Text style={styles.drawerItem}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* Modal for WhatsApp Confirmation */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Do you want to contact support via WhatsApp?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={openWhatsApp} // Open WhatsApp when confirmed
                            >
                                <Text style={styles.modalButtonText}>WhatsApp</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setModalVisible(false)} // Close modal when cancelled
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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

  // Modal styles
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent background
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#006d77',
    padding: 10,
    borderRadius: 5,
    width: 120,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CustomDrawerContent;
