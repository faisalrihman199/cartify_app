import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import { useAPI } from "../Context/APIContext";
import { useRoute } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay"; // Import the spinner
import AsyncStorage from "@react-native-async-storage/async-storage";

const PaymentScreen = () => {
  const { confirmPayment } = useStripe();
  const [cardDetails, setCardDetails] = useState(null);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { server } = useAPI();
  const route = useRoute(); 
  const { state: billData } = route.params; 
  console.log("Bill Data is:", billData);
  const { getUser } = useAPI();
  const user = getUser()?._j;
  console.log("Saved User is :", user);
  
  const handlePayment = async () => {
    if (!name || !email) {
      setPaymentStatus("Please enter both name and email.");
      return;
    }
  
    setIsPaymentProcessing(true);
    setPaymentStatus(null);
  
    try {
      const response = await fetch(`${server}/company/onlinePayment?id=${billData?.billId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`, // Add the Bearer token
        },
        body: JSON.stringify({ amount: billData?.totalBilling * 100 }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }
  
      const { data } = await response.json();
      const clientSecret = data.clientSecret;
  
      if (clientSecret) {
        const { error, paymentIntent } = await confirmPayment(clientSecret, {
          paymentMethodType: "Card", // Specify payment method type
          paymentMethodData: {
            billingDetails: {
              name,
              email,
            },
          },
        });
  
        if (error) {
          setPaymentStatus(`Payment failed: ${error.message}`);
          console.error("Payment Error:", error);
        } else if (paymentIntent) {
          
          setPaymentStatus("Payment Successful!");
          await AsyncStorage.removeItem('cart');
          Alert.alert('Success', 'You Payment is successfully Proceed.');

          console.log("Payment Successful!", paymentIntent);
        }
      } else {
        throw new Error("No client secret received");
      }
    } catch (error) {
      setPaymentStatus(`Payment failed. Please try again. Error: ${error.message}`);
      console.error("Payment error:", error);
    } finally {
      setIsPaymentProcessing(false);
    }
  };
  

  return (
    <LinearGradient colors={["#4e92cc", "#006d77"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.card} showsVerticalScrollIndicator={false}>
        <View>
          {/* Adding the Mastercard logo */}
          <Image
            source={require("../assets/images/Payment/master.png")} // Use the correct path to your image
            style={styles.logo}
          />
          <Text style={styles.title}>Secure Payment</Text>
          <Text style={styles.subtitle}>Enter your card details below</Text>

          {/* Name Input */}
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
          />

          {/* Email Input */}
          <TextInput
            style={styles.input}
            placeholder="Your Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* Stripe Card Input Field */}
          <CardField
            postalCodeEnabled={true}
            placeholder={{
              number: "4242 4242 4242 4242",
            }}
            cardStyle={styles.cardInput}
            style={styles.cardInputContainer}
            onCardChange={(details) => setCardDetails(details)}
          />

          {/* Payment Button */}
          <TouchableOpacity
            style={[styles.payButton, isPaymentProcessing && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={isPaymentProcessing}
          >
            <Text style={styles.payButtonText}>
              {isPaymentProcessing ? "Processing..." : "Pay Now"}
            </Text>
          </TouchableOpacity>

          {/* Payment Status */}
          {/* {paymentStatus && (
            <Text style={styles.paymentStatus}>
              {paymentStatus}
            </Text>
          )} */}
        </View>
      </ScrollView>

      {/* Spinner overlay when processing payment */}
      <Spinner
        visible={isPaymentProcessing}
        textContent={"Processing payment..."}
        textStyle={styles.spinnerText}
        overlayColor="rgba(0, 0, 0, 0.5)" // Optional background overlay
      />
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
    marginTop: "25%",
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
    width: '100%',
    height: 220,  // Adjust height to fit the image well
    marginBottom: 20,
    border: '1px solid white',
    borderRadius: 10,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    fontSize: 16,
  },
  cardInputContainer: {
    width: "100%",
    height: 50,
    marginBottom: 20,
  },
  cardInput: {
    borderColor: "#006d77",
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
    color: "#333",
    height: "100%",
  },
  payButton: {
    backgroundColor: "#006d77",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 25,
    width: "100%",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  payButtonDisabled: {
    backgroundColor: "#ccc",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  paymentStatus: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    marginTop: 20,
  },
  spinnerText: {
    color: "#fff", // White color for the spinner text
    fontSize: 18,
  },
});

export default PaymentScreen;
