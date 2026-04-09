# INTERIO — AI Interior Design Assistant

Expo (SDK 52) + Expo Router + TypeScript (strict) + Zustand + Firebase + Google ML Kit (object detection) + ViroReact (AR).

## Prerequisites

- Node.js 18+
- For **native** features (ML Kit, Viro AR, camera): a **development build** (`expo-dev-client`). Expo Go does not include these native modules.
- iOS: Xcode / Android: Android Studio for local native builds.

## Install

```bash
npm install
```

## Environment variables

Copy `.env.example` to `.env` in the project root and fill in values from the Firebase console (Project settings → Your apps).

| Variable | Description |
|----------|-------------|
| `FIREBASE_API_KEY` | Web API key |
| `FIREBASE_AUTH_DOMAIN` | `project.firebaseapp.com` |
| `FIREBASE_PROJECT_ID` | Project ID |
| `FIREBASE_STORAGE_BUCKET` | Storage bucket (e.g. `project.appspot.com`) |
| `FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
| `FIREBASE_APP_ID` | App ID |

These are injected at build time via `app.config.ts` into `expo-constants` (`Constants.expoConfig.extra`).

## Firebase project setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Authentication** → Sign-in method → **Email/Password**.
3. Create **Firestore** database (production mode, then deploy rules below).
4. Create **Storage** for GLB/GLTF furniture assets (optional rules: restrict writes to admins; reads can be public for catalogue models).
5. Add a **Web** app to obtain the config values for `.env`.

### Firestore collections

- **`furniture`** (root collection): documents `{ name, type, imageUrl, modelUrl }` (document ID = stable id).
- **`users/{uid}`**: profile `{ name, email, createdAt }` (written on sign-up).
- **`users/{uid}/favourites/{furnitureId}`**: `{ furnitureId, savedAt }`.
- **`users/{uid}/scanResult/latest`**: `{ detectedType, confidence, scannedAt }` (single doc id `latest`).

Deploy `firestore.rules` from this repo (adjust if your admin workflow differs):

```bash
firebase deploy --only firestore:rules
```

### Storage

Upload GLB/GLB models and reference their **download URLs** in `furniture.modelUrl`. Ensure rules allow authenticated or public read as appropriate.

### Sample `furniture` document

```json
{
  "name": "Lounge Chair",
  "type": "chair",
  "imageUrl": "https://example.com/chair.jpg",
  "modelUrl": "https://firebasestorage.googleapis.com/.../chair.glb"
}
```

### Furniture-focused starter catalogue (included)

**`data/furniture-seed.json`** lists **11 real interior pieces** (chairs, sofa, tables, lamps, shelf, rug, bench, retro screen) as **CC0** assets from **Polygonal Mind**, hosted on GitHub:

- Repo: [`ToxSam/cc0-models-Polygonal-Mind`](https://github.com/ToxSam/cc0-models-Polygonal-Mind) (projects `avatar-show`, `ca-world`, `chromatic-chaos`).
- Registry / metadata: [`ToxSam/open-source-3D-assets`](https://github.com/ToxSam/open-source-3D-assets) (`data/assets/*.json`).

These are **actual furniture / décor GLBs** (not Khronos shader demos). `imageUrl` uses each model’s **official thumbnail PNG** next to the `.glb` on the same tree.

Because client apps **cannot write** `furniture` (see `firestore.rules`), populate Firestore with the Admin script:

1. In Firebase Console → **Project settings** → **Service accounts** → **Generate new private key** (JSON file).
2. Run (absolute path to the JSON file):

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your-service-account.json"
npm run seed:furniture
```

This writes the seed documents (ids like `pm-sofa`, `pm-table`). Re-run anytime to overwrite those docs.

For production, you may still **mirror** files to **Firebase Storage** and swap in your own `modelUrl` / `imageUrl` for reliability and bandwidth.

## Run

```bash
npx expo start
```

- **Web**: UI and Firebase work; camera ML Kit and Viro AR show placeholders.
- **iOS / Android (dev client)**:

```bash
npx expo run:ios
npx expo run:android
```

After changing native config or plugins:

```bash
npx expo prebuild --clean
```

## Native modules note

| Feature | Package | Notes |
|--------|---------|--------|
| Object detection | `@infinitered/react-native-mlkit-object-detection` | Requires dev build; uses default ML Kit model; labels are mapped to catalogue `type` in `lib/mlLabelMap.ts`. |
| AR | `@reactvision/react-viro` | Requires **New Architecture** (`newArchEnabled: true` in config). Peer deps may warn; `.npmrc` uses `legacy-peer-deps`. |

## Router

This project uses **Expo Router 4** (the version aligned with Expo SDK 52). Tabs: **Home**, **Scan** (camera), **AR**, **Saved**, **Profile**.

After a **successful room scan** (camera capture), the app opens **`/post-scan`**: layout tips for that category plus **suggested catalogue pieces** (matches first, then complementary types). Copy lives in `constants/roomSuggestions.ts`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Metro |
| `npm run ios` / `npm run android` | Start with Expo CLI |
| `npm run web` | Web build |
| `npm run seed:furniture` | Seed Firestore `furniture` (requires `GOOGLE_APPLICATION_CREDENTIALS`) |
| `npm test` | Jest (if configured) |

## Project layout (high level)

- `app/` — Expo Router screens (`(auth)`, `(tabs)`, root `index` redirect).
- `contexts/` — `AuthProvider`, `FurnitureProvider` (single catalogue subscription).
- `hooks/` — Firebase: `useAuth`, `useUserProfile`, `useScanResult`, `useFavourites`, `useSavedFurniture`, `useDebouncedValue`.
- `lib/` — Firebase init, ML label mapping (`mlLabelMap.ts` maps detector labels → `furniture.type`).
- `data/furniture-seed.json` — starter furniture rows (Khronos sample GLBs).
- `constants/furnitureTypes.ts` — canonical `type` strings for your catalogue.
- `store/` — Zustand (`scanFilter`, `savedIds`).
- `components/` — UI pieces, camera/AR native screens.
- `firestore.rules` — Security rules reference.

## Troubleshooting

- **Firebase “missing or insufficient permissions”**: Deploy Firestore rules; ensure the user is signed in and paths match `users/{uid}/...`.
- **Auth persistence**: Uses `getReactNativePersistence` + AsyncStorage (see `lib/firebase.ts` and `types/firebase-auth-rn.d.ts`).
- **Viro / ML Kit build errors**: Run `expo prebuild`, use EAS or local `expo run:*`, and install CocoaPods on iOS.
