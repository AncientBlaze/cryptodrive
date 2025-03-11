import React, { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet, FlatList, ActivityIndicator } from "react-native";

const Index = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getCoins = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false');
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      getCoins();
    }, 10000);
  }, []);



  const renderItem = ({ item }) => (
    <View style={styles.coinContainer}>
      <View style={styles.coinNameContainer}>
        <Image style={styles.coinImage} source={{ uri: item.image }} />
        <View>
          <Text style={styles.coinName}>{item.name}</Text>
          <Text style={styles.coinSymbol}>
            {item.symbol.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.priceCounter}>
        <Text style={styles.coinPrice}>${item.current_price}</Text>
        <Text style={styles.coinPrice}>{item.price_change_percentage_24h}%</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({ id }) => id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white'
  },
  coinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15
  },
  coinNameContainer: {
    flexDirection: 'row',
    alignItems: 'start',
    gap: 10
  },
  coinSymbol: {
    color: 'gray',
    fontWeight: 'bold',
    marginRight: 10,
    fontSize: 10
  },
  coinName: {
    color: 'black',
    fontSize: 16,
  },
  coinPrice: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16
  },
  coinImage: {
    height: 35,
    width: 35,
    padding: 20
  },
  priceCounter: {
    color: '#333',
    fontWeight: '600',
    fontSize: 18,
    flexDirection: 'column',
    alignItems: 'end',
    justifyContent: 'end',
    gap: 12,
    padding: '16px 20px'
  }
});

export default Index;