// All images from Unsplash (free to use, no attribution required under Unsplash License).
// Long-form URLs: images.unsplash.com/photo-{hash}
// Short-form URLs: source.unsplash.com/{id}/800x600 (still functional for static embeds)

export type InspirationItem = {
  id: string;
  url: string;
  label: string;
  category:
    | "living_room"
    | "bedroom"
    | "kitchen"
    | "dining"
    | "bathroom"
    | "home_office"
    | "hallway";
  // matches detectedType from scan results (chair, sofa, table, lamp, shelf, bench,
  // media, decor, bed, desk, bath, appliance)
  tags: string[];
  style:
    | "modern"
    | "scandinavian"
    | "boho"
    | "industrial"
    | "minimalist"
    | "luxury"
    | "cozy"
    | "classic";
};

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`;
const s = (id: string) =>
  `https://source.unsplash.com/${id}/800x600`;

export const INSPIRATION_DATA: InspirationItem[] = [
  // ── LIVING ROOM ────────────────────────────────────────────────────────────
  {
    id: "lr-01",
    url: u("1555041469-a586c61ea9bc"),
    label: "Green velvet sofa",
    category: "living_room",
    tags: ["sofa", "chair"],
    style: "modern",
  },
  {
    id: "lr-02",
    url: u("1586023492125-27b2c045efd7"),
    label: "White modern living room",
    category: "living_room",
    tags: ["sofa"],
    style: "scandinavian",
  },
  {
    id: "lr-03",
    url: u("1631679706909-1844bbd07221"),
    label: "Bright airy living room",
    category: "living_room",
    tags: ["sofa", "chair"],
    style: "minimalist",
  },
  {
    id: "lr-04",
    url: u("1583847268964-b28dc8f51f92"),
    label: "Cozy warm living room",
    category: "living_room",
    tags: ["sofa", "lamp"],
    style: "cozy",
  },
  {
    id: "lr-05",
    url: u("1615874959474-d609969a20ed"),
    label: "Warm earth-tone lounge",
    category: "living_room",
    tags: ["sofa", "chair"],
    style: "modern",
  },
  {
    id: "lr-06",
    url: u("1600585154340-be6161a56a0c"),
    label: "Modern bright living room",
    category: "living_room",
    tags: ["sofa"],
    style: "minimalist",
  },
  {
    id: "lr-07",
    url: u("1600566753086-00f18fb6b3ea"),
    label: "Open-plan living & dining",
    category: "living_room",
    tags: ["sofa", "table"],
    style: "modern",
  },
  {
    id: "lr-08",
    url: u("1616046229478-9901c5536a45"),
    label: "Light Scandi living room",
    category: "living_room",
    tags: ["sofa"],
    style: "scandinavian",
  },
  {
    id: "lr-09",
    url: u("1582063289852-62e3ba2747f8"),
    label: "Stylish urban living room",
    category: "living_room",
    tags: ["sofa", "chair"],
    style: "modern",
  },
  {
    id: "lr-10",
    url: u("1513694203232-719a280e022f"),
    label: "Grey sofa & bookshelf",
    category: "living_room",
    tags: ["sofa", "shelf"],
    style: "minimalist",
  },
  {
    id: "lr-11",
    url: u("1558618666-fcd25c85cd64"),
    label: "Boho living room with plants",
    category: "living_room",
    tags: ["sofa", "decor"],
    style: "boho",
  },
  {
    id: "lr-12",
    url: s("uZJ1oCw7qeg"),
    label: "Minimalist elegant lounge",
    category: "living_room",
    tags: ["sofa", "chair"],
    style: "minimalist",
  },
  {
    id: "lr-13",
    url: s("NUnjEA9qEHE"),
    label: "Leather sofa & fireplace",
    category: "living_room",
    tags: ["sofa", "chair"],
    style: "classic",
  },
  {
    id: "lr-14",
    url: s("fv5STqXIp6Y"),
    label: "Bright open-kitchen living",
    category: "living_room",
    tags: ["sofa", "table"],
    style: "modern",
  },
  {
    id: "lr-15",
    url: s("VLdcgeVoiIY"),
    label: "Minimalist open-plan space",
    category: "living_room",
    tags: ["sofa", "table"],
    style: "minimalist",
  },
  {
    id: "lr-16",
    url: s("ps4hpOCj9eo"),
    label: "Modern living with kitchen",
    category: "living_room",
    tags: ["sofa", "table"],
    style: "modern",
  },
  {
    id: "lr-17",
    url: s("8086_Qqe9XI"),
    label: "Elegant furniture lounge",
    category: "living_room",
    tags: ["sofa", "chair"],
    style: "luxury",
  },
  {
    id: "lr-18",
    url: s("sLTpOqT4BeE"),
    label: "Sleek contemporary living",
    category: "living_room",
    tags: ["sofa"],
    style: "modern",
  },
  {
    id: "lr-19",
    url: s("ARgCwJgIFgQ"),
    label: "Cozy eclectic living room",
    category: "living_room",
    tags: ["sofa", "decor"],
    style: "cozy",
  },
  {
    id: "lr-20",
    url: s("H7c41wxagPc"),
    label: "Light-filled living room",
    category: "living_room",
    tags: ["sofa"],
    style: "scandinavian",
  },
  {
    id: "lr-21",
    url: s("IlNHSsfTunM"),
    label: "City-view minimalist lounge",
    category: "living_room",
    tags: ["sofa"],
    style: "minimalist",
  },
  {
    id: "lr-22",
    url: s("JA7LtH0uC-Q"),
    label: "Bright cozy sofa with plant",
    category: "living_room",
    tags: ["sofa", "decor"],
    style: "cozy",
  },
  {
    id: "lr-23",
    url: s("52Tlxrb59qQ"),
    label: "Open living & dining area",
    category: "living_room",
    tags: ["sofa", "table"],
    style: "modern",
  },
  {
    id: "lr-24",
    url: s("owVINZxTUHA"),
    label: "Gallery-wall living room",
    category: "living_room",
    tags: ["sofa", "decor"],
    style: "boho",
  },
  {
    id: "lr-25",
    url: s("h3395U8bxAY"),
    label: "Purple accent sofa",
    category: "living_room",
    tags: ["sofa", "chair"],
    style: "boho",
  },
  {
    id: "lr-26",
    url: s("0VnvJtWrk2U"),
    label: "Warm-tone open living",
    category: "living_room",
    tags: ["sofa"],
    style: "modern",
  },
  {
    id: "lr-27",
    url: s("raMejfP1E4o"),
    label: "Dark minimalist apartment",
    category: "living_room",
    tags: ["sofa"],
    style: "modern",
  },
  {
    id: "lr-28",
    url: s("4r9OKorlcTk"),
    label: "All-white minimalist living",
    category: "living_room",
    tags: ["sofa", "chair"],
    style: "minimalist",
  },
  {
    id: "lr-29",
    url: s("hZE6VQVbMco"),
    label: "Living room meets kitchen",
    category: "living_room",
    tags: ["sofa", "table"],
    style: "modern",
  },
  {
    id: "lr-30",
    url: s("Kac7kzYJP7M"),
    label: "Scandinavian living concept",
    category: "living_room",
    tags: ["sofa"],
    style: "scandinavian",
  },

  // ── BEDROOM ────────────────────────────────────────────────────────────────
  {
    id: "bd-01",
    url: u("1540518614846-7eded433c457"),
    label: "White minimal bedroom",
    category: "bedroom",
    tags: ["bed"],
    style: "scandinavian",
  },
  {
    id: "bd-02",
    url: u("1567767292278-a4f21aa2d36e"),
    label: "Bright airy bedroom",
    category: "bedroom",
    tags: ["bed"],
    style: "scandinavian",
  },
  {
    id: "bd-03",
    url: u("1560185007-cde436f6a4d0"),
    label: "Cozy morning bedroom",
    category: "bedroom",
    tags: ["bed"],
    style: "cozy",
  },
  {
    id: "bd-04",
    url: u("1616594039964-ae9021a400a0"),
    label: "Modern hotel-style suite",
    category: "bedroom",
    tags: ["bed"],
    style: "luxury",
  },
  {
    id: "bd-05",
    url: u("1505691938895-1758d7feb511"),
    label: "Cozy bedroom with plants",
    category: "bedroom",
    tags: ["bed", "decor"],
    style: "cozy",
  },
  {
    id: "bd-06",
    url: u("1502005229762-cf1b2da7c5d6"),
    label: "Warm candlelit bedroom",
    category: "bedroom",
    tags: ["bed", "lamp"],
    style: "cozy",
  },
  {
    id: "bd-07",
    url: u("1493809842364-78817add7ffb"),
    label: "Linen & natural bedroom",
    category: "bedroom",
    tags: ["bed"],
    style: "scandinavian",
  },
  {
    id: "bd-08",
    url: u("1600210492493-0946911123ea"),
    label: "Bright contemporary bedroom",
    category: "bedroom",
    tags: ["bed"],
    style: "modern",
  },
  {
    id: "bd-09",
    url: u("1524758631624-e2822e304c36"),
    label: "All-white serene bedroom",
    category: "bedroom",
    tags: ["bed"],
    style: "minimalist",
  },
  {
    id: "bd-10",
    url: u("1507652313519-d4e9174996dd"),
    label: "Sunny morning bedroom",
    category: "bedroom",
    tags: ["bed"],
    style: "modern",
  },
  {
    id: "bd-11",
    url: u("1484101403633-562f891dc89a"),
    label: "Minimal bedroom with shelf",
    category: "bedroom",
    tags: ["bed", "shelf"],
    style: "minimalist",
  },
  {
    id: "bd-12",
    url: u("1471086569966-db3eebc25a59"),
    label: "Scandinavian master bedroom",
    category: "bedroom",
    tags: ["bed"],
    style: "scandinavian",
  },
  {
    id: "bd-13",
    url: u("1522771739844-6a9f6d5f14af"),
    label: "Nordic hygge bedroom",
    category: "bedroom",
    tags: ["bed"],
    style: "scandinavian",
  },
  {
    id: "bd-14",
    url: u("1615529182904-14819c35db37"),
    label: "Soft-lit luxury bedroom",
    category: "bedroom",
    tags: ["bed"],
    style: "luxury",
  },
  {
    id: "bd-15",
    url: u("1618221118493-9cfa1a1193f0"),
    label: "Moody dark bedroom",
    category: "bedroom",
    tags: ["bed"],
    style: "modern",
  },
  {
    id: "bd-16",
    url: s("cQwXVoWyYEM"),
    label: "Scandinavian bedroom concept",
    category: "bedroom",
    tags: ["bed"],
    style: "scandinavian",
  },
  {
    id: "bd-17",
    url: s("BvMcKKh0O-E"),
    label: "Boutique hotel bedroom",
    category: "bedroom",
    tags: ["bed"],
    style: "luxury",
  },
  {
    id: "bd-18",
    url: u("1618220048045-10a6dbdf83e0"),
    label: "Warm beige bedroom",
    category: "bedroom",
    tags: ["bed"],
    style: "cozy",
  },

  // ── KITCHEN ────────────────────────────────────────────────────────────────
  {
    id: "kt-01",
    url: u("1484154218962-a197022b5858"),
    label: "Bright white kitchen",
    category: "kitchen",
    tags: ["table", "appliance"],
    style: "modern",
  },
  {
    id: "kt-02",
    url: u("1556911220-bda9dc63afcc"),
    label: "Modern kitchen interior",
    category: "kitchen",
    tags: ["table", "appliance"],
    style: "modern",
  },
  {
    id: "kt-03",
    url: u("1572120360610-d971b9d7767c"),
    label: "Contemporary open kitchen",
    category: "kitchen",
    tags: ["table", "appliance"],
    style: "modern",
  },
  {
    id: "kt-04",
    url: u("1556909114-f6e7ad7d3136"),
    label: "White minimal kitchen",
    category: "kitchen",
    tags: ["table"],
    style: "minimalist",
  },
  {
    id: "kt-05",
    url: u("1600607687939-ce8a6c25118c"),
    label: "Dark dramatic kitchen",
    category: "kitchen",
    tags: ["table", "appliance"],
    style: "modern",
  },
  {
    id: "kt-06",
    url: u("1556909172-54557c7e4fb7"),
    label: "Kitchen island & stools",
    category: "kitchen",
    tags: ["table", "chair", "appliance"],
    style: "modern",
  },
  {
    id: "kt-07",
    url: u("1556909195-43c57cb66756"),
    label: "Clean kitchen counter",
    category: "kitchen",
    tags: ["table"],
    style: "minimalist",
  },
  {
    id: "kt-08",
    url: s("z6IUJy2dnpg"),
    label: "Kitchen with concrete ceiling",
    category: "kitchen",
    tags: ["table", "chair"],
    style: "industrial",
  },
  {
    id: "kt-09",
    url: s("kE6Luqa4bBQ"),
    label: "Modern kitchen & living",
    category: "kitchen",
    tags: ["table"],
    style: "modern",
  },
  {
    id: "kt-10",
    url: s("XU_ODlSO9ac"),
    label: "Warm wooden kitchen island",
    category: "kitchen",
    tags: ["table"],
    style: "modern",
  },
  {
    id: "kt-11",
    url: s("noScyKKR0H4"),
    label: "White kitchen wooden counter",
    category: "kitchen",
    tags: ["table"],
    style: "scandinavian",
  },
  {
    id: "kt-12",
    url: s("stcfgY0A0vs"),
    label: "Colonial-style kitchen island",
    category: "kitchen",
    tags: ["table", "chair"],
    style: "classic",
  },

  // ── DINING ─────────────────────────────────────────────────────────────────
  {
    id: "dn-01",
    url: s("aXJkDfOVfyE"),
    label: "Dining room wooden table",
    category: "dining",
    tags: ["table", "chair"],
    style: "modern",
  },
  {
    id: "dn-02",
    url: s("v2FkGl8lkVk"),
    label: "Modern round dining table",
    category: "dining",
    tags: ["table", "chair"],
    style: "modern",
  },
  {
    id: "dn-03",
    url: s("UW1WJJ0bkX0"),
    label: "Dining room with scenic view",
    category: "dining",
    tags: ["table", "chair"],
    style: "luxury",
  },
  {
    id: "dn-04",
    url: s("U9smg1NP8dA"),
    label: "Open living & dining space",
    category: "dining",
    tags: ["table", "sofa"],
    style: "modern",
  },
  {
    id: "dn-05",
    url: s("nmKPgfIUYtM"),
    label: "Living-dining combo",
    category: "dining",
    tags: ["table", "sofa"],
    style: "modern",
  },
  {
    id: "dn-06",
    url: s("tkfV4_59gxw"),
    label: "Elegant dining interior",
    category: "dining",
    tags: ["table", "chair"],
    style: "luxury",
  },

  // ── BATHROOM ───────────────────────────────────────────────────────────────
  {
    id: "bt-01",
    url: u("1552321554-5fefe8c9ef14"),
    label: "Luxury spa bathroom",
    category: "bathroom",
    tags: ["bath"],
    style: "luxury",
  },
  {
    id: "bt-02",
    url: u("1564540586988-aa4e53c3d799"),
    label: "Clean minimal bathroom",
    category: "bathroom",
    tags: ["bath"],
    style: "minimalist",
  },
  {
    id: "bt-03",
    url: u("1571508601891-ca5e7a713859"),
    label: "Modern tile bathroom",
    category: "bathroom",
    tags: ["bath"],
    style: "modern",
  },
  {
    id: "bt-04",
    url: s("L6LSzjhWI0Y"),
    label: "Malachite stone bathtub",
    category: "bathroom",
    tags: ["bath"],
    style: "luxury",
  },
  {
    id: "bt-05",
    url: s("HIu7A27ptE0"),
    label: "Natural plants bathroom",
    category: "bathroom",
    tags: ["bath", "decor"],
    style: "boho",
  },
  {
    id: "bt-06",
    url: s("JGfXR2a8RNg"),
    label: "Freestanding bathtub suite",
    category: "bathroom",
    tags: ["bath"],
    style: "luxury",
  },
  {
    id: "bt-07",
    url: s("M8ikiivUAOM"),
    label: "White ceramic soaking tub",
    category: "bathroom",
    tags: ["bath"],
    style: "classic",
  },
  {
    id: "bt-08",
    url: s("uOrKsopFGAg"),
    label: "Large spa bathroom suite",
    category: "bathroom",
    tags: ["bath"],
    style: "luxury",
  },
  {
    id: "bt-09",
    url: s("WH0syy0Xudg"),
    label: "Shower with garden view",
    category: "bathroom",
    tags: ["bath"],
    style: "modern",
  },
  {
    id: "bt-10",
    url: s("2iqoxfkrvEU"),
    label: "Copper statement bathtub",
    category: "bathroom",
    tags: ["bath"],
    style: "luxury",
  },
  {
    id: "bt-11",
    url: s("XrUnkoHm4Uw"),
    label: "Bathtub & walk-in shower",
    category: "bathroom",
    tags: ["bath"],
    style: "modern",
  },

  // ── HOME OFFICE ────────────────────────────────────────────────────────────
  {
    id: "ho-01",
    url: s("xk8dimKIAaY"),
    label: "Modern home office setup",
    category: "home_office",
    tags: ["desk", "chair"],
    style: "modern",
  },
  {
    id: "ho-02",
    url: s("xqh-RlfJVx4"),
    label: "Desk with greenery",
    category: "home_office",
    tags: ["desk", "decor"],
    style: "boho",
  },
  {
    id: "ho-03",
    url: s("k1xmKlq7hAw"),
    label: "Clean desk & accent chair",
    category: "home_office",
    tags: ["desk", "chair"],
    style: "modern",
  },
  {
    id: "ho-04",
    url: s("6ByiZEftNrc"),
    label: "Desk by window & bookshelf",
    category: "home_office",
    tags: ["desk", "shelf"],
    style: "scandinavian",
  },
  {
    id: "ho-05",
    url: s("At4mo3VXrdQ"),
    label: "Cozy home office corner",
    category: "home_office",
    tags: ["desk"],
    style: "cozy",
  },
  {
    id: "ho-06",
    url: s("NXjBX_DaZuo"),
    label: "Minimal laptop desk",
    category: "home_office",
    tags: ["desk"],
    style: "minimalist",
  },
  {
    id: "ho-07",
    url: s("4PSqRScfEf0"),
    label: "Dual-monitor office setup",
    category: "home_office",
    tags: ["desk", "chair"],
    style: "modern",
  },
  {
    id: "ho-08",
    url: s("T7JRLlYeqAk"),
    label: "Boho desk with plants",
    category: "home_office",
    tags: ["desk", "decor"],
    style: "boho",
  },
  {
    id: "ho-09",
    url: s("1T3Ng46czSw"),
    label: "Home office with storage",
    category: "home_office",
    tags: ["desk", "chair", "shelf"],
    style: "modern",
  },
  {
    id: "ho-10",
    url: s("7KNJa6nsrbA"),
    label: "Dark minimal desk setup",
    category: "home_office",
    tags: ["desk"],
    style: "modern",
  },

  // ── HALLWAY / ENTRYWAY ─────────────────────────────────────────────────────
  {
    id: "hl-01",
    url: s("vf45WqWUosg"),
    label: "White hallway & black door",
    category: "hallway",
    tags: ["decor"],
    style: "minimalist",
  },
  {
    id: "hl-02",
    url: s("_kzeGW1ioxk"),
    label: "Industrial brick interior",
    category: "hallway",
    tags: ["decor"],
    style: "industrial",
  },
  {
    id: "hl-03",
    url: s("2UgGdfMiR6s"),
    label: "Hallway leading to dining",
    category: "hallway",
    tags: ["table", "decor"],
    style: "modern",
  },
  {
    id: "hl-04",
    url: s("_42kwMUmZw0"),
    label: "Gallery-white hallway",
    category: "hallway",
    tags: ["decor"],
    style: "minimalist",
  },
  {
    id: "hl-05",
    url: s("1Ttpg_FDKXk"),
    label: "Warm home interior",
    category: "hallway",
    tags: ["decor"],
    style: "cozy",
  },
  {
    id: "hl-06",
    url: s("VLRzyheT45g"),
    label: "Industrial loft space",
    category: "hallway",
    tags: ["decor"],
    style: "industrial",
  },

  // ── EXTRA POPULAR ──────────────────────────────────────────────────────────
  {
    id: "pop-01",
    url: s("WhXgl1ej4RQ"),
    label: "Yellow minimalist armchair",
    category: "living_room",
    tags: ["chair"],
    style: "minimalist",
  },
  {
    id: "pop-02",
    url: s("yfC9lfjnvT8"),
    label: "Lounge chair lifestyle",
    category: "living_room",
    tags: ["chair"],
    style: "modern",
  },
  {
    id: "pop-03",
    url: s("xF0qS3Ts3p0"),
    label: "Modern cozy living room",
    category: "living_room",
    tags: ["sofa", "chair"],
    style: "cozy",
  },
  {
    id: "pop-04",
    url: s("BDhLZONJTFI"),
    label: "Media wall living room",
    category: "living_room",
    tags: ["sofa", "media"],
    style: "modern",
  },
  {
    id: "pop-05",
    url: s("G9Jkxy7kI0o"),
    label: "Compact Scandi living",
    category: "living_room",
    tags: ["sofa"],
    style: "scandinavian",
  },
  {
    id: "pop-06",
    url: u("1598928506311-c55ded91a20c"),
    label: "Warm beige lounge",
    category: "living_room",
    tags: ["sofa", "lamp"],
    style: "cozy",
  },
  {
    id: "pop-07",
    url: u("1600607687644-c7171b42498b"),
    label: "Open-plan kitchen dining",
    category: "kitchen",
    tags: ["table", "chair"],
    style: "modern",
  },
  {
    id: "pop-08",
    url: u("1556912167-f556f1f39fdf"),
    label: "Bright kitchen with island",
    category: "kitchen",
    tags: ["table", "appliance"],
    style: "classic",
  },
  {
    id: "pop-09",
    url: u("1481277542470-d8a803b8b572"),
    label: "Cozy reading nook",
    category: "living_room",
    tags: ["chair", "lamp", "shelf"],
    style: "cozy",
  },
  {
    id: "pop-10",
    url: u("1617103996702-96ff29b1c467"),
    label: "Luxury penthouse living",
    category: "living_room",
    tags: ["sofa", "chair"],
    style: "luxury",
  },
];

