import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from "@expo-google-fonts/cormorant-garamond";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";
import {
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import "react-native-reanimated";

import { ObjectDetectionProviderWrapper } from "@/components/ObjectDetectionProviderWrapper";
import { toastConfig } from "@/components/toastConfig";
import { AuthProvider } from "@/contexts/AuthContext";
import { FurnitureProvider } from "@/contexts/FurnitureContext";
import { palette } from "@/constants/theme";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

SplashScreen.preventAutoHideAsync();

const NavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.bg,
    card: palette.bg,
    primary: palette.sage,
    text: palette.text,
    border: palette.borderSubtle,
    notification: palette.sage,
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    CormorantGaramond_500Medium,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      void SystemUI.setBackgroundColorAsync(palette.bg);
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
            <StatusBar style="dark" backgroundColor={palette.bg} />
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
            <Toast config={toastConfig} />
          </ThemeProvider>
        </FurnitureProvider>
      </ObjectDetectionProviderWrapper>
    </AuthProvider>
  );
}
