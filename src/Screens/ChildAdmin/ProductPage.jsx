import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons
import { useAPI } from '../../Context/APIContext';

const ProductPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { allProducts, deleteProduct } = useAPI(''); // Assuming `deleteProduct` is available
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await allProducts();
      if (response.success) {
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      } else {
        Alert.alert('Error', 'Failed to fetch products');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = products.filter((product) =>
      product.productName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const handleEditProduct = (product) => {
    // Navigate to edit product screen, passing the product details
    navigation.navigate('AddProduct', { product });
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await deleteProduct(productId); 
      
      if (response.success) {
        Alert.alert('Success', 'Product deleted successfully');
        fetchProducts();

      } else {
        Alert.alert('Error', 'Failed to delete product');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete product');
    }
  };

  const navigation = useNavigation();

  const handleAddProduct = () => {
    navigation.navigate('AddProduct');
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
      <ScrollView
        style={styles.tableContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Product Name</Text>
          <Text style={styles.tableHeaderCell}>Price</Text>
          <Text style={styles.tableHeaderCell}>Category</Text>
          <Text style={styles.tableHeaderCell}>Stock</Text>
          <Text style={styles.tableHeaderCell}>Actions</Text>
        </View>
        {filteredProducts.map((product, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{product.productName}</Text>
            <Text style={styles.tableCell}>${product.productPrice}</Text>
            <Text style={styles.tableCell}>{product?.category?.name}</Text>
            <Text style={styles.tableCell}>{product.stock}</Text>
            <View style={styles.actionIcons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleEditProduct(product)}
              >
                <Icon name="edit" size={24} color="#4e92cc" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleDeleteProduct(product.id)}
              >
                <Icon name="delete" size={24} color="#cc4e4e" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Product Button */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Text style={styles.addButtonText}>Add New Product</Text>
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
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flex: 1,
  },
  iconButton: {
    padding: 5,
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
