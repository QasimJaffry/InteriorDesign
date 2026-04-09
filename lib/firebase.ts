import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

type FirebaseExtra = {
  firebaseApiKey: string;
  firebaseAuthDomain: string;
  firebaseProjectId: string;
  firebaseStorageBucket: string;
  firebaseMessagingSenderId: string;
  firebaseAppId: string;
};

export function getExtra(): FirebaseExtra {
  const extra = Constants.expoConfig?.extra as Partial<FirebaseExtra> | undefined;
  return {
    firebaseApiKey: extra?.firebaseApiKey ?? "",
    firebaseAuthDomain: extra?.firebaseAuthDomain ?? "",
    firebaseProjectId: extra?.firebaseProjectId ?? "",
    firebaseStorageBucket: extra?.firebaseStorageBucket ?? "",
    firebaseMessagingSenderId: extra?.firebaseMessagingSenderId ?? "",
    firebaseAppId: extra?.firebaseAppId ?? "",
  };
}

/** True when env / app.config has enough Firebase fields to initialize the SDK. */
export function isFirebaseConfigured(): boolean {
  const e = getExtra();
  return Boolean(
    e.firebaseApiKey?.trim() &&
      e.firebaseProjectId?.trim() &&
      e.firebaseAppId?.trim(),
  );
}

let appInstance: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase is not configured. Add FIREBASE_* env vars or run in offline mode.",
    );
  }
  if (appInstance) {
    return appInstance;
  }
  if (getApps().length > 0) {
    appInstance = getApp();
    return appInstance;
  }
  const extra = getExtra();
  const config = {
    apiKey: extra.firebaseApiKey,
    authDomain: extra.firebaseAuthDomain,
    projectId: extra.firebaseProjectId,
    storageBucket: extra.firebaseStorageBucket,
    messagingSenderId: extra.firebaseMessagingSenderId,
    appId: extra.firebaseAppId,
  };
  appInstance = initializeApp(config);
  return appInstance;
}

export function getFirebaseAuth() {
  const app = getFirebaseApp();
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
}

export function getDb() {
  return getFirestore(getFirebaseApp());
}

export function getFirebaseStorage() {
  return getStorage(getFirebaseApp());
}
