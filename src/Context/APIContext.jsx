import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';

const APIContext = createContext();

const APIProvider = ({ children }) => {
  const server = 'http://192.168.1.21:5000/api';
  console.log("Server is :", server);
  // Function to fetch user from AsyncStorage
  const getUserFromAsyncStorage = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error retrieving user from AsyncStorage', error);
      return null;
    }
  };
  const Logout=async()=>{
    try {
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error retrieving user from AsyncStorage', error);
    }
  }

  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const storedUser = await getUserFromAsyncStorage();
      console.log("Stord Use in Async Storage is :", storedUser);
      
      setUser(storedUser);
    })();
  }, []);

  const getConfig = () => {
    const token = user?.token;
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };
  const getUser=async()=>{
    return user;
  }
  // Auth APIs
  const login = async (data) => {
    const url = `${server}/user/login`;
    try {
      const response = await axios.post(url, data);
      console.log("Login API Response:", response.data);
  
      if (response.data && response.data.data) {
        const loggedInUser = response.data.data;
        setUser(loggedInUser);
        await AsyncStorage.setItem('user', JSON.stringify(loggedInUser));
        console.log("User saved to AsyncStorage:", loggedInUser); // Debugging log
      } else {
        console.warn("User data missing in response");
      }
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Rethrow to propagate error to UI
    }
  };
  
  const sendOTP=async (data) => {
    console.log("Send OTP for :", data);
    
    const url = `${server}/user/sendOtp`;
    const response = await axios.post(url, data);
    return response.data;
  };

  

  const changePassword = async (data) => {
    const url = `${server}/user/changePassword`;
    const response = await axios.put(url, data, getConfig());
    return response.data;
  };

  

  const verifyOTP = async (data,endpoint) => {
    const url = `${server}/user/${endpoint}`;
    const response = await axios.post(url, data);
    return response.data;
  };



  // Brand
  const createBrand = async (data) => {
    const url = `${server}/brand/addBrand`;
    const response = await axios.post(url, data, getConfig());
    return response.data;
  }
  const allBrands=async()=>{
    const url = `${server}/brand/getBrands`;
    const response = await axios.get(url,getConfig());
    return response.data;
  }

  //Categories
  const createCategory = async (data) => {
    const url = `${server}/category/addCategory`;
    const response = await axios.post(url, data, getConfig());
    return response.data;
  }
  const allCategories=async()=>{
    const url = `${server}/category/getCategories`;
    const response = await axios.get(url,getConfig());
    return response.data;
  }

  //Products
  const addProduct = async (data,id) => {
    const url = `${server}/product/addProduct${id?`?productId=${id}`:''}`;
    const response = await axios.post(url, data, getConfig());
    return response.data;
  }
  const allProducts=async()=>{
    const url = `${server}/product/getProducts`;
    const response = await axios.get(url,getConfig());
    return response.data;
  }
  const oneProduct=async(code)=>{
    const url = `${server}/product/getProduct/${code}`;
    const response = await axios.get(url,getConfig());
    return response.data;
  }
  const deleteProduct=async(id)=>{
    const url = `${server}/product/deleteProduct/${id}`;
    const response = await axios.delete(url,getConfig());
    return response.data;
  }
  

  //BILLS
  const posBills=async()=>{
    const url = `${server}/company/getPosBills`;
    const response = await axios.get(url,getConfig());
    return response.data;
  }
  const paidBill=async(id)=>{
    const url = `${server}/company/updatePosBill?id=${id}`;
    const response = await axios.post(url,{},getConfig());
    return response.data;
  }
  const printBill=async(id)=>{
    const url = `${server}/billing/getBilling?billId=${id}`;
    
    const response = await axios.get(url,getConfig());
    return response.data;
  }
  const proceedBill=async (data) => {
    console.log("Log Data :", data);
    
    const url = `${server}/billing/createBilling`;
    const response = await axios.post(url, data, getConfig());
    return response.data;
  }
  const billHostory = async (startRange, endRange, billId) => {
    // Build the query parameters conditionally
    let query = '';
    
    if (startRange) query += `startRange=${startRange}&`;
    if (endRange) query += `endRange=${endRange}&`;
    if (billId) query += `billId=${billId}&`;
    
    query = query.endsWith('&') ? query.slice(0, -1) : query;
  
    const url = `${server}/customer/paymentHistory${query ? `?${query}` : ''}`;
    
    try {
      const response = await axios.get(url, getConfig());
      return response.data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  };
  


  const sendPOS=async(id)=>{
    const url = `${server}/billing/createPosBills?billId=${id}`;
    const response = await axios.post(url,{},getConfig());
    return response.data;
  }


  const showToast = (type,message) => {
    Toast.show({
      type: type, 
      text2: message,
    });
  };
  const provider = {
    //Auth
    login,getUser,Logout,changePassword,verifyOTP,sendOTP,
    
    //Brand
    createBrand,allBrands,
    //Brand
    createCategory,allCategories,

    //Products
    allProducts,addProduct,oneProduct,deleteProduct,

    //Bills
    posBills,paidBill,printBill,proceedBill,sendPOS,billHostory,
    
    server,
    showToast,
  };

  return <APIContext.Provider value={provider}>{children}</APIContext.Provider>;
};

const useAPI = () => useContext(APIContext);

export { APIProvider, useAPI };
