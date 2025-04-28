import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
<StatusBar hidden />
import useIdStore from "../store/credentialStore.js";

const { id } = useIdStore.getState();

console.log(`User ID: ${id}`);

export default function RootLayout() {

  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="gotokyc" />
      <Stack.Screen name="KYCPage" />
      <Stack.Screen name='+not-found' />
      <Stack.Screen name='profile' />
      <Stack.Screen name='chatWithUs' options={{headerShown: true,title: "Chat With Us"}}/>
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
