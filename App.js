import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { setCustomText } from 'react-native-global-props'; 
import Login from './src/Screens/Login';
import Signup from './src/Screens/Signup';
import OTPScreen from './src/Screens/OTPScreen';
import PaymentScreen from './src/Screens/PaymentScreen';
import OnboardingScreen from './src/Screens/OnboardingScreen';
import Forgot from './src/Screens/Forgot';
import DrawerNavigator from './src/Components/Navigations/DrawerNavigator';
import { APIProvider } from './src/Context/APIContext';
import { StripeProvider } from '@stripe/stripe-react-native';

const Stack = createStackNavigator();

function PaymentScreenWrapper() {
  return (
    <StripeProvider publishableKey="pk_test_51PkDz0P8oBD9hDwO9YL7BBXyb5SNBV9vlYYMUVSd50EkSOY57QjGqSWBIpmEY23pnrDF8y2Q8D01UOP1BF0yTkzP00BaKZfPBl">
      <PaymentScreen />
    </StripeProvider>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'Outfit': require('./src/assets/fonts/Outfit-Regular.ttf'), // Path to your Outfit font file
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  // Set the default font for Text globally
  setCustomText({ style: { fontFamily: 'Outfit' } });

  return (
    <NavigationContainer>
      <APIProvider>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          {/* Authentication and Onboarding Screens */}
          <Stack.Screen name="onBoarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Forgot" component={Forgot} />
          <Stack.Screen name="Register" component={Signup} />
          <Stack.Screen name="Otp" component={OTPScreen} />

          {/* PaymentScreen wrapped in StripeProvider */}
          <Stack.Screen name="PaymentScreen" component={PaymentScreenWrapper} />

          {/* Main Application - Drawer Navigation */}
          <Stack.Screen name="MainApp" component={DrawerNavigator} />
        </Stack.Navigator>
      </APIProvider>
    </NavigationContainer>
  );
}
