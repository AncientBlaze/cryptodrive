import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground,
  Dimensions 
} from "react-native";
import { useNavigation } from "expo-router";

const KYCNotification = () => {
  const navigation = useNavigation();

  const handleCompleteKYC = () => {
    navigation.navigate("KYCPage");
  };

  return (
    <ImageBackground 
      source={require("../assets/images/bg-Dark.png")} 
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>✅</Text>
        </View>

        <Text style={styles.title}>Welcome! 🎉</Text>
        
        <View style={styles.messageBox}>
          <Text style={styles.message}>
            Account created successfully! Complete your 
            <Text style={styles.highlight}> KYC verification </Text> 
            to unlock all features.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleCompleteKYC}
        >
          <Text style={styles.buttonText}>Start KYC Verification</Text>
        </TouchableOpacity>

        <Text style={styles.note}>Takes only 2 minutes ⏱️</Text>
      </View>
    </ImageBackground>
  );
};

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  iconCircle: {
    backgroundColor: "rgba(138,106,243,0.3)",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  messageBox: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
  },
  message: {
    color: "#FFF",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  highlight: {
    color: "#8A6AF3",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#6339F9",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: width * 0.8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  note: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 15,
    fontSize: 14,
  },
});

export default KYCNotification;