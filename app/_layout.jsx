// app/_layout.js
import { Stack } from "expo-router";
import { useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import useIdStore from "../store/credentialStore";
import useThemeStore from "../store/themeStore";

export default function RootLayout() {
  // 1️⃣ subscribe reactively to your id
  const id = useIdStore((state) => state.id);
  const theme = useThemeStore((state) => state.theme);
  // 2️⃣ lock portrait
  useEffect(() => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT
    );
  }, []);

  // 3️⃣ decide which screens to *declare*
  const screens = !id
    ? [
        { name: "index" },
        { name: "login" },
        { name: "register" },
      ]
    : [
        { name: "(tabs)" },
        { name: "gotokyc" },
        { name: "KYCPage" },
        { name: "profile" },
        {
          name: "chatWithUs",
          options: {
            headerShown: true,
            title: "Chat With Us",
            headerStyle: {
              backgroundColor: theme === "dark" ? "#1F1F1F" : "#fff",
            },
            headerTintColor: theme === "dark" ? "#fff" : "#000",
            headerTitleStyle: {
              fontWeight: "bold",
              color: theme === "dark" ? "#fff" : "#000",
            },
          },
        },
      ];

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {screens.map((s) => (
        <Stack.Screen
          key={s.name}
          name={s.name}
          {...(s.options && { options: s.options })}
        />
      ))}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
