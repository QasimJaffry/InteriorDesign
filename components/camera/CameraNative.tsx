import { useObjectDetection } from "@infinitered/react-native-mlkit-object-detection";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
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
  const { saveScanResult, saving } = useScanResult();
  const setScanFilter = useAppStore((s) => s.setScanFilter);

  const [scanning, setScanning] = useState(false);
  const [lastResult, setLastResult] = useState<{
    type: string;
    confidence: number;
  } | null>(null);

  const onCapture = async () => {
    if (!detector?.isLoaded() || !cameraRef.current || scanning || saving) {
      return;
    }
    setScanning(true);
    let photoUri: string | null = null;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.4,
        skipMetadata: true,
      });
      photoUri = photo?.uri ?? null;
      if (!photoUri) {
        Toast.show({ type: "error", text1: "Failed to take photo" });
        return;
      }

      const results = await detector.detectObjects(photoUri);
      const labels = results.flatMap((r) => r.labels ?? []);
      const best = bestDetectionFromLabels(labels);

      if (!best) {
        setLastResult(null);
        Toast.show({
          type: "info",
          text1: "Nothing detected",
          text2: "Point the camera at furniture and try again.",
        });
        return;
      }

      setLastResult(best);
      await saveScanResult(best.type, best.confidence);
      setScanFilter(best.type);
      router.replace({
        pathname: "/post-scan",
        params: {
          detectedType: best.type,
          confidence: String(best.confidence),
        },
      });
    } catch {
      Toast.show({ type: "error", text1: "Could not save scan" });
    } finally {
      if (photoUri) {
        void FileSystem.deleteAsync(photoUri, { idempotent: true });
      }
      setScanning(false);
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

  const busy = scanning || saving;

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <View style={styles.hud} pointerEvents="box-none">
        <View style={styles.badge}>
          {scanning ? (
            <>
              <ActivityIndicator size="small" color="#9df" />
              <Text style={styles.muted}>Detecting…</Text>
            </>
          ) : lastResult ? (
            <>
              <Text style={styles.badgeTitle}>Last scan</Text>
              <Text style={styles.badgeType}>{lastResult.type}</Text>
              <Text style={styles.badgeConf}>
                {(lastResult.confidence * 100).toFixed(0)}% confidence
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.badgeTitle}>Ready</Text>
              <Text style={styles.muted}>Point at furniture and tap Scan</Text>
            </>
          )}
        </View>
        <Pressable
          style={[styles.capture, busy && styles.disabled]}
          onPress={onCapture}
          disabled={busy}
        >
          <Text style={styles.captureText}>
            {saving ? "Saving…" : scanning ? "Scanning…" : "Scan furniture"}
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
    gap: 4,
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
    textAlign: "center",
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
