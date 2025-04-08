import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import useThemeStore from '../../store/themeStore.js';

export default function RootLayout() {
    const theme = useThemeStore((state) => state.theme);

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF',
                    borderTopColor: theme === 'dark' ? '#333' : '#e0e0e0',
                },
                tabBarActiveTintColor: theme === 'dark' ? '#BB86FC' : '#6200EE',
                tabBarInactiveTintColor: theme === 'dark' ? '#888' : '#757575',
            }}
        >
            <Tabs.Screen
                name="wallet"
                options={{
                    headerShown: false,
                    tabBarLabel: 'Wallet',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="account-balance-wallet" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="transactions"
                options={{
                    headerShown: false,
                    tabBarLabel: 'Transactions',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialIcons name="toll" color={color} size={size} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="setting"
                options={{
                    headerShown: false,
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="settings" color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: "center"
    },
    footer: {
        marginTop: 10,
        textAlign: 'center',
    },
});