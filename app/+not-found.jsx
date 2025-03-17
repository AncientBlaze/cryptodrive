import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

const page = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oops!</Text>
      <Text style={styles.subtitle}>Something went wrong.</Text>
      <Text style={styles.message}>The page you're looking for could not be found.</Text>
      {/* You can add an optional button or link to navigate back */}
      <TouchableOpacity style={styles.button}>
        <Link href="/">
          <Text style={styles.buttonText}>Go Back</Text>
        </Link>
      </TouchableOpacity>
    </View>
  );
};

export default page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4', // Light gray background
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#e74c3c', // Red color for error
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#3498db', // Blue button color
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});