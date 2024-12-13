import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';
import { useAPI } from '../../Context/APIContext';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [change, setChange] = useState(false);

  const { allCategories, createCategory } = useAPI();

  const fetchCategories = () => {
    setLoading(true);
    allCategories({ page, searchQuery })
      .then((res) => {
        if (res.success) {
          setCategories(res.data.categories);
          setTotalPages(res.data.totalPages);
          // After fetching, also filter the categories based on search query
          filterCategories(res.data.categories, searchQuery);
        } else {
          Alert.alert('Error', res.message || 'Failed to fetch categories.');
        }
      })
      .catch((err) => {
        Alert.alert('Error', 'Failed to fetch categories. Please try again.');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Filtering function that checks if the query matches category name
  const filterCategories = (categoriesData, query) => {
    if (!query.trim()) {
      setFilteredCategories(categoriesData);  // If search query is empty, show all
    } else {
      const filtered = categoriesData.filter((category) =>
        category.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, searchQuery, change]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    setPage(1); // Reset to first page when searching
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') {
      Alert.alert('Error', 'Category name cannot be empty.');
      return;
    }

    setLoading(true);
    createCategory({ name: newCategoryName })
      .then((res) => {
        if (res.success) {
          Alert.alert('Success', `Category '${newCategoryName}' added successfully.`);
          setNewCategoryName('');
          setIsModalVisible(false);
          setChange(!change)
          setPage(1); // Refresh the first page after adding a category
        } else {
          Alert.alert('Error', res.message || 'Failed to add category.');
        }
      })
      .catch((err) => {
        Alert.alert('Error', 'Failed to add category. Please try again.');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePagination = (direction) => {
    if (direction === 'next' && page < totalPages) {
      setPage(page + 1);
    } else if (direction === 'prev' && page > 1) {
      setPage(page - 1);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.categoryItem}>
      <Text style={styles.categoryText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />

      <TextInput
        style={styles.searchInput}
        placeholder="Search Categories"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredCategories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.paginationContainer}>
        <TouchableOpacity onPress={() => handlePagination('prev')} disabled={page === 1}>
          <Ionicons name="arrow-back" size={24} color={page === 1 ? '#ccc' : '#006d77'} />
        </TouchableOpacity>
        <Text style={styles.pageNumber}>Page {page} of {totalPages}</Text>
        <TouchableOpacity onPress={() => handlePagination('next')} disabled={page === totalPages}>
          <Ionicons name="arrow-forward" size={24} color={page === totalPages ? '#ccc' : '#006d77'} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addCategoryButton} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.addCategoryButtonText}>Add New Category</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={{ fontSize: 18, fontWeight: '700', margin: 10 }}>Add New Category</Text>

            <TextInput
              style={styles.addCategoryInput}
              placeholder="Enter category name"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: '#ffffff',
  },
  listContainer: {
    flexGrow: 1,
    marginBottom: 20,
  },
  categoryItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  categoryText: {
    fontSize: 18,
    color: '#333',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  pageNumber: {
    fontSize: 16,
    color: '#333',
  },
  addCategoryButton: {
    backgroundColor: '#4e92cc',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  addCategoryButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  addCategoryInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    width: '100%',
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  addButton: {
    backgroundColor: '#4e92cc',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 1,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
  spinnerTextStyle: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default CategoriesPage;
