import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
import { useStripe, CardField, useConfirmPayment } from "@stripe/stripe-react-native";
import { useAPI } from "../Context/APIContext";

const PaymentScreen = () => {
  const { confirmPayment } = useStripe();
  const [cardDetails, setCardDetails] = useState(null);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const { server } = useAPI();

  const handlePayment = async () => {
   
    setIsPaymentProcessing(true);

    try {
      // Request to create a Payment Intent on the server
      const response = await fetch(`${server}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 5000 }), // Example: 5000 cents = $50
      });

      const { clientSecret } = await response.json();

      // Confirm the payment with Stripe
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        type: "Card",
        billingDetails: { name: "John Doe" },
      });

      if (error) {
        setPaymentStatus(`Payment failed: ${error.message}`);
        console.error(error);
      } else if (paymentIntent) {
        setPaymentStatus("Payment Successful!");
        console.log("Payment Successful!", paymentIntent);
      }
    } catch (error) {
      setPaymentStatus("Payment failed. Please try again.");
      console.error("Payment failed", error);
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  return (
    <LinearGradient colors={["#4e92cc", "#006d77"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.card} showsVerticalScrollIndicator={false}>
        <View>
          <Image
            // source={require("../assets/images/Payment/credit-card.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Secure Payment</Text>
          <Text style={styles.subtitle}>Enter your card details below</Text>

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
          {paymentStatus && (
            <Text style={styles.paymentStatus}>
              {paymentStatus}
            </Text>
          )}
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
    width: 100,
    height: 100,
    marginBottom: 20,
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
});

export default PaymentScreen;
