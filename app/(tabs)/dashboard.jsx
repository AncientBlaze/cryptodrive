import React, { useState, useEffect, useCallback } from "react";
import * as Animatable from "react-native-animatable";
import {
  Text,
  View,
  Image,
  ImageBackground,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
} from "react-native";
import axios from "axios";
import useThemeStore from "../../store/themeStore.js";
import useIdStore from "../../store/credentialStore.js";
import { Ionicons } from "@expo/vector-icons";
import BuyCoinsModal from "../components/BuyCoinsModal.jsx";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;
const CARD_HEIGHT = 220;

const dashboardScreen = () => {
  const [userData, setUserData] = useState({});
  const [totalBalance, setTotalBalance] = useState(0);
  const theme = useThemeStore((state) => state.theme);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const id = useIdStore((state) => state.id);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [coinvalue, setCoinValue] = useState(0);

  const Toast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };
  const getCoins = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
      );
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch cryptocurrency data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://209.126.4.145:4000/user/get/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = response.data?.data?.[0];
      if (result) {
        setUserData(result);
        setTotalBalance(result.coin);
      } else {
        setError("User data not found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch user data");
    }
  }, [id]);

  const fetchCurrentGoldCoinPrice = async () => {
    try {
      const response = await axios.get(
        "http://209.126.4.145:4000/coins/get"
      );
      const coindata = await response.data.data;
      setCoinValue(coindata[0].price);
    } catch (error) {}
  };

  useEffect(() => {
    fetchUserData();
    getCoins();
    fetchCurrentGoldCoinPrice();
  }, []);

  const kycStatus =
    userData.authorized === "Not Authorized"
      ? "Kyc Not Verified"
      : userData.authorized === "Pending"
      ? "Kyc Pending"
      : "Kyc Verified";

  const renderItem = ({ item, index }) => (
    <Animatable.View
      animation="zoomIn"
      duration={600}
      delay={index * 100}
      easing="ease-out"
      useNativeDriver
      style={[
        styles(theme).card,
        {
          marginLeft: index % 2 === 0 ? CARD_MARGIN : CARD_MARGIN / 2,
          marginRight: index % 2 !== 0 ? CARD_MARGIN : CARD_MARGIN / 2,
          height: CARD_HEIGHT,
        },
      ]}
    >
      <View style={styles().cardHeader}>
        <Image source={{ uri: item.image }} style={styles().coinIcon} />
        <View>
          <Text style={styles(theme).coinSymbol}>
            {item.symbol.toUpperCase()}
          </Text>
          <Text style={styles(theme).coinName}>{item.name}</Text>
        </View>
      </View>

      <Text style={styles(theme).priceText}>
        $
        {item.current_price.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Text>

      <View
        style={[
          styles(theme).changeBadge,
          {
            backgroundColor:
              item.price_change_percentage_24h > 0
                ? theme === "dark"
                  ? "rgba(40, 199, 111, 0.2)"
                  : "rgba(40, 199, 111, 0.1)"
                : theme === "dark"
                ? "rgba(255, 71, 87, 0.2)"
                : "rgba(255, 71, 87, 0.1)",
          },
        ]}
      >
        <Text
          style={[
            styles(theme).changeText,
            {
              color:
                item.price_change_percentage_24h > 0 ? "#28C76F" : "#FF4757",
            },
          ]}
        >
          {item.price_change_percentage_24h > 0 ? "▲" : "▼"}
          {Math.abs(item.price_change_percentage_24h).toFixed(2)}%
        </Text>
      </View>
    </Animatable.View>
  );

  return (
    <ImageBackground
      source={
        theme === "light"
          ? require("../../assets/images/bg.png")
          : require("../../assets/images/bg-Dark.png")
      }
      style={styles(theme).background}
    >
      <View style={styles(theme).container}>
        <View style={styles(theme).header}>
          <Text style={styles(theme).headerTitle}>Dashboard</Text>
          <View style={styles(theme).marketCapCard}>
            <Text style={styles(theme).marketCapLabel}>{kycStatus}</Text>
            <Text style={styles(theme).marketCapValue}>
              {userData.fullName}
            </Text>
            <Text style={styles(theme).marketCapChange}>{userData._id}</Text>
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "center", marginTop: 10 }}>
                <Image
                  source={require("../../assets/images/coinIcon.png")}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
              <Text style={styles(theme).marketCapChange}>
                {userData.coin}
              </Text>
            </View>
            <View style={styles(theme).gridview}>
              <TouchableOpacity
                style={styles(theme).button}
                onPress={() => setIsModalVisible(true)}
              >
                <Ionicons name="flash" size={24} color="lime" />
                <Text style={styles(theme).buttonText}>Buy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles(theme).button}
                onPress={() => Toast("Under Development")}
              >
                <Ionicons name="arrow-up" size={24} color="lime" />
                <Text style={styles(theme).buttonText}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles(theme).button}
                onPress={() => Toast("Under Development")}
              >
                <Ionicons name="arrow-down" size={24} color="lime" />
                <Text style={styles(theme).buttonText}>Receive</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {isLoading ? (
          <View style={styles(theme).loadingContainer}>
            <ActivityIndicator
              size="large"
              color={theme === "dark" ? "#6366F1" : "#4F46E5"}
            />
            <Text style={styles(theme).loadingText}>
              Loading Market Data...
            </Text>
          </View>
        ) : error ? (
          <View style={styles(theme).errorContainer}>
            <Text style={styles(theme).errorText}>{error}</Text>
            <TouchableOpacity
              style={styles(theme).retryButton}
              onPress={getCoins}
            >
              <Text style={styles(theme).retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles(theme).gridContainer}
            onRefresh={fetchUserData}
            refreshing={isLoading}
            ListEmptyComponent={
              <Text
                style={{ textAlign: "center", color: "#999", marginTop: 40 }}
              >
                No data found.
              </Text>
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <BuyCoinsModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        theme={theme}
        userId={id === undefined ? id.id : id}
        onPurchaseSuccess={fetchUserData}
        onBuy={fetchCurrentGoldCoinPrice}
      />
    </ImageBackground>
  );
};

const styles = (theme) =>
  StyleSheet.create({
    background: {
      flex: 1,
    },
    container: {
      flex: 1,
    },
    header: {
      paddingVertical: 24,
      paddingHorizontal: CARD_MARGIN,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "800",
      color: theme === "dark" ? "#FFFFFF" : "#1A1A1A",
      marginBottom: 16,
    },
    marketCapCard: {
      backgroundColor: theme === "dark" ? "#252525" : "#FFFFFF",
      borderRadius: 16,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    marketCapLabel: {
      color: theme === "dark" ? "#A0A0A0" : "#666666",
      fontSize: 14,
      fontWeight: "500",
      marginBottom: 4,
      textAlign: "center",
    },
    marketCapValue: {
      color: theme === "dark" ? "#FFFFFF" : "#1A1A1A",
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 4,
      textAlign: "center",
    },
    marketCapChange: {
      color: "#28C76F",
      fontSize: 14,
      fontWeight: "600",
      textAlign: "center",
    },
    gridContainer: {
      paddingHorizontal: CARD_MARGIN / 2,
      paddingBottom: 20,
    },
    card: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      borderRadius: 20,
      padding: 16,
      marginBottom: CARD_MARGIN,
      backgroundColor:
        theme === "dark" ? "rgba(30,30,30,0.7)" : "rgba(255,255,255,0.9)",
      borderWidth: 1,
      borderColor: theme === "dark" ? "#333" : "#E5E5E5",
      justifyContent: "space-between",
      shadowColor: theme === "dark" ? "rgba(30,30,30,0.7)" : "#fff",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    cardHeader: {
      flexDirection: "column",
      alignItems: "left",
      marginBottom: 8,
      gap: 10,
    },
    coinIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      marginLeft: 10,
      alignSelf: "flex-start",
    },
    coinSymbol: {
      fontSize: 16,
      fontWeight: "700",
      color: theme === "dark" ? "#FFF" : "#1A1A1A",
      alignSelf: "flex-start",
    },
    coinName: {
      fontSize: 12,
      fontWeight: "500",
      color: theme === "dark" ? "#A0A0A0" : "#666",
    },
    priceText: {
      fontSize: 20,
      fontWeight: "700",
      color: theme === "dark" ? "#FFFFFF" : "#1A1A1A",
      marginBottom: 6,
    },
    changeBadge: {
      alignSelf: "flex-start",
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginBottom: 10,
    },
    changeText: {
      fontSize: 14,
      fontWeight: "600",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      fontSize: 14,
      color: theme === "dark" ? "#AAA" : "#666",
      marginTop: 16,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
    },
    errorText: {
      fontSize: 14,
      textAlign: "center",
      color: theme === "dark" ? "#AAA" : "#666",
      marginBottom: 16,
    },
    retryButton: {
      backgroundColor: "#6366F1",
      borderRadius: 10,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    retryText: {
      color: "#FFF",
      fontWeight: "600",
    },
    button: {
      backgroundColor: theme === "dark" ? "#6366F1" : "#4F46E5",
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginTop: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      color: "#FFF",
      fontWeight: "600",
      textAlign: "center",
    },
    gridview: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 10,
      gap: 10,
    },
  });

export default dashboardScreen;
