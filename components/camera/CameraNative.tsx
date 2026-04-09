import { useObjectDetection } from "@infinitered/react-native-mlkit-object-detection";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { bestDetectionFromLabels } from "@/lib/mlLabelMap";
import { useScanResult } from "@/hooks/useScanResult";
import { useAppStore } from "@/store/appStore";

export function CameraNative() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const detector = useObjectDetection("default");
  const processingRef = useRef(false);
  const { saveScanResult, saving } = useScanResult();
  const setScanFilter = useAppStore((s) => s.setScanFilter);

  const [overlay, setOverlay] = useState<{
    type: string;
    confidence: number;
  } | null>(null);
  const [live, setLive] = useState<{
    type: string;
    confidence: number;
  } | null>(null);

  const runFrame = useCallback(async () => {
    if (!detector?.isLoaded() || !cameraRef.current) {
      return;
    }
    if (processingRef.current) {
      return;
    }
    processingRef.current = true;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.6,
      });
      if (!photo?.uri) {
        return;
      }
      const results = await detector.detectObjects(photo.uri);
      const labels = results.flatMap((r) => r.labels ?? []);
      const best = bestDetectionFromLabels(labels);
      if (best) {
        setLive(best);
        setOverlay(best);
      } else {
        setLive(null);
      }
    } catch {
      setLive(null);
    } finally {
      processingRef.current = false;
    }
  }, [detector]);

  useEffect(() => {
    if (!detector?.isLoaded()) {
      return;
    }
    const id = setInterval(runFrame, 500);
    return () => clearInterval(id);
  }, [detector, runFrame]);

  const onCapture = async () => {
    const source = overlay ?? live;
    if (!source) {
      Toast.show({
        type: "info",
        text1: "Nothing detected yet",
        text2: "Point the camera at furniture and try again.",
      });
      return;
    }
    try {
      await saveScanResult(source.type, source.confidence);
      setScanFilter(source.type);
      router.replace({
        pathname: "/post-scan",
        params: {
          detectedType: source.type,
          confidence: String(source.confidence),
        },
      });
    } catch {
      Toast.show({ type: "error", text1: "Could not save scan" });
    }
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#c45c5c" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.msg}>Camera access is required to scan.</Text>
        <Pressable style={styles.primary} onPress={requestPermission}>
          <Text style={styles.primaryText}>Grant permission</Text>
        </Pressable>
      </View>
    );
  }

  if (!detector?.isLoaded()) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#c45c5c" />
        <Text style={styles.hint}>Loading ML Kit model…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <View style={styles.hud} pointerEvents="box-none">
        <View style={styles.badge}>
          <Text style={styles.badgeTitle}>Live detection</Text>
          {overlay ? (
            <>
              <Text style={styles.badgeType}>{overlay.type}</Text>
              <Text style={styles.badgeConf}>
                {(overlay.confidence * 100).toFixed(0)}% confidence
              </Text>
            </>
          ) : (
            <Text style={styles.muted}>Scanning…</Text>
          )}
        </View>
        <Pressable
          style={[styles.capture, saving && styles.disabled]}
          onPress={onCapture}
          disabled={saving}
        >
          <Text style={styles.captureText}>
            {saving ? "Saving…" : "Tap to capture & filter home"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  hud: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    padding: 16,
  },
  badge: {
    alignSelf: "center",
    marginTop: 24,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 220,
    alignItems: "center",
  },
  badgeTitle: {
    color: "#aab",
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  badgeType: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  badgeConf: {
    color: "#9df",
    fontSize: 15,
    marginTop: 4,
  },
  muted: {
    color: "#889",
    fontSize: 15,
  },
  capture: {
    backgroundColor: "#c45c5c",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  captureText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.6,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#0f0f12",
  },
  msg: {
    color: "#ccd",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  hint: {
    color: "#889",
    marginTop: 12,
  },
  primary: {
    marginTop: 16,
    backgroundColor: "#c45c5c",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },
});
