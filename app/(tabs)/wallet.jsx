import React, { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";

const Wallet = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const getCoins = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
      );
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch cryptocurrency data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCoins();
  }, []);

  const formatPrice = (price) => {
    return `$${price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.coinContainer}>
        <View style={styles.coinNameContainer}>
          <Image style={styles.coinImage} source={{ uri: item.image }} />
          <View style={styles.coinInfo}>
            <Text style={styles.coinName}>{item.name}</Text>
            <Text style={styles.coinSymbol}>{item.symbol.toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.coinPrice}>{formatPrice(item.current_price)}</Text>
          <View style={[
            styles.priceChangeContainer,
            {
              backgroundColor: item.price_change_percentage_24h > 0 
                ? "rgba(76, 175, 80, 0.1)" 
                : "rgba(244, 67, 54, 0.1)"
            }
          ]}>
            <Text style={[
              styles.priceChange,
              { color: item.price_change_percentage_24h > 0 ? "#4CAF50" : "#F44336" }
            ]}>
              {item.price_change_percentage_24h > 0 ? '▲ ' : '▼ '}
              {Math.abs(item.price_change_percentage_24h).toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Crypto Tracker</Text>
        <Text style={styles.headerSubtitle}>Top 100 Cryptocurrencies</Text>
      </View>

      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading Market Data...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={getCoins} style={styles.retryButton}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={({ id }) => id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            windowSize={5}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    backgroundColor: "#007AFF",
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  itemContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    marginVertical: 6,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  coinContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coinNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinImage: {
    width: 48,
    height: 48,
    marginRight: 16,
  },
  coinInfo: {
    marginRight: 16,
  },
  coinName: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  coinSymbol: {
    color: "#666",
    fontSize: 12,
    fontWeight: "500",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  coinPrice: {
    color: "#333",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  priceChangeContainer: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  priceChange: {
    fontSize: 14,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#F44336",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontWeight: "600",
  },
});

export default Wallet;