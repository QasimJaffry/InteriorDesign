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
import Feather from "@expo/vector-icons/Feather";

import { allDetectionsFromLabels, bestDetectionFromLabels } from "@/lib/mlLabelMap";
import { useScanResult } from "@/hooks/useScanResult";
import { useAppStore } from "@/store/appStore";
import { fontFamily, palette, radius, space } from "@/constants/theme";

/** Four corner brackets that form a viewfinder reticle. */
function Viewfinder({ active }: { active: boolean }) {
  const color = active ? palette.sage : palette.link;
  const corner: object = {
    position: "absolute",
    width: 22,
    height: 22,
    borderColor: color,
    opacity: active ? 1 : 0.6,
  };
  return (
    <View style={styles.viewfinder} pointerEvents="none">
      <View style={[corner, styles.cTL]} />
      <View style={[corner, styles.cTR]} />
      <View style={[corner, styles.cBL]} />
      <View style={[corner, styles.cBR]} />
    </View>
  );
}

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
    if (!detector?.isLoaded() || !cameraRef.current || scanning || saving) return;
    setScanning(true);
    let photoUri: string | null = null;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.4 });
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
      const allDetections = allDetectionsFromLabels(labels);
      setLastResult(best);
      await saveScanResult(best.type, best.confidence);
      setScanFilter(best.type);
      router.replace({
        pathname: "/post-scan",
        params: {
          detectedType: best.type,
          confidence: String(best.confidence),
          allTypes: allDetections.map((d) => d.type).join(","),
        },
      });
    } catch {
      Toast.show({ type: "error", text1: "Could not save scan" });
    } finally {
      if (photoUri) void FileSystem.deleteAsync(photoUri, { idempotent: true });
      setScanning(false);
    }
  };

  // ── Loading / permission states ────────────────────────────────────────────

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
        <View style={styles.permIcon}>
          <Feather name="camera" size={32} color={palette.sage} />
        </View>
        <Text style={styles.permTitle}>Camera access</Text>
        <Text style={styles.permMsg}>
          INTERIO uses your camera to identify furniture and suggest matching
          pieces. Nothing is uploaded without your action.
        </Text>
        <Pressable style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Grant access</Text>
        </Pressable>
      </View>
    );
  }

  if (!detector?.isLoaded()) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={palette.sage} />
        <Text style={styles.loadingText}>Loading detection model…</Text>
      </View>
    );
  }

  const busy = scanning || saving;

  // ── Status info ───────────────────────────────────────────────────────────
  const statusLabel = scanning
    ? "Detecting…"
    : saving
    ? "Saving result…"
    : lastResult
    ? lastResult.type
    : "Ready";

  const statusSub = scanning || saving
    ? null
    : lastResult
    ? `${(lastResult.confidence * 100).toFixed(0)}% confidence`
    : "Frame a chair, table, or sofa";

  return (
    <View style={styles.container}>
      {/* Live camera feed */}
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />

      {/* HUD overlay */}
      <View style={styles.hud} pointerEvents="box-none">

        {/* Top status pill */}
        <View style={styles.topArea} pointerEvents="none">
          <View style={[styles.statusPill, lastResult && !busy && styles.statusPillResult]}>
            {busy ? (
              <ActivityIndicator size="small" color={palette.sage} style={{ marginRight: 8 }} />
            ) : (
              <View style={[styles.statusDot, lastResult ? styles.statusDotResult : styles.statusDotReady]} />
            )}
            <View>
              <Text style={styles.statusLabel}>{statusLabel}</Text>
              {statusSub ? (
                <Text style={styles.statusSub}>{statusSub}</Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* Viewfinder */}
        <Viewfinder active={busy} />

        {/* Bottom panel */}
        <View style={styles.bottomPanel}>
          <Text style={styles.hint}>
            {busy
              ? "Please wait…"
              : "Frame furniture and tap to scan"}
          </Text>

          {/* Shutter button */}
          <Pressable
            style={[styles.shutter, busy && styles.shutterBusy]}
            onPress={onCapture}
            disabled={busy}
          >
            <View style={[styles.shutterInner, busy && styles.shutterInnerBusy]} />
          </Pressable>

          {/* Placeholder for symmetry */}
          <View style={styles.shutterSpacer} />
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CORNER_THICK = 3;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.black },
  camera: { flex: 1 },

  hud: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },

  // ── Top status area ───────────────────────────────────────────────────────
  topArea: {
    alignItems: "center",
    paddingTop: space.xl + space.sm,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.overlay,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: radius.full,
    paddingHorizontal: space.md,
    paddingVertical: 10,
    gap: 10,
  },
  statusPillResult: {
    borderColor: palette.sageBorder,
    backgroundColor: "rgba(92, 81, 224, 0.18)",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusDotReady: {
    backgroundColor: palette.ice,
  },
  statusDotResult: {
    backgroundColor: palette.sage,
  },
  statusLabel: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.white,
    fontSize: 15,
    textTransform: "capitalize",
  },
  statusSub: {
    fontFamily: fontFamily.sans,
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    marginTop: 1,
  },

  // ── Viewfinder reticle ────────────────────────────────────────────────────
  viewfinder: {
    position: "absolute",
    top: "22%",
    left: "12%",
    right: "12%",
    bottom: "28%",
  },
  cTL: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_THICK,
    borderLeftWidth: CORNER_THICK,
    borderTopLeftRadius: 4,
  },
  cTR: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_THICK,
    borderRightWidth: CORNER_THICK,
    borderTopRightRadius: 4,
  },
  cBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_THICK,
    borderLeftWidth: CORNER_THICK,
    borderBottomLeftRadius: 4,
  },
  cBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_THICK,
    borderRightWidth: CORNER_THICK,
    borderBottomRightRadius: 4,
  },

  // ── Bottom panel ──────────────────────────────────────────────────────────
  bottomPanel: {
    backgroundColor: palette.overlay,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255, 255, 255, 0.12)",
    paddingTop: space.md,
    paddingBottom: space.xl + space.sm,
    paddingHorizontal: space.lg,
    alignItems: "center",
    gap: space.md,
  },
  hint: {
    fontFamily: fontFamily.sans,
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    textAlign: "center",
  },

  // Shutter button: outer ring + inner filled circle
  shutter: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 3,
    borderColor: palette.white,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBusy: {
    borderColor: "rgba(255, 255, 255, 0.4)",
    opacity: 0.6,
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: palette.sage,
  },
  shutterInnerBusy: {
    backgroundColor: palette.sageDeep,
  },
  shutterSpacer: {
    height: 4,
  },

  // ── Permission / loading states ───────────────────────────────────────────
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: space.lg,
    backgroundColor: palette.bg,
    gap: space.md,
  },
  permIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: palette.sageMuted,
    borderWidth: 1,
    borderColor: palette.sageBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.sm,
  },
  permTitle: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: 28,
    color: palette.text,
    textAlign: "center",
  },
  permMsg: {
    fontFamily: fontFamily.sans,
    color: palette.textSecondary,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 23,
    maxWidth: 300,
  },
  permBtn: {
    backgroundColor: palette.sage,
    paddingHorizontal: space.xl,
    paddingVertical: 15,
    borderRadius: radius.full,
    marginTop: space.sm,
  },
  permBtnText: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.white,
    fontSize: 16,
    letterSpacing: 0.2,
  },
  loadingText: {
    fontFamily: fontFamily.sans,
    color: palette.textMuted,
    fontSize: 14,
  },
});
