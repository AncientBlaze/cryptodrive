// app/_layout.js
import { Stack } from "expo-router";
import { useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import useIdStore from "../store/credentialStore";

export default function RootLayout() {
  // 1️⃣ subscribe reactively to your id
  const id = useIdStore((state) => state.id);

  // 2️⃣ lock portrait
  useEffect(() => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT
    );
  }, []);

  // 3️⃣ decide which screens to *declare*
  const screens = !id
    ? [
        { name: "login" },
        { name: "register" },
      ]
    : [
        { name: "index" },
        { name: "(tabs)" },
        { name: "gotokyc" },
        { name: "KYCPage" },
        { name: "profile" },
        {
          name: "chatWithUs",
          options: { headerShown: true, title: "Chat With Us" },
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
