/**
 * Canonical `furniture.type` strings used by the catalogue, scan filter, and ML label map.
 * Keep new Firestore `furniture` docs aligned with these values.
 */
export const FURNITURE_TYPES = [
  "chair",
  "sofa",
  "table",
  "bed",
  "lamp",
  "desk",
  "shelf",
  "decor",
  "media",
  "bath",
  "appliance",
  "bench",
] as const;

export type FurnitureTypeId = (typeof FURNITURE_TYPES)[number];
