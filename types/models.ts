import type { Timestamp } from "firebase/firestore";

export type Furniture = {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
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
