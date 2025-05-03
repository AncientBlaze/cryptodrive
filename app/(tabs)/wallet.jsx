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
import { Feather } from "@expo/vector-icons";

const Wallet = () => {
  const [userData, setUserData] = useState({});
  const [coinValue, setCoinValue] = useState(0);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showRefresh, setShowRefresh] = useState(false); // State to control visibility of refresh option

  const theme = useThemeStore((state) => state.theme);
  const id = useIdStore((state) => state.id);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://209.126.4.145:4000/user/get/${id}`
      );
      const result = response.data?.data?.[0];
      if (result) setUserData(result);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch user data.");
    }
  }, [id]);

  const fetchCoinData = useCallback(async () => {
    try {
      const response = await axios.get("http://209.126.4.145:4000/coins/get");
      const data = response.data.data;
      const history = data[0]?.list || [];
      setCoinValue(data[0]?.price || 0);
      setPriceHistory(history);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch coin data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    await Promise.all([fetchUserData(), fetchCoinData()]);
    setRefreshing(false);
  }, [fetchUserData, fetchCoinData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowRefresh(true);
      setTimeout(() => setShowRefresh(false), 5000); 
    }, 15000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchCoinData();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })
  };

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

  if (error) {
    return (
      <View style={styles(theme).loadingContainer}>
        <Text style={{ color: theme === "dark" ? "#fff" : "#000" }}>
          {error}
        </Text>
      </View>
    );
  }

  return (
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
        {showRefresh && (
          <View style={styles(theme).refreshContainer}>
            <Feather
              name="refresh-cw"
              size={24}
              color={theme === "dark" ? "#fff" : "#000"}
            />
            <Text style={styles(theme).refreshText}>
              Refresh to see fresh data
              </Text>
          </View>
        )}

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
          <Text style={styles(theme).chartTitle}>Price History</Text>
          {priceHistory.length > 0 && (
            <View
              style={{
                borderRadius: 20,
                overflow: "hidden",
                padding: 10,
                backgroundColor: theme === "dark" ? "#1a1a1a" : "#f9f9f9",
                elevation: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
              }}
            >
              <LineChart
                data={priceHistory.map((item) => ({
                  value: item.price,
                  label: formatDate(item.date),
                }))}      
                curved
                isAnimated
                animationDuration={800}
                thickness={1.5}
                color={theme === "dark" ? "#00FFC2" : "#007AFF"}
                width={Dimensions.get("window").width - 60}
                height={250}
                spacing={(Dimensions.get("window").width - 100) / 5}
                initialSpacing={5}
                showVerticalLines={false}
                hideRules
                hidePointsAtStart ={false}
                hidePointsAtEnd={false}
                startFillColor={theme === "dark" ? "#00FFC2" : "#007AFF"}
                endFillColor={theme === "dark" ? "#1a1a1a" : "#ffffff"}
                startOpacity={0.3}
                endOpacity={0.05}
                dataPointsColor={theme === "dark" ? "#00FFC2" : "#007AFF"}
                dataPointsRadius={3}
                dataPointsShape="circle"
                dataPointsWidth={3}
                showDataPointOnTouch
                showPointerStrip
                pointerStripColor={theme === "dark" ? "#444" : "#ccc"}
                pointerStripWidth={2}
                pointerStripUptoDataPoint
                pointerColor={theme === "dark" ? "#00FFC2" : "#007AFF"}
                xAxisLabelTextStyle={{
                  color: theme === "dark" ? "#aaa" : "#333",
                  fontSize: 10,
                }}
                yAxisTextStyle={{
                  color: theme === "dark" ? "#aaa" : "#333",
                  fontSize: 10,
                }}
                xAxisColor={theme === "dark" ? "#444" : "#ccc"}
                yAxisColor={theme === "dark" ? "#444" : "#ccc"}
                rulesColor="white"
                yAxisThickness={2}
                xAxisThickness={2}
                maxValue={
                  Math.max(...priceHistory.map((item) => item.price)) + 10
                }
                areaChartConfig={{
                  startFillColor: theme === "dark" ? "#00FFC2" : "#007AFF",
                  endFillColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
                  startOpacity: 0.3,
                  endOpacity: 0.05,
                  areaChart: true,
                  areaChartColor: theme === "dark" ? "#00FFC2" : "#007AFF",
                  areaChartOpacity: 0.3,
                  areaChartRadius: 0,
                  areaChartWidth: 1.5,
                  areaChartThickness: 1.5,
                  areaChartCurved: true,
                  areaChartHideRules: true,
                  areaChartHidePointsAtStart: false,
                  areaChartHidePointsAtEnd: false,      
                }}
                areaChart
                pointerLabelComponent={(item) => (
                  <View
                    style={{
                      backgroundColor: theme === "dark" ? "#000" : "#fff",
                      paddingVertical: 6,
                      paddingHorizontal: 10,
                      borderRadius: 8,
                      borderColor: theme === "dark" ? "#00FFC2" : "#007AFF",
                      borderWidth: 1,
                      shadowColor: "#000",
                      shadowOpacity: 0.1,
                      shadowRadius: 6,
                      elevation: 3,
                    }}
                  >
                    <Text
                      style={{
                        color: theme === "dark" ? "#00FFC2" : "#007AFF",
                        fontWeight: "600",
                        fontSize: 12,
                      }}
                    >
                      ${item.value?.toFixed(2)}
                    </Text>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
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
    refreshContainer: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "center",
      backgroundColor: theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      marginTop: 4,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    refreshText: {
      fontSize: 14,
      color: theme === "dark" ? "#00FFC2" : "#007AFF",
      fontWeight: "500",
      marginLeft: 8,
    },
    
  });

export default Wallet;
