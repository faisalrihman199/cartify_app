import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAPI } from "../Context/APIContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from "react-native-gesture-handler";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigation = useNavigation();
  const { login, showToast, getUser } = useAPI();

  const handleLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }
    setLoading(true); // Start loading
    const data = { email, password };
    console.log("Attempting Login with:", data);

    try {
      const res = await login(data);
      console.log("Login response:", res);
      setLoading(false); // Stop loading after success
      navigation.navigate("MainApp");
    } catch (err) {
      console.log("Login error:", err);
      setLoading(false); // Stop loading on error
      Alert.alert("Login Failed", "Please check your credentials and try again.");
    }
  };

  useEffect(() => {
    const user = getUser()?._j;
    if (user) {
      console.log("User is already logged in:", user);
      navigation.navigate("MainApp");
    }
  }, [getUser]);

  return (
    <LinearGradient colors={["#4e92cc", "#006d77"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.card} showsVerticalScrollIndicator={false}>
        <View>
          <Image
            source={require("../assets/images/Login/cart.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Being in Contact with Smart Shopping Cart</Text>

          {/* Email Input */}
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
              secureTextEntry={!showPassword} // Toggle secure text entry
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

          {/* Forgot Password Link */}
          <TouchableOpacity onPress={() => navigation.navigate("Forgot")}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don’t have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerButton}> Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    backgroundColor: "rgb(255,255,255)",
    marginTop: '25%',
    padding: 25,
    borderRadius: 30,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    overflow: "hidden",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    alignSelf: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 25,
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
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#006d77",
    fontSize: 14,
    marginBottom: 20,
    marginTop: 10,
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
  disabledButton: {
    opacity: 0.7,
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
    color: "#333",
  },
  registerButton: {
    fontSize: 14,
    color: "#006d77",
    fontWeight: "bold",
  },
});

export default LoginScreen;
