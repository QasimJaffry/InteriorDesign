# INTERIO

An AI-powered interior design app built with React Native and Expo. Point your camera at a room, identify furniture with on-device machine learning, and visualise new pieces in augmented reality before you buy.

---

## Features

- **AI Furniture Scanning** — Capture a single photo and ML Kit's object detection model identifies the furniture category on-device. No server round-trip required.
- **Augmented Reality Placement** — Place true-to-scale 3D furniture models anywhere in your room. Drag to reposition, pinch to scale, and twist to rotate each piece freely.
- **Furniture Catalogue** — Browse and search a full catalogue with category filtering driven by your last scan result.
- **Saved Items** — Favourite pieces sync to your account via Firestore and persist locally when offline.
- **Authentication** — Email/password sign-up, login, and password reset via Firebase Auth.
- **Offline Support** — Scan results and saved items are stored locally with AsyncStorage so the app works without a network connection.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev) SDK 53 · Expo Router (file-based routing) |
| Language | TypeScript (strict) |
| UI | React Native 0.79 |
| State management | [Zustand](https://github.com/pmndrs/zustand) |
| Backend | Firebase — Firestore + Authentication |
| On-device ML | [ML Kit Object Detection](https://github.com/infinitered/react-native-mlkit) (`@infinitered/react-native-mlkit-object-detection`) |
| Augmented reality | [ViroReact](https://github.com/ReactVision/react-viro) (`@reactvision/react-viro`) |
| Camera | `expo-camera` |
| Offline storage | `@react-native-async-storage/async-storage` + `expo-file-system` |

---

## Project Structure

```
app/
  (auth)/           # Login, signup, forgot password screens
  (tabs)/           # Home, Camera, AR, Saved, Profile tabs
  post-scan.tsx     # Scan results — layout tips + suggested catalogue pieces

components/
  ar/               # ViroReact AR scene and interactive furniture placement
  camera/           # Camera viewfinder and ML Kit scan trigger

contexts/           # AuthProvider, FurnitureProvider
hooks/              # useScanResult, useFavourites, useFurniture, …
lib/                # Firebase initialisation, ML label mapping, local storage
store/              # Zustand store (scan filter, saved IDs)
constants/          # Room suggestion copy per furniture category
types/              # Shared TypeScript models
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Xcode (iOS) or Android Studio (Android)
- A **physical device** — ML Kit and AR do not work in simulators or Expo Go

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your Firebase project values:

```bash
cp .env.example .env
```

| Variable | Where to find it |
|---|---|
| `FIREBASE_API_KEY` | Firebase Console → Project settings → Your apps → Web API key |
| `FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` |
| `FIREBASE_PROJECT_ID` | Project ID |
| `FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` |
| `FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
| `FIREBASE_APP_ID` | App ID |

These are injected at build time via `app.config.ts` into `expo-constants`.

### 3. Firebase project setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication → Email/Password**
3. Enable **Firestore Database**
4. Deploy security rules: `firebase deploy --only firestore:rules`

### Firestore schema

```
furniture/{id}
  name, type, imageUrl, modelUrl (GLB URL), price, description

users/{uid}/scanResult/latest
  detectedType, confidence, scannedAt

users/{uid}/favourites/{furnitureId}
  furnitureId, savedAt
```

### 4. Run

```bash
npx expo run:ios      # iOS
npx expo run:android  # Android
```

> Use `expo run:*` not `expo start` — ViroReact and ML Kit require a native development build.

After changing native config or adding plugins:

```bash
npx expo prebuild --clean
```

---

## Permissions

| Permission | Reason |
|---|---|
| Camera | Furniture scanning and AR |
| Microphone | Required by the AR framework |

---

## Scripts

| Command | Description |
|---|---|
| `npm run ios` | Build and run on iOS |
| `npm run android` | Build and run on Android |
| `npm run web` | Start web build (camera/AR show placeholders) |
| `npm test` | Run Jest tests |

---

## Notes

- **New Architecture** is enabled (`newArchEnabled: true`) — required by ViroReact.
- **Web**: Firebase, auth, and the catalogue work fully. Camera scanning and AR display placeholder screens.
- ML Kit label-to-category mapping lives in `lib/mlLabelMap.ts` — extend it to support additional furniture types.
