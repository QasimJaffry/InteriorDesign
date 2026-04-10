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
import { fontFamily, palette, radius, space } from "@/constants/theme";

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
        <ActivityIndicator size="large" color={palette.sage} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionTitle}>Camera access</Text>
        <Text style={styles.msg}>
          We use the camera to detect furniture in frame and suggest matching
          pieces. Nothing is uploaded without your action.
        </Text>
        <Pressable style={styles.primary} onPress={requestPermission}>
          <Text style={styles.primaryText}>Continue</Text>
        </Pressable>
      </View>
    );
  }

  if (!detector?.isLoaded()) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={palette.sage} />
        <Text style={styles.hint}>Loading on-device model…</Text>
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
              <ActivityIndicator size="small" color={palette.link} />
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
              <Text style={styles.muted}>
                Frame a chair, table, or sofa — then tap scan
              </Text>
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
    backgroundColor: palette.black,
  },
  camera: {
    flex: 1,
  },
  hud: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    padding: space.md,
  },
  badge: {
    alignSelf: "center",
    marginTop: space.xl,
    backgroundColor: palette.overlay,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderRadius: radius.lg,
    minWidth: 240,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: palette.border,
  },
  badgeTitle: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.textMuted,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  badgeType: {
    fontFamily: fontFamily.displaySemibold,
    color: palette.white,
    fontSize: 24,
  },
  badgeConf: {
    fontFamily: fontFamily.sansMedium,
    color: palette.link,
    fontSize: 14,
    marginTop: 4,
  },
  muted: {
    fontFamily: fontFamily.sans,
    color: palette.textSecondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  capture: {
    backgroundColor: palette.sage,
    paddingVertical: 18,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  captureText: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.bg,
    fontSize: 16,
  },
  disabled: {
    opacity: 0.55,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: space.lg,
    backgroundColor: palette.bg,
  },
  permissionTitle: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: 26,
    color: palette.text,
    marginBottom: space.md,
    textAlign: "center",
  },
  msg: {
    fontFamily: fontFamily.sans,
    color: palette.textSecondary,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: space.lg,
    maxWidth: 320,
  },
  hint: {
    fontFamily: fontFamily.sans,
    color: palette.textMuted,
    marginTop: space.md,
    fontSize: 14,
  },
  primary: {
    marginTop: space.sm,
    backgroundColor: palette.sage,
    paddingHorizontal: space.lg,
    paddingVertical: 16,
    borderRadius: radius.md,
  },
  primaryText: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.bg,
    fontSize: 16,
  },
});
