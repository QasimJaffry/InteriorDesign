import {
  useObjectDetectionModels,
  useObjectDetectionProvider,
} from "@infinitered/react-native-mlkit-object-detection";
import React, { useMemo } from "react";
import { Platform, View } from "react-native";

const MODEL_OPTIONS = {
  assets: {},
  loadDefaultModel: true,
  defaultModelOptions: {
    shouldEnableClassification: true,
    shouldEnableMultipleObjects: true,
    detectorMode: "singleImage" as const,
  },
};

function ObjectDetectionProviderInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const models = useObjectDetectionModels(MODEL_OPTIONS);
  const { ObjectDetectionProvider } = useObjectDetectionProvider(models);

  return (
    <ObjectDetectionProvider>
      <View style={{ flex: 1 }}>{children}</View>
    </ObjectDetectionProvider>
  );
}

export function ObjectDetectionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  if (Platform.OS === "web") {
    return <>{children}</>;
  }

  return (
    <ObjectDetectionProviderInner>{children}</ObjectDetectionProviderInner>
  );
}
