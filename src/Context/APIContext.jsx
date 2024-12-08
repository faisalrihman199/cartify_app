import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';

const APIContext = createContext();

const APIProvider = ({ children }) => {
  const server = 'http://192.168.1.19:3000';
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
    const url = `${server}/auth/login`;
    const response = await axios.post(url, data);
    if(response.data && response.data.user){
      const loggedInUser = response.data.user;
      setUser(loggedInUser);
      await AsyncStorage.setItem('user', JSON.stringify(loggedInUser));
    }
    return response.data;
  };
  const forgot = async (data) => {
    const url = `${server}/otp/send`;
    const response = await axios.post(url, data);
    return response.data;
  };

  const changePassword = async (data) => {
    const url = `${server}/user/changePassword`;
    const response = await axios.put(url, data, getConfig());
    return response.data;
  };

  

  const reset = async (data) => {
    const url = `${server}/user/resetPassword`;
    const response = await axios.patch(url, data);
    return response.data;
  };

  const DashboardData = async () => {
    const url = `${server}/user/data`;
    const response = await axios.get(url, getConfig());
    return response.data;
  };

  // Mufti APIs
  const fetchMuftiNames = async () => {
    const url = `${server}/mufti/getnames`;
    const response = await axios.get(url);
    return response.data.data;
  };

  const pendingMuftis = async () => {
    const url = `${server}/mufti/pendings`;
    const response = await axios.get(url, getConfig());
    return response.data;
  };

  const approvedMuftis = async () => {
    const url = `${server}/mufti/all`;
    const response = await axios.get(url, getConfig());
    return response.data;
  };

  // Nikkah APIs
  const fetchNikkahs = async (data) => {
    const url = `${server}/nikkah/person`;
    const response = await axios.post(url, data);
    return response.data.data;
  };

  const addNikkah = async (data) => {
    const url = `${server}/nikkah/add`;
    const response = await axios.post(url, data, getConfig());
    return response.data.data;
  };

  const nikkah_person = async () => {
    const url = `${server}/nikkah/nikkah_person`;
    const response = await axios.get(url, getConfig());
    return response.data;
  };

  // Registrar APIs
  const addRegistrar = async (data) => {
    const url = `${server}/registrar/add`;
    const response = await axios.post(url, data);
    return response.data;
  };
  const muftiRegister = async (data) => {
    const url = `${server}/mufti/add`;
    const response = await axios.post(url, data);
    return response.data;
  };

  const pendingRegistrars = async () => {
    const url = `${server}/registrar/pending_registrars/`;
    const response = await axios.get(url, getConfig());
    return response.data;
  };

  const changeStatus = async (id, status, action) => {
    const term = action === 'mufti' ? 'mufti' : 'registrar';
    const url = `${server}/${term}/change_status/${id}/${status}`;
    
    const response = await axios.put(url, {}, getConfig());
    return response.data;
  };
  const changeMaritalStatus = async (data) => {
    try {
        console.log("Data in context:", data);
        const url = `${server}/nikkah/update_status`;
        const response = await axios.post(url, data, getConfig());
        return response.data;
    } catch (error) {
        console.error("Error in API call:", error);
        throw error; // Or handle as needed
    }
};


  const CheckMaritalStatus=async()=>{
    const url = `${server}/nikkah/marriage_status`;
    const response=await axios.get(url, getConfig());
    return response.data
}

  const adminAllRegistrars = async () => {
    const url = `${server}/registrar/all`;
    const response = await axios.get(url, getConfig());
    return response.data;
  };

  const approvedRegistrar = async () => {
    const url = `${server}/registrar/mufti_registrar`;
    const response = await axios.get(url, getConfig());
    return response.data;
  };

  // Bride APIs
  const addBride = async (data) => {
    const url = `${server}/bride/add`;
    const response = await axios.post(url, data);
    return response.data;
  };

  const oneBride = async (id) => {
    const url = `${server}/bride/oneBride/${id}`;
    const response = await axios.get(url, getConfig());
    return response.data;
  };

  const fetchBrideNames = async () => {
    const url = `${server}/bride/names`;
    const response = await axios.get(url);
    return response.data.data;
  };

  // Groom APIs
  const addGroom = async (data) => {
    const url = `${server}/groom/add`;
    const response = await axios.post(url, data);
    return response.data;
  };

  const oneGroom = async (id) => {
    const url = `${server}/groom/oneGroom/${id}`;
    const response = await axios.get(url, getConfig());
    return response.data;
  };

  const fetchGroomNames = async () => {
    const url = `${server}/groom/names`;
    const response = await axios.get(url);
    return response.data.data;
  };

  // Solicitor APIs
  const fetchSolicitorNames = async () => {
    const url = `${server}/solicitor/names`;
    const response = await axios.get(url);
    return response.data.data;
  };

  const addSolicitor = async (data) => {
    const url = `${server}/solicitor/add`;
    const response = await axios.post(url, data);
    return response.data.data;
  };

  // Witness APIs
  const fetchWitnessNames = async () => {
    const url = `${server}/witness/names`;
    const response = await axios.get(url);
    return response.data.data;
  };

  const addWitness = async (data) => {
    const url = `${server}/witness/add`;
    const response = await axios.post(url, data);
    return response.data.data;
  };
  
  const showToast = (type,message) => {
    Toast.show({
      type: type,
      
      text2: message,
    });
  };

  const provider = {
    login,
    getUser,
    Logout,
    changePassword,
    forgot,
    reset,
    muftiRegister,
    DashboardData,
    fetchMuftiNames,
    pendingMuftis,
    approvedMuftis,
    fetchNikkahs,
    addNikkah,
    nikkah_person,
    addRegistrar,
    pendingRegistrars,
    changeStatus,
    adminAllRegistrars,
    approvedRegistrar,
    addBride,
    changeMaritalStatus,
    oneBride,
    fetchBrideNames,
    addGroom,
    oneGroom,
    fetchGroomNames,
    fetchSolicitorNames,
    addSolicitor,
    fetchWitnessNames,
    addWitness,
    showToast,
    CheckMaritalStatus
  };

  return <APIContext.Provider value={provider}>{children}</APIContext.Provider>;
};

const useAPI = () => useContext(APIContext);

export { APIProvider, useAPI };
