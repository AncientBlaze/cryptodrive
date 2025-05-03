import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";
import useIdStore from "../../store/credentialStore.js";
import { useNavigation } from "@react-navigation/native";

const COINS = ["USDT", "BTC"];

const CurrencySelector = ({ selected, onSelect, styles }) => (
  <View style={styles.currencyButtonContainer}>
    {COINS.map((currency) => (
      <TouchableOpacity
      key={currency}
        style={[
          styles.currencyButton,
          selected === currency && styles.currencyButtonActive,
        ]}
        onPress={() => onSelect(currency)}
      >
        <Text style={styles.currencyButtonText}>{currency}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const BuyCoinsModal = ({ visible, onClose, theme, onPurchaseSuccess }) => {
  const navigation = useNavigation();
  const id  = useIdStore((state) => state.id);
  const [coins, setCoins] = useState("");
  const [price, setPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [coinValue, setCoinValue] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("USDT");
  const [walletAddresses, setWalletAddresses] = useState({ USDT: "", BTC: "" });
  
  const styles = useMemo(() => createStyles(theme), [theme]);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const previousCurrency = useRef("USDT");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: coinRes }, { data: walletRes }] = await Promise.all([
          axios.get("http://209.126.4.145:4000/coins/get"),
          axios.get("http://209.126.4.145:4000/qrCode/get"),
        ]);
        setCoinValue(coinRes.data[0].price);
        const { USDT, BTC } = walletRes.data[0];
        setWalletAddresses({ USDT, BTC });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const updatePrice = useCallback((value) => {
    const numericValue = parseFloat(value) || 0;
    setCoins(value);
    setPrice(numericValue * coinValue);
  }, [coinValue]);

  const changeCoins = useCallback((delta) => {
    const current = parseFloat(coins) || 0;
    const newValue = Math.max(0, current + delta);
    updatePrice(newValue.toString());
  }, [coins, updatePrice]);

  const handleCopyToClipboard = useCallback(() => {
    if (walletAddresses[selectedCurrency]) {
      Clipboard.setStringAsync(walletAddresses[selectedCurrency]);
      Alert.alert("Copied!", "Wallet address copied to clipboard");
    }
  }, [selectedCurrency, walletAddresses]);

  const handleCurrencyChange = (currency) => {
    if (currency === selectedCurrency) return;

    const direction = currency === "BTC" ? -100 : 100;

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: direction,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      previousCurrency.current = selectedCurrency;
      setSelectedCurrency(currency);
      slideAnim.setValue(direction * -1);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handlePurchase = async () => {
    if (!coins || isNaN(coins) || coins < 1) {
      Alert.alert("Invalid Amount", "Please enter a valid number of coins");
      return;
    }

    setIsLoading(true);
    try {
      if (!id) {
        Alert.alert("Error", "User ID not found");
        return;
      }
      await axios.post(
        "http://209.126.4.145:4000/transactions/insert",
        {
          buyer: id,
          type: selectedCurrency,
          amount: price,
          coin: coins,
        }
      );
      Alert.alert("Success", "Purchase completed! Redirecting to the Transactions Tab");
      onPurchaseSuccess();
      onClose();
      navigation.navigate("transactions");
    } catch (error) {
      console.error("Error purchasing coins:", error);
      Alert.alert("Purchase Failed", "Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <CurrencySelector
              selected={selectedCurrency}
              onSelect={handleCurrencyChange}
              styles={styles}
            />

            <Animated.View
              style={[
                styles.qrContainer,
                { transform: [{ translateX: slideAnim }], opacity: fadeAnim },
              ]}
            >
              <QRCode
                value={walletAddresses[selectedCurrency] || "loading..."}
                size={200}
                color={theme === "dark" ? "white" : "black"}
                backgroundColor={theme === "dark" ? "#252525" : "white"}
              />
            </Animated.View>

            <View style={styles.upiIdContainer}>
              <Text style={styles.upiIdText}>
                {walletAddresses[selectedCurrency]}
              </Text>
              <TouchableOpacity onPress={handleCopyToClipboard}>
                <Ionicons
                  name="copy-outline"
                  size={24}
                  color={theme === "dark" ? "#FFF" : "#000"}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>Buy Gold Coins</Text>

            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => changeCoins(-1)}
              >
                <Ionicons name="remove" size={24} color={theme === "dark" ? "#FFF" : "#000"} />
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="0"
                value={coins}
                onChangeText={updatePrice}
                placeholderTextColor={theme === "dark" ? "#666" : "#999"}
              />

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => changeCoins(1)}
              >
                <Ionicons name="add" size={24} color={theme === "dark" ? "#FFF" : "#000"} />
              </TouchableOpacity>
            </View>

            <Text style={styles.priceText}>Total: ${price.toFixed(2)}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buyButton]}
                onPress={handlePurchase}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
const createStyles = (theme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      width: "90%",
      borderRadius: 16,
      overflow: "hidden",
    },
    modalContent: {
      backgroundColor: theme === "dark" ? "#252525" : "#FFFFFF",
      padding: 24,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    currencyButtonContainer: {
      flexDirection: "row",
      marginBottom: 20,
      width: "100%",
      justifyContent: "space-between",
    },
    currencyButton: {
      flex: 1,
      padding: 12,
      marginHorizontal: 5,
      borderRadius: 8,
      backgroundColor: theme === "dark" ? "#333" : "#F0F0F0",
      alignItems: "center",
    },
    currencyButtonActive: {
      backgroundColor: "#28C76F",
    },
    currencyButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme === "dark" ? "#FFF" : "#1A1A1A",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme === "dark" ? "#FFF" : "#1A1A1A",
      textAlign: "center",
      marginBottom: 20,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    quantityButton: {
      padding: 10,
      borderRadius: 8,
      backgroundColor: theme === "dark" ? "#333" : "#F0F0F0",
    },
    input: {
      flex: 1,
      height: 50,
      marginHorizontal: 10,
      paddingHorizontal: 15,
      fontSize: 18,
      fontWeight: "600",
      color: theme === "dark" ? "#FFF" : "#1A1A1A",
      backgroundColor: theme === "dark" ? "#333" : "#F8F8F8",
      borderRadius: 10,
      textAlign: "center",
    },
    priceText: {
      fontSize: 18,
      fontWeight: "600",
      color: "#28C76F",
      textAlign: "center",
      marginBottom: 20,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    cancelButton: {
      backgroundColor: theme === "dark" ? "#444" : "#E0E0E0",
      marginRight: 10,
    },
    buyButton: {
      backgroundColor: "#28C76F",
      marginLeft: 10,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme === "dark" ? "#FFF" : "#1A1A1A",
    },
    upiIdContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      marginVertical: 20,
      gap: 10,
    },
    upiIdText: {
      fontSize: 13,
      fontWeight: "bold",
      color: theme === "dark" ? "#FFF" : "#1A1A1A",
    },
    qrContainer: {
      padding: 10,
      backgroundColor: theme === "dark" ? "#252525" : "white",
      borderRadius: 8,
      marginBottom: 20,
    },
  });

export default BuyCoinsModal;
