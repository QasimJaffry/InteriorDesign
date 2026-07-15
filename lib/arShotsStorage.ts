import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

const AR_SHOTS_KEY = "@interio/ar_shots_v1";

export type ArShot = {
  id: string;
  /** Absolute file:// path under documentDirectory */
  uri: string;
  createdAt: number;
  pieceCount: number;
  pieceNames: string[];
};

async function shotsDir(): Promise<string> {
  const dir = `${FileSystem.documentDirectory}ar-shots/`;
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
  return dir;
}

export async function loadArShots(): Promise<ArShot[]> {
  const raw = await AsyncStorage.getItem(AR_SHOTS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is ArShot =>
        !!x &&
        typeof x === "object" &&
        typeof (x as ArShot).id === "string" &&
        typeof (x as ArShot).uri === "string" &&
        typeof (x as ArShot).createdAt === "number",
    );
  } catch {
    return [];
  }
}

async function persistMeta(shots: ArShot[]): Promise<void> {
  await AsyncStorage.setItem(AR_SHOTS_KEY, JSON.stringify(shots));
}

/**
 * Persist a Viro screenshot into app documents and index it for Saved.
 * `sourceUri` is whatever takeScreenshot returned (often without file://).
 */
export async function saveArShotFromCapture(input: {
  sourceUri: string;
  pieceNames: string[];
}): Promise<ArShot> {
  const id = `ar-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const dir = await shotsDir();
  const dest = `${dir}${id}.jpg`;
  let from = input.sourceUri;
  if (!from.startsWith("file://") && from.startsWith("/")) {
    from = `file://${from}`;
  }
  await FileSystem.copyAsync({ from, to: dest });
  const shot: ArShot = {
    id,
    uri: dest,
    createdAt: Date.now(),
    pieceCount: input.pieceNames.length,
    pieceNames: input.pieceNames,
  };
  const prev = await loadArShots();
  await persistMeta([shot, ...prev]);
  return shot;
}

export async function deleteArShot(id: string): Promise<void> {
  const prev = await loadArShots();
  const target = prev.find((s) => s.id === id);
  const next = prev.filter((s) => s.id !== id);
  await persistMeta(next);
  if (target?.uri) {
    await FileSystem.deleteAsync(target.uri, { idempotent: true });
  }
}
