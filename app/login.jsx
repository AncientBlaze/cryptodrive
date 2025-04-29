import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Text,
  StyleSheet,
  View,
  StatusBar,
  ToastAndroid,
  TouchableOpacity
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import useIdStore from "../store/credentialStore";
import useThemeStore from "../store/themeStore";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().required("Password required"),
});

const LoginPage = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const setId = useIdStore((state) => state.setId);
  const setKyc = useIdStore((state) => state.setKyc);
  const theme = useThemeStore((state) => state.theme);
  const styles = getStyles(theme);

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.LONG);
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        "http://209.126.4.145:4000/user/login",
        values
      );
      setId(response.data.data.id);
      setKyc(response.data.data.authorized);
      navigation.navigate("(tabs)");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      showToast(errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={
          theme === "dark" 
          ? require("../assets/images/bg-Dark.png") 
          : require("../assets/images/bg.png")
        }
        style={styles.background}
      >
        <StatusBar
          barStyle={theme === "dark" ? "light-content" : "dark-content"}
          backgroundColor={theme === "dark" ? "#121212" : "#F8F6FF"}
        />
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <>
                <View style={styles.headerContainer}>
                  <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                  >
                    <MaterialIcons 
                      name="arrow-back" 
                      size={24} 
                      color={theme === "dark" ? "#FFFFFF" : "#1A1A1A"} 
                    />
                  </TouchableOpacity>
                  <Text style={styles.title}>Welcome Back</Text>
                </View>

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
                    theme={{
                      colors: {
                        text: theme === "dark" ? "#FFFFFF" : "#000000",
                        primary: theme === "dark" ? "#BB86FC" : "#6200EE",
                        placeholder: theme === "dark" ? "#888888" : "#666666",
                      }
                    }}
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
                    secureTextEntry={!showPassword}
                    style={styles.passwordInput}
                    error={touched.password && !!errors.password}
                    theme={{
                      colors: {
                        text: theme === "dark" ? "#FFFFFF" : "#000000",
                        primary: theme === "dark" ? "#BB86FC" : "#6200EE",
                        placeholder: theme === "dark" ? "#888888" : "#666666",
                      }
                    }}
                    right={
                      <TextInput.Icon 
                        icon={showPassword ? "eye-off" : "eye"} 
                        onPress={() => setShowPassword((prev) => !prev)} 
                        color={theme === "dark" ? "#BB86FC" : "#6200EE"} 
                      />
                    }
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}

                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.button}
                    labelStyle={styles.buttonLabel}
                    theme={{
                      colors: {
                        primary: "#6200EE",
                      }
                    }}
                  >
                    Login
                  </Button>

                  <Button
                    mode="text"
                    onPress={() => navigation.navigate("register")}
                    labelStyle={[
                      styles.loginLink,
                      { color: theme === "dark" ? "#FFFFFF" : "#6200EE" }
                    ]}
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

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === "dark" ? "#121212" : "#F8F6FF",
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  title: {
    color: theme === "dark" ? "#FFFFFF" : "#1A1A1A",
    fontSize: 28,
    fontWeight: "bold",
  },
  formContainer: {
    paddingHorizontal: 16,
    marginTop: 40,
  },
  input: {
    backgroundColor:  "#FFFFFF",
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  passwordInput: {
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  button: {
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 24,
    elevation: 2,
  },
  buttonLabel: {
    fontWeight: "bold",
    fontSize: 16,
  },
  loginLink: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 14,
  },
  errorText: {
    color: "#CF6679",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 8,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
});

export default LoginPage;