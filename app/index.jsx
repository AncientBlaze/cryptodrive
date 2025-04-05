import { Link } from 'expo-router';
import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, ImageBackground, Image, Text, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Index = () => {
  useEffect(() => {
    const checkSession = async () => {
      AsyncStorage.setItem('test', 'value')
        .then(() => console.log('Saved'))
        .catch(console.error);

      AsyncStorage.getItem('test')
        .then(value => console.log('Retrieved:', value))
        .catch(console.error);
    };
    checkSession();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor={'#0D0D0D'} />
      <ImageBackground source={require("../assets/images/bg-Dark.png")} style={styles.background}>
        <View style={styles.imageContainer}>
          <Image source={require("../assets/images/hero_image.png")} />
          <Text style={styles.text}>Discover the world of cryptocurrency</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.loginButton}>
              <Link href="/login">
                <Text style={styles.loginText}>Login</Text>
              </Link>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signUpButton}>
              <Link href="/register">
                <Text style={styles.buttonText}>Sign Up</Text>
              </Link>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0D0D0D', // Darker background color
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    color: "#F8F6FF",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    width: 327,
    marginTop: 100,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  loginButton: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#F8F6FF',
    backgroundColor: "transparent",
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  loginText: {
    color: '#F8F6FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpButton: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#F8F6FF',
    backgroundColor: "#F8F6FF",
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0D0D0D',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Index;

