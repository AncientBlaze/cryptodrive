import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

<StatusBar hidden />

export default function RootLayout() {
  
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="gotokyc" options={{ headerShown: false }} />
      <Stack.Screen name="KYCPage" options={{ headerShown: false }} />
      <Stack.Screen name='+not-found' options={{ headerShown: false }} />
    </Stack>
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
