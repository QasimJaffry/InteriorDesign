import type { ImageSourcePropType } from "react-native";
import type { Timestamp } from "firebase/firestore";

export type Furniture = {
  id: string;
  name: string;
  type: string;
  /** Remote thumbnail (Firestore catalogue). */
  imageUrl?: string;
  /** Bundled local thumbnail (offline catalogue). */
  image?: ImageSourcePropType;
  modelUrl: string;
};

export type FavouriteDoc = {
  furnitureId: string;
  savedAt: Timestamp;
};

export type ScanResultDoc = {
  detectedType: string;
  confidence: number;
  scannedAt: Timestamp;
};

export type UserProfileDoc = {
  name: string;
  email: string;
};
