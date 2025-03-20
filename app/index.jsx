import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const requestURL = "https://4000-idx-cryptodrive-1741678141664.cluster-nx3nmmkbnfe54q3dd4pfbgilpc.cloudworkstations.dev";

axios.get(`${requestURL}/coins/get`)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    // Basic validation to ensure no field is empty
    if (!username || !email || !password) {
      Alert.alert('Validation Error', 'All fields are required!');
      return;
    }

    try {
      const response = await axios.post(`${requestURL}/user/register`, {
        username,
        email,
        password,
      });
      console.log(response);
      if (response.status === 200) {
        // Successful registration
        Alert.alert('Registration Successful', 'You have successfully registered.');
        setUsername('');
        setEmail('');
        setPassword('');
      } else {
        // If the status code is not 200, show a failure message
        Alert.alert('Registration Failed', 'An error occurred during registration.');
      }
    } catch (error) {
      // Catch and handle any errors from the Axios request
      console.error('Registration Error:', error);
      Alert.alert('Registration Failed', 'An error occurred during registration.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
  },
});

export default Register;
