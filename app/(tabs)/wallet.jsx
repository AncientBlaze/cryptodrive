import { StyleSheet, Text, View, ImageBackground, Image, ScrollView, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useThemeStore from '../../store/themeStore';

const Wallet = () => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const theme = useThemeStore((state) => state.theme);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const fetchCoins = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: 'inr',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
            sparkline: false,
          },
          timeout: 5000
        }
      );
      
      const coins = response.data;
      setData(coins);
      const total = coins.reduce((acc, coin) => acc + coin.current_price, 0);
      setTotalBalance(total);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch cryptocurrency data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  const renderItem = ({ item }) => (
    <View style={styles(theme).coinCard}>
      <View style={styles(theme).coinHeader}>
        <Image 
          source={{ uri: item.image }} 
          style={styles(theme).coinIcon} 
        />
        <View>
          <Text style={styles(theme).coinSymbol}>{item.symbol.toUpperCase()}</Text>
          <Text style={styles(theme).coinName}>{item.name}</Text>
        </View>
      </View>
      <Text style={styles(theme).coinPrice}>
        {formatCurrency(item.current_price)}
      </Text>
    </View>
  );

  const backgroundImage = theme === 'dark'
    ? require('../../assets/images/bg-Dark.png')
    : require('../../assets/images/bg.png');

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={styles(theme).backgroundImage}
    >
      <ScrollView
        contentContainerStyle={styles().scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles().header}>
          <Text style={styles(theme).headerTitle}>Wallet</Text>
          <Text style={styles(theme).headerSubtitle}>
            Total Balance: {formatCurrency(totalBalance)}
          </Text>
        </View>

        <View style={styles(theme).balanceCard}>
          <View style={styles().balanceRow}>
            <Image
              source={require('../../assets/images/coinIcon.png')}
              style={styles().coinIcon}
              resizeMode="contain"
            />
            <Text style={styles(theme).balanceAmount}>
              {formatCurrency(totalBalance)}
            </Text>
          </View>
        </View>

        {loading ? (
          <View style={styles().loadingContainer}>
            <ActivityIndicator size="large" color={theme === 'dark' ? '#FFF' : '#000'} />
            <Text style={styles(theme).loadingText}>Loading wallet...</Text>
          </View>
        ) : error ? (
          <View style={styles().errorContainer}>
            <Text style={styles(theme).errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchCoins}>
              <Text style={styles(theme).retryText}>Tap to retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles().listContainer}
          />
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = (theme) => StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme === 'dark' ? '#FFFFFF' : '#1A1A1A',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
  },
  balanceCard: {
    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  balanceRow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: theme === 'dark' ? '#FFFFFF' : '#1A1A1A',
    marginLeft: 16,
  },
  coinIcon: {
    width: 48,
    height: 48,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme === 'dark' ? '#FFFFFF' : '#1A1A1A',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: theme === 'dark' ? '#FF4757' : '#DC2626',
    marginBottom: 16,
  },
  retryText: {
    fontSize: 14,
    color: theme === 'dark' ? '#FFFFFF' : '#1A1A1A',
    textDecorationLine: 'underline',
  },
  listContainer: {
    paddingBottom: 24,
  },
  coinCard: {
    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coinHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  coinSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: theme === 'dark' ? '#FFFFFF' : '#1A1A1A',
  },
  coinName: {
    fontSize: 12,
    color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
  },
  coinPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: theme === 'dark' ? '#FFFFFF' : '#1A1A1A',
  },
});

export default Wallet;