// ── Complementary type map (mirrors roomSuggestions.ts) ────────────────────
// Kept here to avoid a circular import; update both if you add new types.
const COMPLEMENTARY: Record<string, string[]> = {
  chair:     ["table", "lamp", "decor"],
  sofa:      ["table", "lamp", "media", "decor"],
  table:     ["lamp", "decor", "chair"],
  lamp:      ["table", "chair", "decor"],
  shelf:     ["decor", "lamp", "table"],
  bench:     ["decor", "table", "lamp"],
  media:     ["sofa", "table", "lamp", "decor"],
  decor:     ["lamp", "table", "chair"],
  bed:       ["lamp", "decor", "bench"],
  desk:      ["chair", "lamp", "shelf"],
  bath:      ["decor", "lamp"],
  appliance: ["table", "decor"],
};

// ── Helper ──────────────────────────────────────────────────────────────────

/**
 * Returns inspiration ordered by relevance to the detected furniture type.
 *  1. Items whose tags include the detected type (primary match)
 *  2. Items whose tags include any complementary type (secondary match)
 *  3. Everything else as fallback when no scan exists
 * Results within each tier are shuffled so the feed looks fresh.
 */
export function getInspirationForScan(
  detectedType: string | null,
): InspirationItem[] {
  if (!detectedType) return INSPIRATION_DATA;
  const d = detectedType.toLowerCase();
  const complementary = COMPLEMENTARY[d] ?? [];

  const primary: InspirationItem[] = [];
  const secondary: InspirationItem[] = [];
  const rest: InspirationItem[] = [];
  const seen = new Set<string>();

  for (const item of INSPIRATION_DATA) {
    if (item.tags.includes(d)) {
      primary.push(item);
      seen.add(item.id);
    }
  }
  for (const item of INSPIRATION_DATA) {
    if (seen.has(item.id)) continue;
    if (item.tags.some((t) => complementary.includes(t))) {
      secondary.push(item);
      seen.add(item.id);
    }
  }
  for (const item of INSPIRATION_DATA) {
    if (!seen.has(item.id)) rest.push(item);
  }

  // Light shuffle within each tier so repeated scans feel fresh
  const shuffle = <T>(arr: T[]): T[] =>
    arr
      .map((v) => ({ v, k: Math.random() }))
      .sort((a, b) => a.k - b.k)
      .map(({ v }) => v);

  return [...shuffle(primary), ...shuffle(secondary), ...rest];
}
