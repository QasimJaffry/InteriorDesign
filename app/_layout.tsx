import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import "react-native-reanimated";

import { ObjectDetectionProviderWrapper } from "@/components/ObjectDetectionProviderWrapper";
import { AuthProvider } from "@/contexts/AuthContext";
import { FurnitureProvider } from "@/contexts/FurnitureContext";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

SplashScreen.preventAutoHideAsync();

const NavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#0f0f12",
    card: "#121218",
    primary: "#c45c5c",
    text: "#eef2f6",
    border: "#2e2e38",
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ObjectDetectionProviderWrapper>
        <FurnitureProvider>
          <ThemeProvider value={NavTheme}>
            <StatusBar barStyle="light-content" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="post-scan"
                options={{
                  presentation: "modal",
                  animation: "slide_from_bottom",
                }}
              />
            </Stack>
            <Toast />
          </ThemeProvider>
        </FurnitureProvider>
      </ObjectDetectionProviderWrapper>
    </AuthProvider>
  );
}
