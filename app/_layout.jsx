import { Slot } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Expo App</Text>
      <Slot />
      <Text style={styles.footer}>© 2023</Text>
    </View>
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
    backgroundColor:"red",
    color:"white",
    textAlign:"center"
  },
  footer: {
    marginTop: 10,
    textAlign: 'center',
  },
});
