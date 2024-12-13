import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useAPI } from "../Context/APIContext";

const OTPScreen = ({ route }) => {
  const [otp, setOtp] = useState(Array(6).fill("")); // To hold the OTP digits
  const [loading, setLoading] = useState(false); // Loading state
  const navigation = useNavigation();
  let { state } = route?.params;

  // Create refs for each OTP input field
  const otpRefs = useRef([]);

  // Function to handle OTP change
  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto move to next input field when a digit is entered
    if (text && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };
  const { verifyOTP, sendOTP,showToast } = useAPI();

  // Resend OTP
  const handleResend = () => {
    setLoading(true); 

    sendOTP({ email: state.email })
      .then((res) => {
        if (res.success) {
          console.log(res);
          showToast('success', res.message);
          navigation.navigate("Otp", { state });
        }
      })
      .catch((err) => {
        showToast('error', 'Failed to Send OTP');
        console.log("Error:", err);
      })
      .finally(() => {
        setLoading(false); // Always stop loading after request is complete
      });
  };

  // Verify OTP
  const handleVerifyOtp = () => {
    if (otp.join("").length === 6) {
      setLoading(true); // Start loading
      state.otp = otp.join("");
      console.log("OTP data is:", state);
      const endpoint=state?.name?'signup':'resetPassword'
      verifyOTP(state,endpoint)
        .then((res) => {
          console.log("Response From API is:", res.data);
          Alert.alert("Success", res.message);
          setOtp(Array(6).fill("")); // Clear OTP fields
          navigation.navigate("Login");
        })
        .catch((err) => {
          console.log("Error:", err);
          Alert.alert("Error", "OTP Verification Failed!");
        })
        .finally(() => {
          setLoading(false); // Stop loading after the request is complete
        });
    } else {
      Alert.alert("Error", "Please enter a valid OTP!");
    }
  };

  return (
    <LinearGradient colors={["#4e92cc", "#006d77"]} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>
          We have sent a verification code to your {state.email}. Please enter the code
          below to verify.
        </Text>

        {/* OTP Inputs */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (otpRefs.current[index] = el)} // Assigning ref dynamically
              style={styles.otpInput}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              maxLength={1}
              keyboardType="numeric"
              autoFocus={index === 0}
              onKeyPress={({ nativeEvent }) => {
                if (
                  nativeEvent.key === "Backspace" &&
                  index > 0 &&
                  otp[index] === ""
                ) {
                  otpRefs.current[index - 1].focus();
                }
              }}
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerifyOtp}
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify OTP</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Didn't receive the OTP?</Text>
          <TouchableOpacity
            onPress={handleResend}
          >
            <Text style={styles.registerButton}> Resend OTP</Text>
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
    width: "100%",
  },
  otpInput: {
    width: 39,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    color: "#333",
    marginHorizontal: 5,
  },
  verifyButton: {
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
  verifyButtonText: {
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

export default OTPScreen;
