import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAPI } from "../Context/APIContext";
import Toast from "react-native-toast-message";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const navigation = useNavigation();
  const { forgot, showToast } = useAPI();

  const handleResetPassword = async () => {
    if (email === "" || password === "" || confirmPassword === "") {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    setIsLoading(true); // Start loader
    const otpEmail = { email };
    const data = {
      email,
      password,
    };

    try {
      await forgot(otpEmail); // Call forgot function from API context
      showToast("success", "OTP sent successfully");
      navigation.navigate("OTPScreen", { state: data }); // Navigate to OTP verification screen
      
    } catch (err) {
      console.error("Error:", err.message);
      showToast("error", "Failed to send OTP");
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  return (
    <LinearGradient colors={["#4e92cc", "#006d77"]} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>Reset your password</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#777" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#777"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#777" />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="#777"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
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
            secureTextEntry={!isConfirmPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() =>
              setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
            }
          >
            <Ionicons
              name={
                isConfirmPasswordVisible ? "eye-outline" : "eye-off-outline"
              }
              size={20}
              color="#777"
            />
          </TouchableOpacity>
        </View>

        {/* Reset Password Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleResetPassword}
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" /> // Loader
          ) : (
            <Text style={styles.loginButtonText}>Reset Password</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Remember your password?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.registerButton}> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    width: "90%",
    backgroundColor: "#fff",
    padding: 35,
    borderRadius: 30,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    overflow: "hidden",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Poppins",
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 25,
    textAlign: "center",
    fontFamily: "Poppins",
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
    fontSize: 16,
    color: "#333",
    paddingLeft: 10,
    fontFamily: "Poppins",
  },
  loginButton: {
    backgroundColor: "#006d77",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 25,
    width: "100%",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  registerText: {
    fontSize: 14,
    color: "#777",
  },
  registerButton: {
    fontSize: 14,
    color: "#006d77",
    fontWeight: "bold",
  },
});

export default Forgot;
