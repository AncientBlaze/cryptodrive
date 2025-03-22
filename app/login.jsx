import React from "react";
import { SafeAreaView, ScrollView, ImageBackground, Text, StyleSheet, View, StatusBar } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().required("Password required"),
});


const LoginPage = () => {
  <statusbar barstyle={'light-content'} backgroundColor={'#0D0D0D'} />
  const navigation = useNavigation();
  const handleSubmit = (values) => {
    axios
      .post("https://really-classic-moray.ngrok-free.app/user/login", values)
      .then((response) => {
        console.log("Login successful:", response.data);
        navigation.navigate("(tabs)");
      })
      .catch((error) => {
        console.log("Login error:", error.response?.data);
      });
  };

  return (

    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/images/bg-Dark.png")}
        style={styles.background}
      >
        <StatusBar barStyle={'light-content'} backgroundColor={'#0D0D0D'} />
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
      </ImageBackground >
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E"
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20
  },
  headerImage: {
    height: 250,
    justifyContent: "flex-end",
    marginBottom: 40
  },
  title: {
    color: "#F8F6FF",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 32,
    textAlign: "center"
  },
  formContainer: {
    paddingHorizontal: 16,
    marginTop: 200
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
    marginTop: 24
  },
  buttonLabel: {
    color: "#F8F6FF",
    fontWeight: "bold",
    fontSize: 16
  },
  loginLink: {
    color: "#AAA7B4",
    marginTop: 16,
    textAlign: "center"
  },
  errorText: {
    color: "#FF6961",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 8
  },
  background: {
    flex: 1,
    resizeMode: "contain"
  }
});

export default LoginPage;