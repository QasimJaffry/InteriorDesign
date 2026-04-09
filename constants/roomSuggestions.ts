/**
 * Curated copy for the post-scan “ideas & picks” screen.
 * Keys are catalogue `furniture.type` values (lowercase).
 */
export type RoomSuggestionBundle = {
  headline: string;
  intro: string;
  layoutIdeas: string[];
  /** Prefer catalogue items whose `type` matches these (in order). */
  complementaryTypes: string[];
};

const DEFAULT: RoomSuggestionBundle = {
  headline: "Style this space",
  intro:
    "We matched your scan to a furniture category. Browse pieces that fit, and use a few layout ideas as a starting point.",
  layoutIdeas: [
    "Keep main walkways 90 cm+ clear so the room feels open.",
    "Layer lighting: one overhead or floor source plus a softer accent.",
    "Repeat one material (wood tone or metal) across two pieces for cohesion.",
  ],
  complementaryTypes: ["decor", "lamp", "table"],
};

const BY_TYPE: Record<string, RoomSuggestionBundle> = {
  chair: {
    headline: "Make your seating zone work harder",
    intro:
      "A chair anchors reading corners, desks, or dining spots. Here’s how to build around it.",
    layoutIdeas: [
      "Face a chair toward natural light or a focal wall; add a slim side table within arm’s reach.",
      "Pair with a rug that extends slightly past the chair’s front legs to ground the nook.",
      "If this is a desk chair, keep 60–75 cm clearance behind it for rolling out.",
    ],
    complementaryTypes: ["table", "lamp", "decor"],
  },
  sofa: {
    headline: "Lay out a living area around your sofa",
    intro:
      "The sofa is usually the largest piece—build the rest of the room from its placement.",
    layoutIdeas: [
      "Float the sofa with 30–45 cm breathing room from the wall for a modern, airy feel.",
      "Coffee table distance: about 45 cm from the sofa edge for comfortable reach.",
      "Balance a long sofa with a floor lamp or tall plant on the opposite side.",
    ],
    complementaryTypes: ["table", "lamp", "media", "decor"],
  },
  table: {
    headline: "Tables tie the room together",
    intro:
      "Coffee, side, or dining—tables are hubs for light, drinks, and daily rhythm.",
    layoutIdeas: [
      "Side tables: top roughly level with sofa or chair arms when seated.",
      "Leave at least 75 cm between table edge and traffic paths in tight rooms.",
      "Odd numbers (one lamp + two objects) read more styled than perfect symmetry.",
    ],
    complementaryTypes: ["lamp", "decor", "chair"],
  },
  lamp: {
    headline: "Light the room in layers",
    intro:
      "Good lighting mixes ambient, task, and accent—your scan points to a lighting focal piece.",
    layoutIdeas: [
      "Aim for three light sources per room at different heights (ceiling, floor, table).",
      "Warm bulbs (2700–3000 K) feel cozy in living spaces.",
      "Place a floor lamp behind or beside seating to reduce harsh shadows on faces.",
    ],
    complementaryTypes: ["table", "chair", "decor"],
  },
  shelf: {
    headline: "Storage that doubles as display",
    intro:
      "Shelves organize clutter and show personality—balance books with a bit of negative space.",
    layoutIdeas: [
      "Heavy items low; lighter or decorative pieces at eye level.",
      "Step shelf depth: deeper below, shallower above for a lighter silhouette.",
      "Leave ~20% of each shelf empty so it doesn’t feel crammed.",
    ],
    complementaryTypes: ["decor", "lamp", "table"],
  },
  bench: {
    headline: "Benches: flexible seating & surfaces",
    intro:
      "Benches work in entries, foot-of-bed, or dining—keep proportions tight to the space.",
    layoutIdeas: [
      "At the foot of a bed: leave at least 60 cm clearance to walk past.",
      "In entryways: 90–120 cm width feels generous without blocking the door swing.",
      "Add cushions or a throw to soften hard bench surfaces.",
    ],
    complementaryTypes: ["decor", "table", "lamp"],
  },
  media: {
    headline: "Center the tech, soften the room",
    intro:
      "Screens and speakers feel better with texture and warm light nearby.",
    layoutIdeas: [
      "TV center near seated eye level; distance ≈ 1.5–2.5× screen diagonal for comfort.",
      "Hide cables with a slim console or cord channel for a calmer look.",
      "Flank a media unit with matching height objects (speakers, lamps, plants).",
    ],
    complementaryTypes: ["sofa", "table", "lamp", "decor"],
  },
  decor: {
    headline: "Finish with accents",
    intro:
      "Rugs, plants, and objects personalize a space after the big pieces are in.",
    layoutIdeas: [
      "Group decor in odd numbers (3 vases, 5 books) on one surface.",
      "Vary height: low tray, mid vase, one tall stem or candle.",
      "One statement piece per zone beats many small competing focal points.",
    ],
    complementaryTypes: ["lamp", "table", "chair"],
  },
  bed: {
    headline: "Restful bedroom layout",
    intro:
      "Beds set the room’s axis—nightstands and lighting should feel balanced on both sides when possible.",
    layoutIdeas: [
      "Nightstand height within ~5 cm of mattress top for easy reach.",
      "Leave 60+ cm at the foot of the bed for circulation.",
      "Soften with a rug that extends past the sides of the bed.",
    ],
    complementaryTypes: ["lamp", "decor", "bench"],
  },
  desk: {
    headline: "A focused work corner",
    intro:
      "Desks work best with clear task light and minimal visual clutter in your sight line.",
    layoutIdeas: [
      "Screen top at or slightly below eye level; arm’s length from your eyes.",
      "Ambient light behind or beside you reduces screen glare.",
      "Cable tray or box under the desk keeps floors calm.",
    ],
    complementaryTypes: ["chair", "lamp", "shelf"],
  },
  bath: {
    headline: "Clean, calm wet zones",
    intro:
      "Bath pieces read best with simple lines and easy-to-clean surfaces.",
    layoutIdeas: [
      "Keep daily items in one tray or caddy to reduce visual noise.",
      "Mat length should match your step-out zone—no tripping on edges.",
      "Match metal finishes (towel bar, taps, hooks) for a considered look.",
    ],
    complementaryTypes: ["decor", "lamp"],
  },
  appliance: {
    headline: "Kitchen rhythm & clearance",
    intro:
      "Appliances need breathing room for doors, vents, and workflow triangles.",
    layoutIdeas: [
      "Fridge: leave manufacturer clearance at sides/back for airflow.",
      "Keep landing zones (counter next to fridge, stove, sink) uncluttered.",
      "Repeat one cabinet hardware style across the run.",
    ],
    complementaryTypes: ["table", "decor"],
  },
};

export function getRoomSuggestionsForType(
  detectedType: string,
): RoomSuggestionBundle {
  const key = detectedType.trim().toLowerCase();
  return BY_TYPE[key] ?? DEFAULT;
}
