import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAPI } from "../Context/APIContext";
import Toast from "react-native-toast-message";
import Spinner from "react-native-loading-spinner-overlay"; // Import the spinner

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cnic, setCnic] = useState("");
  const [phoneNo, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false); // State to manage the spinner visibility
  
  const navigation = useNavigation();
  const { sendOTP, showToast } = useAPI();

  const handleRegister = () => {
    if (
      name === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === "" ||
      cnic === "" ||
      phoneNo === "" ||
      address === ""
    ) {
      Alert.alert("Error", "Please fill in all fields!");
    } else if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
    } else {
      const data = { name,email, password, cnic, phoneNo, address };
      console.log("Send OTP at :", email);
      
      setLoading(true); // Show the spinner while sending OTP

      sendOTP({ email })
        .then((res) => {
          setLoading(false); // Hide the spinner once OTP is sent
          if (res.success) {
            showToast("success", res.message);
            navigation.navigate("Otp", { state: data });
          }
        })
        .catch((err) => {
          setLoading(false); // Hide the spinner if there's an error
          showToast("error", "Failed to Send OTP");
          console.log("Error :", err);
        });
    }
  };

  return (
    <LinearGradient colors={["#4e92cc", "#006d77"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.card} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.title}>Sign Up</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Feather name="user" size={20} color="#777" />
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#777"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#777" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#777"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#777" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#777"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#777"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#777" />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#777"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#777"
            />
          </TouchableOpacity>
        </View>

        {/* CNIC Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="id-card-outline" size={20} color="#777" />
          <TextInput
            style={styles.input}
            placeholder="CNIC"
            placeholderTextColor="#777"
            value={cnic}
            onChangeText={setCnic}
          />
        </View>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#777" />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            placeholderTextColor="#777"
            value={phoneNo}
            onChangeText={setPhone}
          />
        </View>

        {/* Address Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#777" />
          <TextInput
            style={styles.input}
            placeholder="Address"
            placeholderTextColor="#777"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* Register Button */}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        {/* Already have an account Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginButton}> Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Spinner Overlay */}
      <Spinner visible={loading} textContent="Sending OTP..." textStyle={styles.spinnerTextStyle} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    marginTop: '20%',
    backgroundColor: "rgb(255,255,255)",
    padding: 25,
    borderRadius: 30,
    elevation: 12,
    shadowOffset: { width: 0, height: 5 },
    overflow: "hidden",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
    paddingLeft: 15,
    paddingRight: 15,
  },
  registerButton: {
    backgroundColor: "#006d77",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 25,
    width: "100vw",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  loginText: {
    fontSize: 14,
    color: "#333",
  },
  loginButton: {
    fontSize: 14,
    color: "#006d77",
    fontWeight: "bold",
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});

export default RegisterScreen;
