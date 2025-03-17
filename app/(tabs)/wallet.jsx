import React, { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet, FlatList, ActivityIndicator } from "react-native";

const index = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getCoins = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
      );
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      getCoins();
    }, 1000); // reduced timeout to 1 second for better UX
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.coinContainer}>
        <View style={styles.coinNameContainer}>
          <Image style={styles.coinImage} source={{ uri: item.image }} />
          <View>
            <Text style={styles.coinName}>{item.name}</Text>
            <Text style={styles.coinSymbol}>
              {item.symbol.toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.priceCounter}>
          <Text style={styles.coinPrice}>${item.current_price.toFixed(2)}</Text>
          <Text
            style={[
              styles.priceChange,
              {
                color:
                  item.price_change_percentage_24h > 0 ? "green" : "red",
              },
            ]}
          >
            {item.price_change_percentage_24h.toFixed(2)}%
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.header}>Cryptocurrency App</Text>
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <FlatList
            data={data}
            keyExtractor={({ id }) => id}
            renderItem={renderItem}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 8,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  coinContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  coinNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  coinSymbol: {
    color: "#888",
    fontWeight: "bold",
    fontSize: 12,
  },
  coinName: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  coinPrice: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
  coinImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  priceCounter: {
    alignItems: "flex-end",
    gap: 8,
  },
  priceChange: {
    fontSize: 14,
    fontWeight: "500",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 16,
    backgroundColor: "#007AFF",
    color: "white",
  },
});

export default index;