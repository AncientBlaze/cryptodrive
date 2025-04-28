import { Tabs, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import useThemeStore from "../../store/themeStore";

export default function RootLayout() {
  const theme = useThemeStore((state) => state.theme);
  const router = useRouter();

  const handleBackButtonPress = () => {
    router.back();
  };

  const tabScreenOptions = {
    headerStyle: {
      backgroundColor: theme === "dark" ? "#121212" : "#FFFFFF",
      shadowColor: theme === "dark" ? "#BB86FC33" : "#6200EE33",
      elevation: 4,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
    headerTitleStyle: {
      color: theme === "dark" ? "#FFFFFF" : "#000000",
      fontWeight: "600",
      fontSize: 18,
    },
    headerTitleAlign: "left",
    headerTitleContainerStyle: {
      marginLeft: 40,
    },
  };

  const renderAnimatedBackButton = () => (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutUp.duration(200)}
    >
      <TouchableOpacity style={styles.backButtonContainer}>
        <MaterialIcons
          name="arrow-back"
          size={24}
          color={theme === "dark" ? "#FFFFFF" : "#000000"}
          onPress={handleBackButtonPress}
        />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme === "dark" ? "#121212" : "#FFFFFF",
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
          height: 60,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarItemStyle: {
          height: 48,
        },
        tabBarActiveTintColor: theme === "dark" ? "#BB86FC" : "#6200EE",
        tabBarInactiveTintColor: theme === "dark" ? "#888" : "#757575",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 4,
        },
        ...tabScreenOptions,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          headerShown: false,
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="wallet"
        options={{
          headerTitle: "Wallet",
          tabBarLabel: "Wallet",
          headerLeft: renderAnimatedBackButton,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="account-balance-wallet"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          headerTitle: "Transactions",
          tabBarLabel: "Transactions",
          headerLeft: renderAnimatedBackButton,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="swap-horiz" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="setting"
        options={{
          headerTitle: "Settings",
          tabBarLabel: "Settings",
          headerLeft: renderAnimatedBackButton,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  backButtonContainer: {
    marginLeft: 16,
    marginRight: 8,
    padding: 8,
    borderRadius: 24,
  },
});
