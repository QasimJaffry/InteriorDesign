# Interio

Scan a room, detect furniture **on-device**, and place true-scale pieces in **AR** before you buy.

Started as a university FYP; still iterated as a React Native / Expo app. GitHub repo: `InteriorDesign`.

---

## Features

- **On-device furniture scan** — ML Kit object detection on a single photo (no server round-trip for classification)
- **AR placement** — true-scale GLB models via ViroReact; drag, pinch, twist
- **Catalogue** — browse / search with category filter from the last scan
- **Saved items** — favourites in Firestore; local cache when offline
- **Auth** — email/password via Firebase Auth
- **Offline** — scan results and saves via AsyncStorage + file system

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo **SDK 53** · Expo Router · React Native **0.79** · TypeScript |
| State | Zustand |
| Backend | Firebase Auth · Firestore |
| On-device ML | `@infinitered/react-native-mlkit-object-detection` (ML Kit) |
| AR | `@reactvision/react-viro` (ViroReact) |
| Camera | `expo-camera` |
| Offline | AsyncStorage · `expo-file-system` |

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
