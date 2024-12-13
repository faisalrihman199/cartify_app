import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAPI } from '../../Context/APIContext';

const ProductPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { allProducts } = useAPI(''); // Make sure `useAPI` is fetching products from your API context
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Call your API to get products data
        const response = await allProducts();  // Assuming `allProducts` fetches the data
        if (response.success) {
          console.log("Response :", response);

          setProducts(response.data.products);
          setFilteredProducts(response.data.products);  // Initially show all products
        } else {
          Alert.alert('Error', 'Failed to fetch products');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch products');
      }
    };

    fetchProducts();
  }, []); // Empty dependency array to run only once on mount

  // Filter products based on search query
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = products.filter((product) =>
      product.productName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const navigation = useNavigation();

  const handleAddProduct = () => {
    navigation.navigate("AddProduct");
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products by name"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Product Table */}
      <ScrollView style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Product Name</Text>
          <Text style={styles.tableHeaderCell}>Price</Text>
          <Text style={styles.tableHeaderCell}>Category</Text>
          <Text style={styles.tableHeaderCell}>Stock</Text>
        </View>
        {filteredProducts.map((product, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{product.productName}</Text>
            <Text style={styles.tableCell}>${product.productPrice}</Text>
            <Text style={styles.tableCell}>{product.categoryId}</Text> {/* You may want to replace with category name */}
            <Text style={styles.tableCell}>{product.stock}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Add Product Button */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Text style={styles.addButtonText}>Add New Product</Text> {/* Ensure text is inside <Text> */}
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchInput: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  tableContainer: {
    flex: 1,
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4e92cc',
    padding: 10,
    borderRadius: 8,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  addButtonContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#4e92cc',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});

export default ProductPage;
