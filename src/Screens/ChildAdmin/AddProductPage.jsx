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
  RefreshControl,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAPI } from '../../Context/APIContext';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/FontAwesome';
import Scanning from '../../Components/Scanning/Scanning';
import { useRoute } from '@react-navigation/native';

const AddProductPage = () => {
  const route = useRoute();
  const { product } = route.params || {};
  console.log("Product :", product);

  const { addProduct, allCategories, allBrands } = useAPI();
  const [Categories, setAllCategories] = useState([]);
  const [Brands, setAllBrands] = useState([]);
  const [barcode, setBarcode] = useState(product?.productCode || null);
  const [scanning, setScanning] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Populate form fields if a product is passed
  useEffect(() => {
      setBarcode(product?.productCode);
      setValue('productName', product?.productName || '');
      setValue('categoryId', product?.categoryId || '');
      setValue('brandId', product?.brandId || '');
      setValue('productPrice', product?.productPrice?.toString() || '');
      setValue('stock', product?.stock?.toString() || '');
      setValue('weight', product?.weight?.toString() || '');
      setValue('description', product?.description || '');
    
    
  }, [product, setValue]);

  // Fetch categories and brands on mount
  useEffect(() => {
    allCategories()
      .then(response => setAllCategories(response.data.categories || []))
      .catch(() => Alert.alert('Error', 'Failed to fetch categories.'));

    allBrands()
      .then(response => setAllBrands(response.data.brands || []))
      .catch(() => Alert.alert('Error', 'Failed to fetch brands.'));
  }, []);

  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate an API call or re-fetch data
    allCategories()
      .then(response => setAllCategories(response.data.categories || []))
      .catch(() => Alert.alert('Error', 'Failed to fetch categories.'));
    
    allBrands()
      .then(response => setAllBrands(response.data.brands || []))
      .catch(() => Alert.alert('Error', 'Failed to fetch brands.'));
    
    // End refresh after data is fetched
    setRefreshing(false);
  };

  // Handle form submission
  const onSubmit = data => {
    if (!barcode) {
      Alert.alert('Error', 'Barcode cannot be empty');
      return;
    }
    data.productCode = barcode;

    addProduct(data, product?.id)
      .then(response => {
        if (response.success) {
          Alert.alert('Success', response.message);
          reset();
          setBarcode(null);
        } else {
          Alert.alert('Error', 'Failed to add product.');
        }
      })
      .catch(error => {
        console.error('Error creating product:', error);
        Alert.alert('Error', error.response?.data?.message || 'Failed to create product.');
      });
  };

  return scanning ? (
    <Scanning setScanning={setScanning} setBarcode={setBarcode} />
  ) : (
    <View style={styles.container}>
      <Text style={styles.header}>{product ? 'Update Product' : 'Add New Product'}</Text>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          
          {/* Product Code */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, barcode ? {} : styles.errorBorder]}
              placeholder="Product Code"
              value={barcode}
              editable={false}
            />
            {!product && (
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => setScanning(true)}>
                <Icon name="barcode" size={24} color="#333" />
              </TouchableOpacity>
            )}
          </View>

          {/* Product Name */}
          <Text style={styles.label}>Product Name</Text>
          <Controller
            control={control}
            name="productName"
            rules={{ required: 'Product Name is required' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Product Name *"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.productName && (
            <Text style={styles.errorText}>{errors.productName.message}</Text>
          )}

          {/* Category */}
          <Text style={styles.label}>Category</Text>
          <Controller
            control={control}
            name="categoryId"
            rules={{ required: 'Category is required' }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={styles.picker}>
                  <Picker.Item label="Select Category" value="" />
                  {Categories.map(category => (
                    <Picker.Item
                      key={category.id}
                      label={category.name}
                      value={category.id}
                    />
                  ))}
                </Picker>
              </View>
            )}
          />
          {errors.categoryId && (
            <Text style={styles.errorText}>{errors.categoryId.message}</Text>
          )}

          {/* Brand */}
          <Text style={styles.label}>Brand</Text>
          <Controller
            control={control}
            name="brandId"
            render={({ field: { onChange, value } }) => (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={styles.picker}>
                  <Picker.Item label="Select Brand" value="" />
                  {Brands.map(brand => (
                    <Picker.Item key={brand.id} label={brand.name} value={brand.id} />
                  ))}
                </Picker>
              </View>
            )}
          />

          {/* Price */}
          <Text style={styles.label}>Price</Text>
          <Controller
            control={control}
            name="productPrice"
            rules={{ required: 'Price is required' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Price *"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.productPrice && (
            <Text style={styles.errorText}>{errors.productPrice.message}</Text>
          )}

          {/* Stock */}
          <Text style={styles.label}>Stock</Text>
          <Controller
            control={control}
            name="stock"
            rules={{ required: 'Stock is required' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Stock *"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.stock && <Text style={styles.errorText}>{errors.stock.message}</Text>}

          {/* Weight */}
          <Text style={styles.label}>Weight</Text>
          <Controller
            control={control}
            name="weight"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Weight"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.textArea}
                placeholder="Description"
                multiline
                numberOfLines={7}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.submitButtonText}>{product ? 'Update' : 'Add'} Product</Text>
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
    flex: 1,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    height: 50, // Ensure consistent height across input fields
    textAlignVertical: 'center', // Align text vertically in the center
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    paddingLeft: 10,
  },
  textArea: {
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
    height: 100,
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#4e92cc',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    margin:5
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default AddProductPage;
