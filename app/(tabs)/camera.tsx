import React from "react";
import { Platform } from "react-native";

import { CameraNative } from "@/components/camera/CameraNative";
import { CameraWebPlaceholder } from "@/components/camera/CameraWebPlaceholder";

export default function CameraScreen() {
  if (Platform.OS === "web") {
    return <CameraWebPlaceholder />;
  }
  return <CameraNative />;
}
