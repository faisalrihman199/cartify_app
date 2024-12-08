import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import Modal from 'react-native-modal'; // Import react-native-modal

const Dashboard = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  // Function to open WhatsApp chat
  const openWhatsApp = () => {
    const phoneNumber = '+923021161032'; // Replace with the actual phone number
    const message = 'Hello, I need support!'; // Predefined message
    const url = `whatsapp://send?phone=${phoneNumber}&text=${message}`;

    Linking.openURL(url).catch(err => {
      console.error('Error opening WhatsApp:', err);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Cartify</Text>

      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('ScanProduct')}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="barcode-scan" size={50} color="#fff" />
          </View>
          <Text style={styles.gridLabel}>Scan Product</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Cart')}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="cart-variant" size={50} color="#fff" />
          </View>
          <Text style={styles.gridLabel}>View Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Bill')}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="receipt-long" size={50} color="#fff" />
          </View>
          <Text style={styles.gridLabel}>Proceed to Bill</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('BillHistory')}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="history" size={50} color="#fff" />
          </View>
          <Text style={styles.gridLabel}>Bill History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Profile')}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="user-circle" size={50} color="#fff" />
          </View>
          <Text style={styles.gridLabel}>User Account</Text>
        </TouchableOpacity>

        {/* Contact Support Button */}
        <TouchableOpacity style={styles.gridItem} onPress={() => setModalVisible(true)}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="contact-support" size={50} color="#fff" />
          </View>
          <Text style={styles.gridLabel}>Contact Support</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Contact Support */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Do you want to open WhatsApp for support?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={openWhatsApp}>
              <Text style={styles.modalButtonText}>Open WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e2e8f0', // Light gray background (similar to gray-200)
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333', // Dark text color for title
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  gridItem: {
    width: '48%', // Adjust width for 2 items per row
    aspectRatio: 1, // Keep boxes square-shaped
    backgroundColor: '#fff', // White background for each card
    borderRadius: 15, // Rounded corners for a softer look
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3, // Small shadow for elevation
    shadowColor: '#000', // Shadow properties for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    backgroundColor: '#4e92cc', // App background color for the icon background
    padding: 25,
    borderRadius: 50, // Circular icon container
    marginBottom: 10,
  },
  gridLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333', // Dark color for the text
    textAlign: 'center',
  },

  // Modal Styles
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#006d77',
    padding: 10,
    borderRadius: 5,
    margin: 5,
    flex: 1,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Dashboard;
