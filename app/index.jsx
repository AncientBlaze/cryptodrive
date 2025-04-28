import { Link } from 'expo-router';
import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, ImageBackground, Image, Text, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useThemeStore from '../store/themeStore';

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

  const theme = useThemeStore((state) => state.theme);
  return (
    <View style={styles(theme).container}>
      <StatusBar barStyle={'light-content'} backgroundColor={'#0D0D0D'} />
      <ImageBackground source={theme === 'light' ? require("../assets/images/bg.png") : require("../assets/images/bg-Dark.png")} style={styles(theme).background}>
        <View style={styles(theme).imageContainer}>
          <Image source={require("../assets/images/hero_image.png")} />
          <Text style={styles(theme).text}>Discover the world of cryptocurrency</Text>
          <View style={styles(theme).buttonContainer}>
            <TouchableOpacity style={styles(theme).loginButton}>
              <Link href="/login">
                <Text style={styles(theme).loginText}>Login</Text>
              </Link>
            </TouchableOpacity>
            <TouchableOpacity style={styles(theme).signUpButton}>
              <Link href="/register">
                <Text style={styles(theme).buttonText}>Sign Up</Text>
              </Link>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};


const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF',
  },
  background: {
    width: '100%',
    height: '100%',
    backgroundColor: theme === 'dark' ? '#0D0D0D' : '#F5F5F5',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginBottom: 20,
  },
  text: {
    color: theme === 'dark' ? '#F8F6FF' : '#000000',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 327,
    marginTop: 100,
    paddingHorizontal: 20,
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
    borderColor: theme === 'dark' ? '#F8F6FF' : '#000000', 
    backgroundColor: theme === 'dark' ? 'transparent' : '#0D0D0D',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
    minWidth: 150,
    ...theme === 'dark' ? { shadowColor: '#000', shadowOpacity: 0.25 } : {}, 
  },
  loginText: {
    color: theme === 'dark' ? '#F8F6FF' : '#FFFFFF', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpButton: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: theme === 'dark' ? '#F8F6FF' : '#0D0D0D', 
    backgroundColor: theme === 'dark' ? '#F8F6FF' : '#0D0D0D',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
    minWidth: 150,
    ...theme === 'dark' ? { shadowColor: '#000', shadowOpacity: 0.25 } : {}, // Add shadow in dark mode
  },
  buttonText: {
    color: theme === 'dark' ? '#0D0D0D' : '#F8F6FF', // Text is dark on light buttons and vice versa
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Optional: Style for handling dark mode theme specifically
  darkTheme: {
    backgroundColor: '#121212',
  },
  lightTheme: {
    backgroundColor: '#FFFFFF',
  },
  // Optional: Additional shadow effect for buttons in dark mode
  buttonShadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});




export default Index;

