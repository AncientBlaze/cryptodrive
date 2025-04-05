import React from "react";
import {
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Text,
  StyleSheet,
  View,
  StatusBar,
  ToastAndroid
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import useIdStore from "../store/credentialStore"; // Import Zustand store
import useThemeStore from "../store/themeStore";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().required("Password required"),
});

const LoginPage = () => {
  const navigation = useNavigation();
  const setId = useIdStore((state) => state.setId);
  const setKyc = useIdStore((state) => state.setKyc);
  const kyc = useIdStore.getState().kyc;
  console.log(kyc);

  const theme = useThemeStore.getState().theme;

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.LONG);
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        "https://really-classic-moray.ngrok-free.app/user/login",
        values
      ).then((response) => {
        return response;
      }).catch((error) => {
        console.error("Login error:", error.response?.data || error.message);
        const errorMessage = error.response?.data?.message || "Login failed";
        showToast(errorMessage);
      });
      setId(response.data.data.id);
      setKyc(response.data.data.authorized);
      console.log("Login response:", response.data.data.id);
      navigation.navigate("(tabs)"); // Navigate to the main app screen
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      showToast(errorMessage);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={theme === "dark" ? require("../assets/images/bg-Dark.png") : require("../assets/images/bg.png")}
        style={styles.background}
      >
        <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} backgroundColor={theme === "dark" ? "#0D0D0D" : "#F8F6FF"} />
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <>
                <Text style={styles.title}>Welcome Back</Text>

                <View style={styles.formContainer}>
                  <TextInput
                    label="Email"
                    mode="flat"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    style={styles.input}
                    error={touched.email && !!errors.email}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  <TextInput
                    label="Password"
                    mode="flat"
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    secureTextEntry
                    style={styles.input}
                    error={touched.password && !!errors.password}
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}

                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.button}
                    labelStyle={styles.buttonLabel}
                  >
                    Login
                  </Button>

                  <Button
                    mode="text"
                    onPress={() => navigation.navigate("register")}
                    labelStyle={styles.loginLink}
                  >
                    Don't have an account? Sign up
                  </Button>
                </View>
              </>
            )}
          </Formik>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    color: "#F8F6FF",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 32,
    textAlign: "center",
  },
  formContainer: {
    paddingHorizontal: 16,
    marginTop: 200,
  },
  input: {
    backgroundColor: "white",
    marginBottom: 16,
    borderColor: "#AAA7B4",
    borderWidth: 1,
    borderRadius: 8,
  },
  button: {
    borderRadius: 25,
    backgroundColor: "#6339F9",
    paddingVertical: 8,
    marginTop: 24,
  },
  buttonLabel: {
    color: "#F8F6FF",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginLink: {
    color: "#AAA7B4",
    marginTop: 16,
    textAlign: "center",
  },
  errorText: {
    color: "#FF6961",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 8,
  },
  background: {
    flex: 1,
    resizeMode: "contain",
  },
});

export default LoginPage;
