import type { ImageSourcePropType } from "react-native";

import type { Furniture } from "@/types/models";

import raw from "@/data/furniture-seed.json";

const CATALOGUE_IMAGES: Record<string, ImageSourcePropType> = {
  "sofa-velvet": require("../assets/images/catalogue/sofa-velvet.jpg"),
  "sofa-leather": require("../assets/images/catalogue/sofa-leather.jpg"),
  "chair-sheen": require("../assets/images/catalogue/chair-sheen.jpg"),
  "chair-damask": require("../assets/images/catalogue/chair-damask.jpg"),
  "table-round": require("../assets/images/catalogue/table-round.jpg"),
  shelf: require("../assets/images/catalogue/shelf.jpg"),
  "lamp-barn": require("../assets/images/catalogue/lamp-barn.jpg"),
  "lamp-glass": require("../assets/images/catalogue/lamp-glass.jpg"),
  candle: require("../assets/images/catalogue/candle.jpg"),
  vase: require("../assets/images/catalogue/vase.jpg"),
};

type SeedRow = {
  id: string;
  name: string;
  type: string;
  imageKey: string;
  modelUrl: string;
};

/**
 * Offline/demo catalogue — each piece has a unique thumbnail + GLB.
 * Sofas/chairs/lamps use official Khronos sample screenshots that match the models.
 */
export const BUNDLED_FURNITURE: Furniture[] = (raw as SeedRow[])
  .map((row) => ({
    id: row.id,
    name: row.name,
    type: row.type,
    modelUrl: row.modelUrl,
    image: CATALOGUE_IMAGES[row.imageKey],
    imageUrl: "",
  }))
  .sort((a, b) => a.name.localeCompare(b.name));
