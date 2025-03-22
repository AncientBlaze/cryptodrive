import React from "react";
import { View, Text, StyleSheet, Button, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";

const KYCNotification = () => {
  const navigation = useNavigation();

  const handleCompleteKYC = () => {
    navigation.navigate("KYCPage");
  };

  return (
    <ImageBackground source={require("../assets/images/bg-Dark.png")} style={styles.container}>
    <View style={styles.container}>
      <Text style={styles.message}>
        You have registered successfully! Complete your KYC now to fully explore the application.
      </Text>
      <Button title="Complete KYC" onPress={handleCompleteKYC} style={styles.button} />
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  message: {
    color: "#F8F6FF",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: "#6339F9",
  },
});

export default KYCNotification;

