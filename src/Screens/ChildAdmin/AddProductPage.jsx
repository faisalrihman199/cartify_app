import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAPI } from '../../Context/APIContext';

const AddProductPage = () => {
  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [barcode, setBarcode] = useState('');
  const { createProduct, allCategories, allBrands } = useAPI();
  const [Categories, setAllCategories] = useState([]);
  const [Brands, setAllBrands] = useState([]);

  // Fetch categories and brands when the component mounts
  useEffect(() => {
    // Fetch categories
    allCategories()
      .then(response => {
        setAllCategories(response.data.categories); // Assuming the response structure has categories
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        Alert.alert('Error', 'Failed to fetch categories.');
      });

    // Fetch brands
    allBrands()
      .then(response => {
        setAllBrands(response.data.brands); // Assuming the response structure has brands
      })
      .catch(error => {
        console.error('Error fetching brands:', error);
        Alert.alert('Error', 'Failed to fetch brands.');
      });
  }, []);

  const handleSubmit = () => {
    if (!productName || !category || !price || !stock) {
      Alert.alert('Error', 'Please fill out all required fields.');
      return;
    }

    const productData = {
      productCode,
      productName,
      categoryId:category,
      brandId:brand,
      productPrice:price,
      weight,
      description,
      stock,
      barcode,
    };
    console.log("Data is :",productData);
    
    createProduct(productData)
      .then(() => {
        Alert.alert('Success', 'Product added successfully!');
        setProductCode('');
        setProductName('');
        setCategory('');
        setBrand('');
        setPrice('');
        setWeight('');
        setDescription('');
        setStock('');
        setBarcode('');
      })
      .catch((error) => {
        console.error('Error creating product:', error);
        Alert.alert('Error', 'Failed to create product.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Product</Text>

      {/* Keyboard Avoiding View */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Scrollable Form */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Product Code */}
          <TextInput
            style={styles.input}
            placeholder="Product Code"
            value={productCode}
            onChangeText={setProductCode}
          />

          {/* Product Name */}
          <TextInput
            style={styles.input}
            placeholder="Product Name *"
            value={productName}
            onChangeText={setProductName}
          />

          {/* Category */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(value) => setCategory(value)}
              style={styles.picker}>
              <Picker.Item label="Select Category" value="" />
              {Categories && Categories.map((category) => (
                <Picker.Item
                  key={category.id}
                  label={category.name}
                  value={category.id}
                />
              ))}
            </Picker>
          </View>

          {/* Brand */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={brand}
              onValueChange={(value) => setBrand(value)}
              style={styles.picker}>
              <Picker.Item label="Select Brand" value="" />
              {Brands && Brands.map((brand) => (
                <Picker.Item
                  key={brand.id}
                  label={brand.name}
                  value={brand.id}
                />
              ))}
            </Picker>
          </View>

          {/* Price */}
          <TextInput
            style={styles.input}
            placeholder="Price *"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          {/* Weight */}
          <TextInput
            style={styles.input}
            placeholder="Weight"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />

          {/* Description */}
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          {/* Stock */}
          <TextInput
            style={styles.input}
            placeholder="Stock *"
            keyboardType="numeric"
            value={stock}
            onChangeText={setStock}
          />

          {/* Barcode */}
          <TextInput
            style={styles.input}
            placeholder="Scan Product Barcode"
            value={barcode}
            onChangeText={setBarcode}
          />
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: '#333',
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Prevents overlap with the button
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  submitButton: {
    backgroundColor: '#4e92cc',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddProductPage;
