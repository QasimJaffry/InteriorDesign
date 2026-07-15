import type { ImageSourcePropType } from "react-native";

/**
 * Home feed — room photography for inspiration cards (4:5 portraits where possible).
 */
export type InspirationItem = {
  id: string;
  image: ImageSourcePropType;
  label: string;
  category:
    | "living_room"
    | "bedroom"
    | "kitchen"
    | "dining"
    | "bathroom"
    | "home_office"
    | "hallway";
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

type Cat = InspirationItem["category"];
type Style = InspirationItem["style"];

function item(
  id: string,
  image: ImageSourcePropType,
  label: string,
  category: Cat,
  tags: string[],
  style: Style,
): InspirationItem {
  return { id, image, label, category, tags, style };
}

const LOCAL_HEROES: InspirationItem[] = [
  item(
    "lr-velvet",
    require("../assets/images/spaces/living-velvet-v6.jpg"),
    "Soft neutrals around a low lounge sofa",
    "living_room",
    ["sofa", "table", "lamp"],
    "modern",
  ),
  item(
    "lr-mustard",
    require("../assets/images/spaces/living-mustard-v6.jpg"),
    "Open studio lounge with soft neutrals",
    "living_room",
    ["sofa", "table", "lamp"],
    "minimalist",
  ),
  item(
    "lr-scandi",
    require("../assets/images/spaces/living-scandi-v6.jpg"),
    "Bright living with pale woods",
    "living_room",
    ["sofa", "table", "chair"],
    "scandinavian",
  ),
  item(
    "lr-nook",
    require("../assets/images/spaces/living-nook-v6.jpg"),
    "Window nook made for lingering",
    "living_room",
    ["chair", "table"],
    "cozy",
  ),
  item(
    "lr-modern",
    require("../assets/images/spaces/living-modern-v6.jpg"),
    "Clean lines in an open lounge",
    "living_room",
    ["sofa", "table", "lamp"],
    "minimalist",
  ),
  item(
    "lr-loft",
    require("../assets/images/spaces/living-loft-v6.jpg"),
    "Loft living with generous light",
    "living_room",
    ["sofa", "chair", "table"],
    "industrial",
  ),
  item(
    "br-calm",
    require("../assets/images/spaces/bedroom-calm-v6.jpg"),
    "Calm bedroom retreat",
    "bedroom",
    ["bed", "lamp"],
    "classic",
  ),
  item(
    "br-soft",
    require("../assets/images/spaces/bedroom-soft-v6.jpg"),
    "Soft linens and quiet mornings",
    "bedroom",
    ["bed", "table"],
    "scandinavian",
  ),
  item(
    "dn-formal",
    require("../assets/images/spaces/dining-formal-v6.jpg"),
    "Formal dining for six",
    "dining",
    ["table", "chair"],
    "classic",
  ),
  item(
    "dn-casual",
    require("../assets/images/spaces/dining-casual-v6.jpg"),
    "Casual meals by the window",
    "dining",
    ["table", "chair"],
    "modern",
  ),
  item(
    "kt-bright",
    require("../assets/images/spaces/kitchen-bright-v6.jpg"),
    "Bright kitchen ready for cooks",
    "kitchen",
    ["table", "shelf"],
    "modern",
  ),
  item(
    "ba-spa",
    require("../assets/images/spaces/bathroom-spa-v6.jpg"),
    "Spa bath with soft light",
    "bathroom",
    ["bath"],
    "luxury",
  ),
  item(
    "of-desk",
    require("../assets/images/spaces/office-desk-v6.jpg"),
    "Focused work corner",
    "home_office",
    ["desk", "chair"],
    "modern",
  ),
  item(
    "lr-gallery",
    require("../assets/images/spaces/living-gallery-v6.jpg"),
    "Gallery wall over a long lounge sofa",
    "living_room",
    ["sofa", "chair", "table"],
    "modern",
  ),
];

/** Extra room photography (bundled) — filenames match files on disk. */
const INSPO_META: {
  file: string;
  label: string;
  category: Cat;
  tags: string[];
  style: Style;
}[] = [
  {
    file: "inspo-01.jpg",
    label: "Sunlit living with layered textures",
    category: "living_room",
    tags: ["sofa", "table"],
    style: "modern",
  },
  {
    file: "inspo-02.jpg",
    label: "Sculptural seating in a calm lounge",
    category: "living_room",
    tags: ["sofa", "chair"],
    style: "minimalist",
  },
  {
    file: "inspo-03.jpg",
    label: "Neutral living room, soft daylight",
    category: "living_room",
    tags: ["sofa", "lamp"],
    style: "scandinavian",
  },
  {
    file: "inspo-06.jpg",
    label: "Contemporary lounge composition",
    category: "living_room",
    tags: ["sofa", "table"],
    style: "modern",
  },
  {
    file: "inspo-07.jpg",
    label: "Statement sofa as the room focus",
    category: "living_room",
    tags: ["sofa"],
    style: "luxury",
  },
  {
    file: "inspo-08.jpg",
    label: "Mid-century living balance",
    category: "living_room",
    tags: ["sofa", "chair", "table"],
    style: "classic",
  },
  {
    file: "inspo-09.jpg",
    label: "Bedroom serenity with pale walls",
    category: "bedroom",
    tags: ["bed", "lamp"],
    style: "minimalist",
  },
  {
    file: "inspo-10.jpg",
    label: "Hotel-calm bedroom suite",
    category: "bedroom",
    tags: ["bed", "table"],
    style: "luxury",
  },
  {
    file: "inspo-14.jpg",
    label: "Airy living room with tall windows",
    category: "living_room",
    tags: ["sofa", "chair"],
    style: "modern",
  },
  {
    file: "inspo-15.jpg",
    label: "Warm wood living space",
    category: "living_room",
    tags: ["sofa", "table"],
    style: "cozy",
  },
  {
    file: "inspo-16.jpg",
    label: "Minimal white living loft",
    category: "living_room",
    tags: ["sofa", "table"],
    style: "minimalist",
  },
  {
    file: "inspo-17.jpg",
    label: "Soft modern living palette",
    category: "living_room",
    tags: ["sofa", "lamp"],
    style: "scandinavian",
  },
  {
    file: "inspo-18.jpg",
    label: "Clean architectural living room",
    category: "living_room",
    tags: ["sofa", "table"],
    style: "modern",
  },
  {
    file: "inspo-19.jpg",
    label: "Kitchen island social hub",
    category: "kitchen",
    tags: ["table", "shelf"],
    style: "modern",
  },
  {
    file: "inspo-20.jpg",
    label: "Bright open-plan kitchen",
    category: "kitchen",
    tags: ["table", "chair"],
    style: "scandinavian",
  },
  {
    file: "inspo-21.jpg",
    label: "Bedroom with linen textures",
    category: "bedroom",
    tags: ["bed"],
    style: "cozy",
  },
  {
    file: "inspo-22.jpg",
    label: "Living room styled for evenings",
    category: "living_room",
    tags: ["sofa", "lamp"],
    style: "classic",
  },
  {
    file: "inspo-23.jpg",
    label: "Inviting seating corner",
    category: "living_room",
    tags: ["chair", "table"],
    style: "boho",
  },
  {
    file: "inspo-24.jpg",
    label: "Dining room ready for guests",
    category: "dining",
    tags: ["table", "chair"],
    style: "classic",
  },
  {
    file: "inspo-25.jpg",
    label: "Soft living light and plants",
    category: "living_room",
    tags: ["sofa", "table"],
    style: "boho",
  },
  {
    file: "inspo-26.jpg",
    label: "Kitchen with natural finishes",
    category: "kitchen",
    tags: ["table", "shelf"],
    style: "scandinavian",
  },
  {
    file: "inspo-28.jpg",
    label: "Quiet bathroom sanctuary",
    category: "bathroom",
    tags: ["bath"],
    style: "minimalist",
  },
  {
    file: "inspo-32.jpg",
    label: "Relaxed living daybed moment",
    category: "living_room",
    tags: ["sofa", "chair"],
    style: "cozy",
  },
  {
    file: "inspo-33.jpg",
    label: "Character lounge with personality",
    category: "living_room",
    tags: ["sofa", "table"],
    style: "boho",
  },
  {
    file: "inspo-34.jpg",
    label: "Polished dining setting",
    category: "dining",
    tags: ["table", "chair"],
    style: "luxury",
  },
  {
    file: "inspo-35.jpg",
    label: "Bedroom nook for reading",
    category: "bedroom",
    tags: ["bed", "chair"],
    style: "cozy",
  },
  {
    file: "inspo-36.jpg",
    label: "Industrial loft dining",
    category: "dining",
    tags: ["table", "chair"],
    style: "industrial",
  },
  {
    file: "inspo-37.jpg",
    label: "Compact home office setup",
    category: "home_office",
    tags: ["desk", "chair"],
    style: "modern",
  },
  {
    file: "inspo-38.jpg",
    label: "Hallway moments with quiet art",
    category: "hallway",
    tags: ["shelf", "lamp"],
    style: "classic",
  },
  {
    file: "inspo-39.jpg",
    label: "Open living that feels unhurried",
    category: "living_room",
    tags: ["sofa", "table"],
    style: "minimalist",
  },
  {
    file: "inspo-40.jpg",
    label: "Warm evening living room",
    category: "living_room",
    tags: ["sofa", "lamp"],
    style: "cozy",
  },
  {
    file: "inspo-41.jpg",
    label: "Spa-like bath details",
    category: "bathroom",
    tags: ["bath"],
    style: "luxury",
  },
  {
    file: "inspo-42.jpg",
    label: "Creative desk with soft light",
    category: "home_office",
    tags: ["desk", "lamp"],
    style: "scandinavian",
  },
  {
    file: "inspo-43.jpg",
    label: "Family dining that feels easy",
    category: "dining",
    tags: ["table", "chair"],
    style: "modern",
  },
  {
    file: "inspo-44.jpg",
    label: "Bedroom with generous windows",
    category: "bedroom",
    tags: ["bed", "table"],
    style: "modern",
  },
  {
    file: "inspo-45.jpg",
    label: "Collected living room details",
    category: "living_room",
    tags: ["sofa", "chair", "table"],
    style: "boho",
  },
];

const INSPO_IMAGES: Record<string, ImageSourcePropType> = {
  "inspo-01.jpg": require("../assets/images/spaces/inspo-01.jpg"),
  "inspo-02.jpg": require("../assets/images/spaces/inspo-02.jpg"),
  "inspo-03.jpg": require("../assets/images/spaces/inspo-03.jpg"),
  "inspo-06.jpg": require("../assets/images/spaces/inspo-06.jpg"),
  "inspo-07.jpg": require("../assets/images/spaces/inspo-07.jpg"),
  "inspo-08.jpg": require("../assets/images/spaces/inspo-08.jpg"),
  "inspo-09.jpg": require("../assets/images/spaces/inspo-09.jpg"),
  "inspo-10.jpg": require("../assets/images/spaces/inspo-10.jpg"),
  "inspo-14.jpg": require("../assets/images/spaces/inspo-14.jpg"),
  "inspo-15.jpg": require("../assets/images/spaces/inspo-15.jpg"),
  "inspo-16.jpg": require("../assets/images/spaces/inspo-16.jpg"),
  "inspo-17.jpg": require("../assets/images/spaces/inspo-17.jpg"),
  "inspo-18.jpg": require("../assets/images/spaces/inspo-18.jpg"),
  "inspo-19.jpg": require("../assets/images/spaces/inspo-19.jpg"),
  "inspo-20.jpg": require("../assets/images/spaces/inspo-20.jpg"),
  "inspo-21.jpg": require("../assets/images/spaces/inspo-21.jpg"),
  "inspo-22.jpg": require("../assets/images/spaces/inspo-22.jpg"),
  "inspo-23.jpg": require("../assets/images/spaces/inspo-23.jpg"),
  "inspo-24.jpg": require("../assets/images/spaces/inspo-24.jpg"),
  "inspo-25.jpg": require("../assets/images/spaces/inspo-25.jpg"),
  "inspo-26.jpg": require("../assets/images/spaces/inspo-26.jpg"),
  "inspo-28.jpg": require("../assets/images/spaces/inspo-28.jpg"),
  "inspo-32.jpg": require("../assets/images/spaces/inspo-32.jpg"),
  "inspo-33.jpg": require("../assets/images/spaces/inspo-33.jpg"),
  "inspo-34.jpg": require("../assets/images/spaces/inspo-34.jpg"),
  "inspo-35.jpg": require("../assets/images/spaces/inspo-35.jpg"),
  "inspo-36.jpg": require("../assets/images/spaces/inspo-36.jpg"),
  "inspo-37.jpg": require("../assets/images/spaces/inspo-37.jpg"),
  "inspo-38.jpg": require("../assets/images/spaces/inspo-38.jpg"),
  "inspo-39.jpg": require("../assets/images/spaces/inspo-39.jpg"),
  "inspo-40.jpg": require("../assets/images/spaces/inspo-40.jpg"),
  "inspo-41.jpg": require("../assets/images/spaces/inspo-41.jpg"),
  "inspo-42.jpg": require("../assets/images/spaces/inspo-42.jpg"),
  "inspo-43.jpg": require("../assets/images/spaces/inspo-43.jpg"),
  "inspo-44.jpg": require("../assets/images/spaces/inspo-44.jpg"),
  "inspo-45.jpg": require("../assets/images/spaces/inspo-45.jpg"),
};

export const INSPIRATION_DATA: InspirationItem[] = [
  ...LOCAL_HEROES,
  ...INSPO_META.map((m) =>
    item(
      m.file.replace(".jpg", ""),
      INSPO_IMAGES[m.file],
      m.label,
      m.category,
      m.tags,
      m.style,
    ),
  ),
];
