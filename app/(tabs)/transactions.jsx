import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useThemeStore from '../../store/themeStore';

const Transactions = () => {
	const theme = useThemeStore((state) => state.theme);
	const [transactions, setTransactions] = useState([]);

	const getUserTransactions = async () => {
		try {
			const response = await axios.get('https://really-classic-moray.ngrok-free.app/transactions/get');
			const data = response.data.data;
			setTransactions(data);
		} catch (error) {
			console.error('Error fetching transactions:', error.message);
		}
	};

	useEffect(() => {
		getUserTransactions();
	}, []);

	const renderTransaction = ({ item }) => (
		<>
			<TouchableOpacity onPress={() => console.log(item.buyer.fullName)}>
				<Text style={[styles.button, { color: theme === 'dark' ? '#fff' : '#000' }]}>Buy Coins</Text>
			</TouchableOpacity>
			<View style={[styles.transaction, { backgroundColor: theme === 'dark' ? '#1c1c1e' : '#f2f2f7' }]}>
				<View style={[styles.transaction, { backgroundColor: theme === 'dark' ? '#1c1c1e' : '#f2f2f7' }]}>
					<Text style={[styles.text, styles.idText, { color: theme === 'dark' ? '#fff' : '#000' }]}>{item.buyer.fullName}</Text>
					<View style={styles.transactionDetails}>
						<Text style={[styles.text, { color: theme === 'dark' ? '#fff' : '#000' }]}>{item.amount} {item.currency}</Text>
						<Text style={[styles.text, { color: theme === 'dark' ? '#fff' : '#000' }]}>{item.type}</Text>
						<Text style={[styles.text, { color: item.status ? '#28A745' : '#DC3545' }]}>{item.status ? 'Completed' : 'Pending'}</Text>
						<Text style={[styles.text, { color: theme === 'dark' ? '#fff' : '#000' }]}>{new Date(item.updatedAt).toLocaleString()}</Text>
					</View>
				</View>
			</View>
		</>
	);

	return (
		<View style={[styles.container, { backgroundColor: theme === 'dark' ? '#000' : '#fff' }]}>
			<Text style={[styles.header, { color: theme === 'dark' ? '#fff' : '#000' }]}>Transactions</Text>
			<FlatList
				data={transactions}
				renderItem={renderTransaction}
				keyExtractor={(item) => item._id}
				contentContainerStyle={styles.list}
			/>
		</View>
	);
};

export default Transactions;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	header: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	list: {
		paddingBottom: 20,
	},
	transaction: {
		padding: 15,
		marginBottom: 10,
		borderRadius: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 3,
	},
	transactionDetails: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	text: {
		fontSize: 16,
	},
	idText: {
		fontSize: 12,
		color: '#6c757d',
		marginBottom: 5,
	},
	button: {
		backgroundColor: '#007bff',
		color: '#fff',
		padding: 10,
		borderRadius: 5,
		textAlign: 'center',
		marginBottom: 10,
	},
});

