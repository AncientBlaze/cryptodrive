import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function RootLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="wallet" options={{ headerShown: false }} />
            <Tabs.Screen name="about" options={{ headerShown: false }} />
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
