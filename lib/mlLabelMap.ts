/**
 * Maps Google ML Kit default detector labels to catalogue `furniture.type`.
 *
 * The default MLKit Object Detection model returns broad categories:
 *   "Home good", "Fashion good", "Food & drink", "Place & object", "Plant"
 * These are listed first. If a custom COCO-style model is loaded later, the
 * specific labels below will take precedence via the lookup order.
 */
const LABEL_TO_TYPE: Record<string, string> = {
  // ── MLKit default model broad categories ─────────────────────────────────
  "home good": "sofa",        // catch-all for household furniture
  "place & object": "decor",
  plant: "decor",
  "potted plant": "decor",

  // ── COCO / custom model specific labels ──────────────────────────────────
  chair: "chair",
  couch: "sofa",
  sofa: "sofa",
  "park bench": "bench",
  bench: "bench",
  stool: "chair",
  bed: "bed",
  "dining table": "table",
  table: "table",
  desk: "desk",
  tv: "media",
  television: "media",
  laptop: "desk",
  vase: "decor",
  clock: "decor",
  book: "shelf",
  refrigerator: "appliance",
  microwave: "appliance",
  oven: "appliance",
  toaster: "appliance",
  sink: "bath",
  toilet: "bath",
  bathtub: "bath",
  lamp: "lamp",
  bottle: "decor",
  cup: "decor",
  bowl: "decor",
  carpet: "decor",
  rug: "decor",
  shelf: "shelf",
  bookshelf: "shelf",
};

/** Types that exist in the catalogue — unknown slugs are rejected. */
const KNOWN_TYPES = new Set<string>([
  "chair", "sofa", "table", "bed", "lamp", "desk",
  "shelf", "decor", "media", "bath", "appliance", "bench",
]);

export function mapLabelToFurnitureType(label: string): string {
  const key = label.trim().toLowerCase();
  if (LABEL_TO_TYPE[key]) {
    return LABEL_TO_TYPE[key];
  }
  const normalized = key.replace(/_/g, " ");
  if (LABEL_TO_TYPE[normalized]) {
    return LABEL_TO_TYPE[normalized];
  }
  const compact = key.replace(/\s+/g, "");
  for (const [k, v] of Object.entries(LABEL_TO_TYPE)) {
    if (k.replace(/\s+/g, "") === compact) {
      return v;
    }
  }
  return normalized.replace(/\s+/g, "-");
}

const MIN_CONFIDENCE = 0.35;

export function bestDetectionFromLabels(
  labels: { text: string; confidence: number }[],
): { type: string; confidence: number } | null {
  if (!labels.length) {
    return null;
  }
  const sorted = [...labels].sort((a, b) => b.confidence - a.confidence);
  for (const label of sorted) {
    if (label.confidence < MIN_CONFIDENCE) break;
    const type = mapLabelToFurnitureType(label.text);
    if (KNOWN_TYPES.has(type)) {
      return { type, confidence: label.confidence };
    }
  }
  return null;
}

/** Returns all unique detected types above confidence threshold, ordered by confidence. */
export function allDetectionsFromLabels(
  labels: { text: string; confidence: number }[],
): { type: string; confidence: number }[] {
  if (!labels.length) return [];
  const sorted = [...labels].sort((a, b) => b.confidence - a.confidence);
  const seen = new Set<string>();
  const results: { type: string; confidence: number }[] = [];
  for (const label of sorted) {
    if (label.confidence < MIN_CONFIDENCE) break;
    const type = mapLabelToFurnitureType(label.text);
    if (KNOWN_TYPES.has(type) && !seen.has(type)) {
      seen.add(type);
      results.push({ type, confidence: label.confidence });
    }
  }
  return results;
}
