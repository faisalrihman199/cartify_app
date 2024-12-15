import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Animated } from "react-native";
import { CameraView, Camera } from "expo-camera";

export default function Scanning({setScanning,setBarcode}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [animation, setAnimation] = useState(new Animated.Value(0)); // For the scanning line animation
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
    startAnimation();
  }, []);

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleBarcodeScanned = ({ type, data }) => {
    console.log("Scanned :", data);
    setBarcode(data);
    setScanning(false);
    setScanned(true);
  };
  const [flashMode, setFlashMode] = React.useState('on')

   const __handleFlashMode = () => {
    if (flashMode === 'on') {
      setFlashMode('off')
    } else if (flashMode === 'off') {
      setFlashMode('on')
    } else {
      setFlashMode('auto')
    }

  }

  if (hasPermission === null) {
    return <Text style={styles.text}>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text style={styles.text}>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        flashMode={flashMode}

        barcodeScannerSettings={{
          barcodeTypes: [
            "ean13",
            "upc",
            "code128",
            "code39",
            "itf14",
            "pdf417",
            "qr",
          ],
        }}
        style={styles.cameraView}
      />
      {/* Scanning Area Rectangle */}
      <View style={styles.scannerFrame}>
        <Animated.View
          style={[
            styles.scannerLine,
            {
              transform: [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 220], // Move the scanning line vertically
                  }),
                },
              ],
            },
          ]}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4", // Light background color for better contrast
  },
  cameraView: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
    overflow: "hidden",
  },
  scannerFrame: {
    position: "absolute",
    top: "30%",
    left: "10%",
    width: "80%",
    height: 220,
    borderWidth: 2,
    borderColor: "#4e92cc", // Border color for the scanning area
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  scannerLine: {
    position: "absolute",
    width: "100%",
    height: 2,
    backgroundColor: "#4e92cc", // Scanning line color
    top: 0,
  },
  text: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
  },
});
