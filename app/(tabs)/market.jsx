import React, { useState, useEffect } from "react";
import { Text, View, Image, ImageBackground, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Dimensions } from "react-native";
import useThemeStore from '../../store/themeStore.js';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - (CARD_MARGIN * 3)) / 2;
const CARD_HEIGHT = 180;

const Market = () => {
    const theme = useThemeStore((state) => state.theme);
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

    const renderItem = ({ item, index }) => (
        <View style={[
            styles(theme).card,
            {
                marginLeft: index % 2 === 0 ? CARD_MARGIN : CARD_MARGIN / 2,
                marginRight: index % 2 !== 0 ? CARD_MARGIN : CARD_MARGIN / 2,
                height: CARD_HEIGHT - (CARD_MARGIN * 2),
                paddingVertical: CARD_MARGIN,
            }
        ]}>
            <View style={styles(theme).cardHeader}>
                <Image
                    source={{ uri: item.image }}
                    style={styles(theme).coinIcon}
                />
                <View style={styles(theme).coinTextContainer}>
                    <Text style={styles(theme).coinSymbol} numberOfLines={1}>
                        {item.symbol.toUpperCase()}
                    </Text>
                    <Text style={styles(theme).coinName} numberOfLines={1}>
                        {item.name}
                    </Text>
                </View>
            </View>

            <View style={styles(theme).priceContainer}>
                <Text style={styles(theme).priceText} numberOfLines={1}>
                    ${item.current_price.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </Text>
            </View>

            <View style={[
                styles(theme).changeBadge,
                {
                    backgroundColor: item.price_change_percentage_24h > 0
                        ? theme === 'dark' ? 'rgba(40, 199, 111, 0.2)' : 'rgba(40, 199, 111, 0.1)'
                        : theme === 'dark' ? 'rgba(255, 71, 87, 0.2)' : 'rgba(255, 71, 87, 0.1)'
                }
            ]}>
                <Text style={[
                    styles(theme).changeText,
                    { color: item.price_change_percentage_24h > 0 ? '#28C76F' : '#FF4757' }
                ]}>
                    {item.price_change_percentage_24h > 0 ? '▲' : '▼'}
                    {Math.abs(item.price_change_percentage_24h).toFixed(1)}%
                </Text>
            </View>
        </View>
    );

    return (
        <ImageBackground source={theme === 'light' ? require('../../assets/images/bg.png') : require('../../assets/images/bg-Dark.png')} style={styles(theme).background}>
            <View style={styles(theme).container}>
                <View style={styles(theme).header}>
                    <Text style={styles(theme).headerTitle}>Crypto Market</Text>
                    <View style={styles(theme).marketCapCard}>
                        <Text style={styles(theme).marketCapLabel}>Total Market Cap</Text>
                        <Text style={styles(theme).marketCapValue}>$2.4T</Text>
                        <Text style={styles(theme).marketCapChange}>+2.4% (24h)</Text>
                    </View>
                </View>
                {isLoading ? (
                    <View style={styles(theme).loadingContainer}>
                        <ActivityIndicator size="large" color={theme === 'dark' ? '#6366F1' : '#4F46E5'} />
                        <Text style={styles(theme).loadingText}>Loading Market Data...</Text>
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
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </ImageBackground>
    );
};

const styles = (theme) => StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover'
    },
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },
    header: {
        paddingVertical: 24,
        paddingHorizontal: CARD_MARGIN
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: theme === 'dark' ? '#FFFFFF' : '#1A1A1A',
        marginBottom: 16
    },
    marketCapCard: {
        backgroundColor: theme === 'dark' ? '#252525' : '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2
    },
    marketCapLabel: {
        color: theme === 'dark' ? '#A0A0A0' : '#666666',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4
    },
    marketCapValue: {
        color: theme === 'dark' ? '#FFFFFF' : '#1A1A1A',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4
    },
    marketCapChange: {
        color: '#28C76F',
        fontSize: 14,
        fontWeight: '600'
    },
    gridContainer: {
        paddingHorizontal: CARD_MARGIN / 2,
        paddingBottom: 20
    },
    card: {
        width: CARD_WIDTH,
        borderRadius: 16,
        padding: 16,
        marginBottom: CARD_MARGIN,
        backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        justifyContent: 'space-between'
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    coinIcon: {
        width: 36,
        height: 36,
        marginRight: 12,
        borderRadius: 12
    },
    coinTextContainer: {
        flex: 1,
    },
    coinSymbol: {
        color: theme === 'dark' ? '#FFFFFF' : '#1A1A1A',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2
    },
    coinName: {
        color: theme === 'dark' ? '#A0A0A0' : '#666666',
        fontSize: 12,
        fontWeight: '500'
    },
    priceContainer: {
        marginBottom: 12
    },
    priceText: {
        color: theme === 'dark' ? '#FFFFFF' : '#1A1A1A',
        fontSize: 18,
        fontWeight: '700',
    },
    changeBadge: {
        alignSelf: 'flex-start',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6
    },
    changeText: {
        fontSize: 14,
        fontWeight: '600'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        color: theme === 'dark' ? '#A0A0A0' : '#666666',
        fontSize: 14,
        marginTop: 16
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16
    },
    errorText: {
        color: theme === 'dark' ? '#A0A0A0' : '#666666',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16
    },
    errorButton: {
        backgroundColor: '#28C76F',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24
    },
    errorButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600'
    },
});

export default Market;