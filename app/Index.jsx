import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBitcoin, faEthereum, faLitecoin, faRipple } from "@fortawesome/free-brands-svg-icons";
import { faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";

const coins = [
  { icon: faBitcoin, name: "Bitcoin", price: 42000.50, change: 2.5 },
  { icon: faEthereum, name: "Ethereum", price: 3000.25, change: -1.3 },
  { icon: faLitecoin, name: "Litecoin", price: 150.75, change: 0.8 },
  { icon: faRipple, name: "Ripple", price: 0.85, change: 3.2 },
  { icon: faMoneyBillWave, name: "Cardano", price: 1.20, change: -0.5 },
];

const CoinCard = ({ icon, name, price, change }) => {
  const changeColor = change >= 0 ? styles.positiveChange : styles.negativeChange;
  return (
    <View style={styles.coinContainer}>
      <FontAwesomeIcon icon={icon} size={30} style={styles.coinIcon} />
      <View style={styles.coinDetails}>
        <Text style={styles.coinName}>{name}</Text>
        <Text style={styles.coinPrice}>${price.toFixed(2)}</Text>
      </View>
      <View style={styles.changeContainer}>
        <Text style={[styles.changeText, changeColor]}>
          {change.toFixed(2)}%
        </Text>
      </View>
    </View>
  );
};

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crypto Prices</Text>
      <ScrollView>
        {coins.map((coin, index) => (
          <CoinCard key={index} {...coin} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#222831",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#393E46",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    elevation: 5, 
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  coinIcon: {
    color: "#fff",
    marginRight: 20,
  },
  coinDetails: {
    flex: 1,
  },
  coinName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  coinPrice: {
    fontSize: 14,
    color: "#fff",
  },
  changeContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  changeText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  positiveChange: {
    color: "#00C853",
  },
  negativeChange: {
    color: "#FF1744",
  },
});