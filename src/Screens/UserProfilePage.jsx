import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { EvilIcons } from '@expo/vector-icons';

const UserProfilePage = () => {
  const [name, setName] = useState('Arslan Arshad');
  const [email, setEmail] = useState('arslan@gmail.com');
  const [password, setPassword] = useState('123456767868');
  const [phone, setPhone] = useState('+92 312 1234567');
  const [cnic, setCnic] = useState('12345-0987654-1');
  const [address, setAddress] = useState('NUML H-8 Islamabad');
  const [profilePic, setProfilePic] = useState('https://randomuser.me/api/portraits/men/9.jpg'); // Default image

  // Function to handle profile picture change
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied!', 'Sorry, we need camera roll permissions to change your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePic(result.uri);
    }
  };

  // Function to handle save profile
  const handleSaveProfile = () => {
    Alert.alert('Profile Updated', 'Your profile details have been updated successfully!');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>{name}</Text>

          {/* Profile Picture */}
          <View style={styles.profilePicContainer}>
            <Image source={{ uri: profilePic }} style={styles.profilePic} />
            <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
              <EvilIcons name="camera" size={30} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Name Input */}
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />

          {/* Email Input */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />

          {/* Password Input */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
          />

          {/* Phone Input */}
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          {/* CNIC Input */}
          <TextInput
            style={styles.input}
            placeholder="CNIC"
            value={cnic}
            onChangeText={setCnic}
          />

          {/* Address Input */}
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Save Profile Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100, // Adjust this to provide space for the Save Profile button
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'green',
    padding: 8,
    borderRadius: 30,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#4e92cc',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    marginHorizontal: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UserProfilePage;
