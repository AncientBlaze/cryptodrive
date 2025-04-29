import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import axios from "axios";
import useThemeStore from "../../store/themeStore";
import useIdStore from "../../store/credentialStore";

const Wallet = () => {
  const [userData, setUserData] = useState({});
  const [coinValue, setCoinValue] = useState(0);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useThemeStore((state) => state.theme);
  const id = useIdStore((state) => state.id);

  const mockHistory = [
    { timestamp: "00:00", price: 45 },
    { timestamp: "04:00", price: 52 },
    { timestamp: "08:00", price: 48 },
    { timestamp: "12:00", price: 55 },
    { timestamp: "16:00", price: 60 },
    { timestamp: "20:00", price: 58 },
  ];

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://209.126.4.145:4000/user/get/${id}`
      );
      const result = response.data?.data?.[0];
      if (result) setUserData(result);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  const fetchCoinData = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://209.126.4.145:4000/coins/get"
      );
      const data = response.data.data;
      setCoinValue(data[0]?.price || 0);
      setPriceHistory(mockHistory);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchUserData(), fetchCoinData()]);
    setRefreshing(false);
  }, [fetchUserData, fetchCoinData]);

  useEffect(() => {
    fetchUserData();
    fetchCoinData();
  }, []);

  if (loading) {
    return (
      <View style={styles(theme).loadingContainer}>
        <ActivityIndicator
          size="large"
          color={theme === "dark" ? "#fff" : "#000"}
        />
      </View>
    );
  }

  return (
    <>
    <ImageBackground
      source={
        theme === "light"
        ? require("../../assets/images/bg.png")
        : require("../../assets/images/bg-Dark.png")
      }
      style={styles(theme).container}
      >
      <ScrollView
        contentContainerStyle={styles(theme).content}
        refreshControl={
          <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme === "dark" ? "#000" : "#007AFF"]}
          tintColor={theme === "dark" ? "#fff" : "#000"}
          />
        }
        >
        <View style={styles(theme).balanceCard}>
          <Text style={styles(theme).balanceLabel}>Your Gold Coins</Text>
          <Text style={styles(theme).balanceValue}>{userData.coin || 0}</Text>

          <View style={styles(theme).priceContainer}>
            <Text style={styles(theme).currentPrice}>
              Current Value: ${coinValue.toFixed(2)}
            </Text>
            <Text style={styles(theme).totalValue}>
              Total: ${(coinValue * (userData.coin || 0)).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles(theme).chartContainer}>
          <Text style={styles(theme).chartTitle}>Price History (24h)</Text>
          <LineChart
            styles={{
              borderRadius: 16,
              padding: 0,
            }}
            data={priceHistory.map((item) => ({
              value: item.price,
              label: item.timestamp,
            }))}
            curved
            width={Dimensions.get("window").width - 80}
            height={240}
            spacing={(Dimensions.get("window").width - 100) / 5}
            initialSpacing={0}
            color={theme === "dark" ? "#00FFA4" : "#007AFF"}
            thickness={2}
            hideRules
            showVerticalLines={false}
            yAxisTextStyle={{
              color: theme === "dark" ? "#aaa" : "#444",
            }}
            xAxisLabelTextStyle={{
              color: theme === "dark" ? "#aaa" : "#444",
            }}
            noOfSections={4}
            maxValue={Math.max(...priceHistory.map((item) => item.price)) + 10}
            areaChart
            startFillColor={theme === "dark" ? "#00FFA4" : "#007AFF"}
            endFillColor={theme === "dark" ? "#1E1E1E" : "#fff"}
            startOpacity={0.4}
            endOpacity={0.1}
            yAxisThickness={0}
            xAxisThickness={0}
            dataPointsColor={theme === "dark" ? "#00FFA4" : "#007AFF"}
            rulesColor={theme === "dark" ? "#333" : "#eee"}
            backgroundColor={theme === "dark" ? "#252525" : "#fff"}
            showDataPointOnTouch
            showPointerStrip
            showPointerStripOnHover
            pointerStripHeight={180}
            pointerColor={theme === "dark" ? "#00FFA4" : "#007AFF"}
            pointerStripColor={theme === "dark" ? "#555" : "#ccc"}
            isAnimated
            animationDuration={900}
            pointerLabelComponent={(item) => (
              <View
              style={{
                backgroundColor: theme === "dark" ? "#333" : "#fff",
                padding: 0,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: theme === "dark" ? "#555" : "#ddd",
              }}
              >
                <Text
                  style={{
                    color: theme === "dark" ? "#fff" : "#000",
                    fontSize: 12,
                    fontWeight: "500",
                  }}
                  >
                  ${item.value?.toFixed(2)}
                </Text>
              </View>
            )}
            />
        </View>
      </ScrollView>
    </ImageBackground>
    </>
  );
};

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    content: {
      flexGrow: 1,
      gap: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#121212" : "#fff",
    },
    balanceCard: {
      backgroundColor: theme === "dark" ? "#252525" : "#fff",
      borderRadius: 16,
      padding: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
      gap: 16,
    },
    balanceLabel: {
      fontSize: 16,
      color: theme === "dark" ? "#aaa" : "#666",
    },
    balanceValue: {
      fontSize: 36,
      fontWeight: "700",
      color: theme === "dark" ? "#fff" : "#000",
    },
    priceContainer: {
      borderTopWidth: 1,
      borderTopColor: theme === "dark" ? "#333" : "#eee",
      paddingTop: 16,
      gap: 8,
    },
    currentPrice: {
      fontSize: 18,
      color: theme === "dark" ? "#fff" : "#000",
    },
    totalValue: {
      fontSize: 20,
      fontWeight: "600",
      color: theme === "dark" ? "#4CAF50" : "#2E7D32",
    },
    chartContainer: {
      backgroundColor: theme === "dark" ? "#252525" : "#fff",
      borderRadius: 16,
      padding: 16,
      gap: 12,
      overflow: "hidden",
    },
    chartTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme === "dark" ? "#fff" : "#000",
      paddingHorizontal: 8,
    },
  });

export default Wallet;
