import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function RootLayout() {
    return (
        <Tabs>
            <Tabs.Screen 
                name="wallet" 
                options={{ 
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="account-balance-wallet" color={color} size={size} />
                    )
                }} 
            />
            <Tabs.Screen 
                name="setting" 
                options={{ 
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="settings" color={color} size={size} />
                    )
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

