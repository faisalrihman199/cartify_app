import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const AdminDashboard = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Categories')}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="shape-outline" size={50} color="#fff" />
          </View>
          <Text style={styles.gridLabel}>Categories</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Brands')}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="factory" size={50} color="#fff" />
          </View>
          <Text style={styles.gridLabel}>Brands</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('POSBills')}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="receipt-long" size={50} color="#fff" />
          </View>
          <Text style={styles.gridLabel}>POS Bills</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('AllBills')}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="file-document" size={50} color="#fff" />
          </View>
          <Text style={styles.gridLabel}>All Bills</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Products')}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="store" size={50} color="#fff" />
          </View>
          <Text style={styles.gridLabel}>Products</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e2e8f0', // Light gray background
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333', // Dark text color
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
    borderRadius: 15, // Rounded corners
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
});

export default AdminDashboard;
