import React from "react";
import { Platform } from "react-native";

import { ARWebPlaceholder } from "@/components/ar/ARWebPlaceholder";
import { InteractiveAR } from "@/components/ar/InteractiveAR";

export default function ARScreen() {
  if (Platform.OS === "web") {
    return <ARWebPlaceholder />;
  }
  return <InteractiveAR />;
}
