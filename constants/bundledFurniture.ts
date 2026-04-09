import type { Furniture } from "@/types/models";

import raw from "@/data/furniture-seed.json";

/**
 * Offline/demo catalogue shipped with the app (same data as `data/furniture-seed.json`).
 * Used when Firestore `furniture` is empty so Home, AR, and post-scan still show real GLBs.
 */
export const BUNDLED_FURNITURE: Furniture[] = [...(raw as Furniture[])].sort(
  (a, b) => a.name.localeCompare(b.name),
);
