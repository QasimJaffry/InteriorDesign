import "dotenv/config";
import type { ExpoConfig, ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "INTERIO",
  slug: "interio",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "interio",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#0f0f12",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.interio.app",
    infoPlist: {
      NSCameraUsageDescription:
        "INTERIO uses the camera for room scanning and AR furniture placement.",
      NSMicrophoneUsageDescription:
        "INTERIO may use the microphone with AR features.",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#0f0f12",
    },
    package: "com.interio.app",
    permissions: ["CAMERA", "RECORD_AUDIO"],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-font",
    "expo-web-browser",
    "expo-asset",
    [
      "expo-camera",
      {
        cameraPermission:
          "Allow INTERIO to access your camera for scanning and AR.",
        microphonePermission:
          "Allow INTERIO to use the microphone for AR recording if needed.",
      },
    ],
    [
      "@reactvision/react-viro",
      {
        ios: {
          cameraUsagePermission: "Allow INTERIO to use AR.",
          microphoneUsagePermission: "Allow INTERIO to use the microphone.",
          photosPermission: "Allow INTERIO to read photos.",
          savePhotosPermission: "Allow INTERIO to save photos.",
        },
        android: {
          xRMode: ["AR"],
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    firebaseApiKey: process.env.FIREBASE_API_KEY ?? "",
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN ?? "",
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID ?? "",
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? "",
    firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ?? "",
    firebaseAppId: process.env.FIREBASE_APP_ID ?? "",
  },
});
