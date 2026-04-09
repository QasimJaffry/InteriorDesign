import AsyncStorage from "@react-native-async-storage/async-storage";

const FAV_KEY = "@interio/local_favourites_v1";
const SCAN_KEY = "@interio/local_scan_v1";

export type LocalScanPayload = {
  detectedType: string;
  confidence: number;
  scannedAtMs: number;
};

export async function loadLocalFavouriteIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(FAV_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

export async function saveLocalFavouriteIds(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(FAV_KEY, JSON.stringify(ids));
}

export async function loadLocalScan(): Promise<LocalScanPayload | null> {
  const raw = await AsyncStorage.getItem(SCAN_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<LocalScanPayload>;
    if (
      typeof parsed.detectedType !== "string" ||
      typeof parsed.confidence !== "number" ||
      typeof parsed.scannedAtMs !== "number"
    ) {
      return null;
    }
    return {
      detectedType: parsed.detectedType,
      confidence: parsed.confidence,
      scannedAtMs: parsed.scannedAtMs,
    };
  } catch {
    return null;
  }
}

export async function saveLocalScan(payload: LocalScanPayload): Promise<void> {
  await AsyncStorage.setItem(SCAN_KEY, JSON.stringify(payload));
}

/** Clears favourites + last scan persisted for offline mode (e.g. “sign out”). */
export async function clearLocalUserData(): Promise<void> {
  await AsyncStorage.multiRemove([FAV_KEY, SCAN_KEY]);
}
