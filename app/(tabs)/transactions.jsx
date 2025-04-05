import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import useThemestore from '../../store/themeStore';

const Transactions = () => {
    const theme = useThemestore((state) => state.theme);
    const [kycStatus, setKycStatus] = useState('pending'); // 'verified', 'pending', 'not-submitted'
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [showKycModal, setShowKycModal] = useState(false);
    const [amount, setAmount] = useState('');
    const [fee, setFee] = useState(0);
    const [total, setTotal] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Fetch KYC status (mock API call)
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setKycStatus('pending'); // Change to 'verified' to test different states
        }, 1000);
    }, []);

    const handleBuyCoins = () => {
        if (kycStatus !== 'verified') {
            setShowKycModal(true);
        } else {
            setShowBuyModal(true);
        }
    };

    const calculateFee = (value) => {
        const amount = parseFloat(value) || 0;
        const calculatedFee = amount * 0.01; // 1% transaction fee
        setFee(calculatedFee);
        setTotal(amount + calculatedFee);
    };

    const handleConfirmBuy = () => {
        setShowConfirmation(true);
        // Here you would typically handle the actual purchase API call
        setTimeout(() => {
            setShowBuyModal(false);
            setShowConfirmation(false);
            Alert.alert('Success', 'Coins purchased successfully!');
        }, 2000);
    };

    return (
        <ImageBackground 
            source={theme === 'light' ? require('../../assets/images/bg.png') : require('../../assets/images/bg-Dark.png')} 
            style={styles.backgroundImage}
        >
            <View style={styles.transactionsPage}>
                <Text style={theme === 'light' ? styles.lightPageTitle : styles.darkPageTitle}>Transactions</Text>
                
                <TouchableOpacity 
                    style={theme === 'light' ? styles.lightBuyButton : styles.darkBuyButton}
                    onPress={handleBuyCoins}
                >
                    <Text style={styles.buyButtonText}>Buy Coins</Text>
                </TouchableOpacity>

                {/* Transactions List */}
                <View style={styles.transactionsList}>
                    {/* Existing transactions list code */}
                </View>

                {/* KYC Verification Modal */}
                <Modal
                    visible={showKycModal}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={theme === 'light' ? styles.lightModalContent : styles.darkModalContent}>
                            <Text style={theme === 'light' ? styles.lightModalText : styles.darkModalText}>
                                {kycStatus === 'pending' 
                                    ? 'KYC verification is pending. Please wait for approval.'
                                    : 'KYC verification required to buy coins.'}
                            </Text>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setShowKycModal(false)}
                            >
                                <Text style={styles.modalButtonText}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    setShowKycModal(false);
                                    // Navigate to KYC submission screen
                                }}
                            >
                                <Text style={styles.modalButtonText}>Complete KYC</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Buy Coins Modal */}
                <Modal
                    visible={showBuyModal}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={theme === 'light' ? styles.lightModalContent : styles.darkModalContent}>
                            {!showConfirmation ? (
                                <>
                                    <Text style={theme === 'light' ? styles.lightModalText : styles.darkModalText}>
                                        Buy Crypto Coins
                                    </Text>
                                    <TextInput
                                        style={theme === 'light' ? styles.lightInput : styles.darkInput}
                                        placeholder="Enter amount"
                                        keyboardType="numeric"
                                        value={amount}
                                        onChangeText={(text) => {
                                            setAmount(text);
                                            calculateFee(text);
                                        }}
                                        placeholderTextColor={theme === 'light' ? '#666' : '#999'}
                                    />
                                    <View style={styles.feeContainer}>
                                        <Text style={theme === 'light' ? styles.lightModalText : styles.darkModalText}>
                                            Transaction Fee: ${fee.toFixed(2)}
                                        </Text>
                                        <Text style={theme === 'light' ? styles.lightModalText : styles.darkModalText}>
                                            Total: ${total.toFixed(2)}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.modalButton}
                                        onPress={handleConfirmBuy}
                                    >
                                        <Text style={styles.modalButtonText}>Confirm Buy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.modalButton}
                                        onPress={() => setShowBuyModal(false)}
                                    >
                                        <Text style={styles.modalButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <View style={styles.confirmationContainer}>
                                    <Text style={theme === 'light' ? styles.lightModalText : styles.darkModalText}>
                                        Processing Transaction...
                                    </Text>
                                    <Text style={theme === 'light' ? styles.lightModalText : styles.darkModalText}>
                                        Amount: ${amount}
                                    </Text>
                                    <Text style={theme === 'light' ? styles.lightModalText : styles.darkModalText}>
                                        Fee: ${fee.toFixed(2)}
                                    </Text>
                                    <Text style={theme === 'light' ? styles.lightModalText : styles.darkModalText}>
                                        Total: ${total.toFixed(2)}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </Modal>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    transactionsPage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lightPageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
    },
    darkPageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    transactionsList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
    },
    lightBuyButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        alignItems: 'center',
    },
    darkBuyButton: {
        backgroundColor: '#0A84FF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        alignItems: 'center',
    },
    buyButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    lightModalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    darkModalContent: {
        backgroundColor: '#333',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    lightModalText: {
        color: '#000',
        marginBottom: 15,
        textAlign: 'center',
    },
    darkModalText: {
        color: '#fff',
        marginBottom: 15,
        textAlign: 'center',
    },
    lightInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color: '#000',
    },
    darkInput: {
        height: 40,
        borderColor: '#666',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color: '#fff',
    },
    feeContainer: {
        marginVertical: 10,
    },
    confirmationContainer: {
        alignItems: 'center',
    },
});

export default Transactions;