// @ts-nocheck — Viro AR scene props are loosely typed.
import {
  Viro3DObject,
  ViroARScene,
  ViroARSceneNavigator,
  ViroAmbientLight,
  ViroDirectionalLight,
} from "@reactvision/react-viro";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";

import { useFurniture } from "@/contexts/FurnitureContext";
import { fontFamily, palette, radius, space } from "@/constants/theme";
import type { Furniture } from "@/types/models";
import { ARFingerGestures } from "@/components/ar/ARFingerGestures";
import { ARFloorPlanes } from "@/components/ar/ARFloorPlanes";
import { setShowFloorPlanes } from "@/components/ar/floorVisibilityBridge";
import { saveArShotFromCapture } from "@/lib/arShotsStorage";

// ─── Types ───────────────────────────────────────────────────────────────────

export type PlacedModel = {
  id: string;
  furnitureId: string;
  position: [number, number, number];
  rotationY: number;
  scale: number;
  modelUrl: string;
  name: string;
};

type ARViroAppProps = {
  placed: PlacedModel[];
  selectedId: string | null;
  pendingItem: Furniture | null;
  /** Catalogue id currently downloading/parsing into the scene */
  loadingFurnitureId: string | null;
  /** Show translucent floor overlays (place mode). */
  showFloorPlanes: boolean;
  onSceneTap: (
    position: [number, number, number],
    item: Furniture,
  ) => void;
  /** Floortap with no tray piece selected — pick nearest placed object. */
  onEmptySceneTap: (position: [number, number, number] | null) => void;
  onObjectTap: (id: string) => void;
  markNodeTapped: () => void;
  consumeNodeTap: () => boolean;
  onFloorDetected: (count: number) => void;
  onModelLoadStart: (furnitureId: string, placedId: string) => void;
  onModelLoadEnd: (furnitureId: string, placedId: string) => void;
};

/** Horizontal distance (m) — floor hits rarely land on the mesh center. */
const SELECT_RADIUS_M = 1.35;

// ─── Per-object piece ────────────────────────────────────────────────────────
// Selection uses Viro onClick. Drag / pinch / rotate for the *selected* piece
// are handled by ARFingerGestures (Android AR often does not deliver onPinch /
// onRotate — community + Viro docs note this; FixedToWorld onDrag alone is not enough).

function FurniturePiece({
  model,
  app,
}: {
  model: PlacedModel;
  app: ARViroAppProps;
}) {
  const modelRef = useRef(model);
  modelRef.current = model;
  const appRef = useRef(app);
  appRef.current = app;

  return (
    <Viro3DObject
      source={{ uri: model.modelUrl }}
      type="GLB"
      position={model.position}
      rotation={[0, model.rotationY, 0]}
      scale={[model.scale, model.scale, model.scale]}
      highAccuracyEvents
      onClick={() => {
        appRef.current.markNodeTapped();
        appRef.current.onObjectTap(modelRef.current.id);
      }}
      onLoadStart={() => {
        appRef.current.onModelLoadStart(
          modelRef.current.furnitureId,
          modelRef.current.id,
        );
      }}
      onLoadEnd={() => {
        appRef.current.onModelLoadEnd(
          modelRef.current.furnitureId,
          modelRef.current.id,
        );
      }}
      onError={(e) => {
        appRef.current.onModelLoadEnd(
          modelRef.current.furnitureId,
          modelRef.current.id,
        );
        const raw = e.nativeEvent?.error;
        const msg =
          raw instanceof Error ? raw.message : String(raw ?? model.modelUrl);
        Toast.show({
          type: "error",
          text1: "Model failed to load",
          text2: msg,
        });
      }}
    />
  );
}

// ─── AR Scene ────────────────────────────────────────────────────────────────

function isWorldPos(pos: unknown): pos is [number, number, number] {
  return (
    Array.isArray(pos) &&
    pos.length >= 3 &&
    typeof pos[0] === "number" &&
    typeof pos[1] === "number" &&
    typeof pos[2] === "number" &&
    Number.isFinite(pos[0]) &&
    Number.isFinite(pos[1]) &&
    Number.isFinite(pos[2])
  );
}

function ARScene({
  sceneNavigator,
}: {
  sceneNavigator: { viroAppProps: ARViroAppProps };
}) {
  // Always read live props — Viro often does not re-render the scene tree
  // when React parent state (selected furniture) changes.
  const getApp = () => sceneNavigator.viroAppProps;

  const onFloorTap = (position: [number, number, number]) => {
    const app = getApp();
    app.markNodeTapped?.();
    if (app.loadingFurnitureId) {
      Toast.show({
        type: "info",
        text1: "Still loading",
        text2: "Wait for the model to finish before placing another.",
        visibilityTime: 1600,
      });
      return;
    }
    const item = app.pendingItem;
    if (item) {
      app.onSceneTap(position, item);
      return;
    }
    app.onEmptySceneTap?.(position);
  };

  return (
    <ViroARScene
      anchorDetectionTypes={["PlanesHorizontal"]}
      onClick={(position) => {
        const app = getApp();
        if (app.consumeNodeTap?.()) return;
        if (app.loadingFurnitureId) {
          Toast.show({
            type: "info",
            text1: "Still loading",
            text2: "Wait for the model to finish before placing another.",
            visibilityTime: 1600,
          });
          return;
        }
        const hit = isWorldPos(position) ? position : null;
        // Placement must hit a visible floor patch — don't guess mid-air.
        if (app.pendingItem) {
          Toast.show({
            type: "info",
            text1: "Tap a highlighted floor",
            text2: "Move your phone until green surfaces appear, then tap one.",
            visibilityTime: 2200,
          });
          return;
        }
        app.onEmptySceneTap?.(hit);
      }}
    >
      <ViroAmbientLight color="#ffffff" intensity={200} />
      <ViroDirectionalLight
        color="#fff8f0"
        direction={[0.3, -1, -0.4]}
        castsShadow
        shadowOpacity={0.45}
        shadowOrthographicSize={5}
      />
      <ViroDirectionalLight
        color="#d0e8ff"
        direction={[-0.2, 0.5, 0.8]}
        castsShadow={false}
      />
      <ARFloorPlanes
        onFloorTap={onFloorTap}
        onFloorDetected={(count) => getApp().onFloorDetected?.(count)}
      />
      {getApp().placed.map((model) => (
        <FurniturePiece key={model.id} model={model} app={getApp()} />
      ))}
    </ViroARScene>
  );
}

const INITIAL_SCENE = {
  scene: ARScene as unknown as () => React.JSX.Element,
};

// ─── Main component ───────────────────────────────────────────────────────────

export function InteractiveAR() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items, loading, error } = useFurniture();
  const [selected, setSelected] = React.useState<Furniture | null>(null);
  const [placed, setPlaced] = React.useState<PlacedModel[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [loadingFurnitureId, setLoadingFurnitureId] = React.useState<
    string | null
  >(null);
  const [savingShot, setSavingShot] = React.useState(false);
  const loadingPlacedIdsRef = useRef<Set<string>>(new Set());
  const viroRef = useRef<{
    arSceneNavigator?: {
      takeScreenshot: (
        fileName: string,
        saveToCameraRoll: boolean,
      ) => Promise<{ success?: boolean; url?: string; errorCode?: number }>;
    };
  } | null>(null);

  const lastPlacedAtRef = useRef(0);
  const nodeTappedRef = useRef(false);
  const [floorCount, setFloorCount] = React.useState(0);
  const onFloorDetected = useCallback((count: number) => {
    setFloorCount(count);
  }, []);

  React.useEffect(() => {
    if (error) {
      Toast.show({ type: "error", text1: "Furniture list", text2: error });
    }
  }, [error]);

  const onModelLoadStart = useCallback(
    (furnitureId: string, placedId: string) => {
      loadingPlacedIdsRef.current.add(placedId);
      setLoadingFurnitureId(furnitureId);
    },
    [],
  );

  const onModelLoadEnd = useCallback(
    (_furnitureId: string, placedId: string) => {
      loadingPlacedIdsRef.current.delete(placedId);
      if (loadingPlacedIdsRef.current.size === 0) {
        setLoadingFurnitureId(null);
      }
    },
    [],
  );

  const onSceneTap = useCallback(
    (position: [number, number, number], item: Furniture) => {
      if (loadingFurnitureId) return;
      const now = Date.now();
      if (now - lastPlacedAtRef.current < 450) return;
      lastPlacedAtRef.current = now;
      const newId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      loadingPlacedIdsRef.current.add(newId);
      setLoadingFurnitureId(item.id);
      setPlaced((prev) => [
        ...prev,
        {
          id: newId,
          furnitureId: item.id,
          position,
          rotationY: 0,
          scale: 0.35,
          modelUrl: item.modelUrl,
          name: item.name,
        },
      ]);
      setSelectedId(newId);
      setSelected(null);
    },
    [loadingFurnitureId],
  );

  const markNodeTapped = useCallback(() => {
    nodeTappedRef.current = true;
  }, []);
  const consumeNodeTap = useCallback(() => {
    if (!nodeTappedRef.current) return false;
    nodeTappedRef.current = false;
    return true;
  }, []);

  const onObjectTap = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;
  const placedRef = useRef(placed);
  placedRef.current = placed;

  const onEmptySceneTap = useCallback(
    (position: [number, number, number] | null) => {
      const models = placedRef.current;
      if (!models.length) {
        Toast.show({
          type: "info",
          text1: "Pick a piece first",
          text2: "Select furniture from the tray, then tap the room.",
        });
        return;
      }

      // One piece in the room → tap anywhere selects it (mesh onClick is flaky).
      if (models.length === 1) {
        setSelectedId(models[0].id);
        return;
      }

      if (!position) {
        setSelectedId(models[models.length - 1].id);
        return;
      }

      let bestId: string | null = null;
      let bestDist = Infinity;
      for (const m of models) {
        const dx = m.position[0] - position[0];
        const dz = m.position[2] - position[2];
        const d = Math.hypot(dx, dz);
        if (d < bestDist) {
          bestDist = d;
          bestId = m.id;
        }
      }

      if (bestId && bestDist <= SELECT_RADIUS_M) {
        setSelectedId(bestId);
        return;
      }

      setSelectedId(null);
      Toast.show({
        type: "info",
        text1: "Tap closer to a piece",
        text2: "Or pick something new from the tray to place.",
        visibilityTime: 1800,
      });
    },
    [],
  );

  const selectedPlaced = placed.find((p) => p.id === selectedId);
  const showFloorPlanes = !!selected && !selectedId;

  React.useEffect(() => {
    setShowFloorPlanes(showFloorPlanes);
  }, [showFloorPlanes]);

  const getSelectedPose = useCallback(() => {
    const id = selectedIdRef.current;
    if (!id) return null;
    const m = placedRef.current.find((p) => p.id === id);
    if (!m) return null;
    return {
      position: m.position,
      rotationY: m.rotationY,
      scale: m.scale,
    };
  }, []);

  const onSelectedPoseChange = useCallback(
    (next: {
      position?: [number, number, number];
      rotationY?: number;
      scale?: number;
    }) => {
      const id = selectedIdRef.current;
      if (!id) return;
      setPlaced((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...next } : m)),
      );
    },
    [],
  );

  const viroAppProps = useMemo(
    () => ({
      placed,
      selectedId,
      pendingItem: selected,
      loadingFurnitureId,
      showFloorPlanes,
      onSceneTap,
      onEmptySceneTap,
      onObjectTap,
      markNodeTapped,
      consumeNodeTap,
      onFloorDetected,
      onModelLoadStart,
      onModelLoadEnd,
    }),
    [
      placed,
      selectedId,
      selected,
      loadingFurnitureId,
      showFloorPlanes,
      onSceneTap,
      onEmptySceneTap,
      onObjectTap,
      markNodeTapped,
      consumeNodeTap,
      onFloorDetected,
      onModelLoadStart,
      onModelLoadEnd,
    ],
  );

  const undo = useCallback(() => {
    setPlaced((p) => {
      if (!p.length) return p;
      const last = p[p.length - 1];
      setSelectedId((sid) => (sid === last.id ? null : sid));
      return p.slice(0, -1);
    });
  }, []);

  const clearAll = useCallback(() => {
    setPlaced([]);
    setSelectedId(null);
  }, []);

  const saveAndFinish = useCallback(async () => {
    if (!placed.length || savingShot) return;
    setSavingShot(true);
    setSelectedId(null);
    setSelected(null);
    // Let overlays dismiss before capture
    await new Promise((r) => setTimeout(r, 120));
    try {
      const result = await viroRef.current?.arSceneNavigator?.takeScreenshot(
        `interio-ar-${Date.now()}`,
        false,
      );
      if (!result?.success || !result.url) {
        Toast.show({
          type: "error",
          text1: "Could not capture room",
          text2: "Try again with pieces still placed.",
        });
        return;
      }
      await saveArShotFromCapture({
        sourceUri: result.url,
        pieceNames: placed.map((p) => p.name),
      });
      Toast.show({
        type: "success",
        text1: "Saved to your collection",
        text2: "Find it under Saved → AR rooms",
      });
      router.replace({
        pathname: "/(tabs)/saved",
        params: { tab: "rooms" },
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Could not save AR shot",
      });
    } finally {
      setSavingShot(false);
    }
  }, [placed, router, savingShot]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={palette.sage} />
      </View>
    );
  }

  const hint = loadingFurnitureId
    ? "Loading model…"
    : selectedPlaced
      ? `Editing “${selectedPlaced.name}” · drag · pinch · twist`
      : selected
        ? floorCount > 0
          ? `Tap a green floor patch to place “${selected.name}”`
          : "Scan the floor slowly until green surfaces appear"
        : placed.length > 0
          ? "Tap near a piece to edit · Save when you’re done"
          : "Pick a piece, then scan the floor to place";

  const statusClearance = Math.max(
    insets.top,
    RNStatusBar.currentHeight ?? 0,
    48,
  );

  // Slim tray ~ cards + one toolbar row (no tab bar on this screen)
  const trayClearance = 168 + Math.max(insets.bottom, 0);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <ViroARSceneNavigator
        ref={viroRef}
        style={styles.viro}
        autofocus
        initialScene={INITIAL_SCENE}
        viroAppProps={viroAppProps}
      />

      {selectedPlaced ? (
        <ARFingerGestures
          topInset={statusClearance + 56}
          bottomInset={trayClearance}
          getPose={getSelectedPose}
          onPoseChange={onSelectedPoseChange}
          onTap={() => setSelectedId(null)}
        />
      ) : null}

      {/* Compact nav chrome — clear back, slim title */}
      <View
        style={[styles.topChrome, { paddingTop: statusClearance + 8 }]}
        pointerEvents="box-none"
      >
        <View style={styles.topRow}>
          <Pressable
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/");
              }
            }}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Back to home"
            hitSlop={8}
          >
            <Feather name="arrow-left" size={18} color={palette.text} />
            <Text style={styles.backLabel}>Home</Text>
          </Pressable>

          <View style={styles.topCopy}>
            <Text style={styles.topEyebrow}>Place in room</Text>
            <Text style={styles.topTitle}>AR studio</Text>
          </View>

          {placed.length > 0 ? (
            <Pressable
              style={[styles.saveRoomBtn, savingShot && styles.saveRoomBtnBusy]}
              onPress={saveAndFinish}
              disabled={savingShot}
              accessibilityLabel="Save AR room to Saved"
            >
              {savingShot ? (
                <ActivityIndicator size="small" color={palette.bg} />
              ) : (
                <>
                  <Feather name="camera" size={14} color={palette.bg} />
                  <Text style={styles.saveRoomText}>Save</Text>
                </>
              )}
            </Pressable>
          ) : (
            <View style={styles.topMetaSpacer} />
          )}
        </View>
      </View>

      {/* Compact tray — catalogue + actions */}
      <View
        style={[
          styles.tray,
          { paddingBottom: Math.max(insets.bottom, 8) },
        ]}
      >
        <View style={styles.trayToolbar}>
          <Text style={styles.hint} numberOfLines={1}>
            {hint}
          </Text>
          <View style={styles.trayActions}>
            <Pressable
              style={[styles.iconBtn, !placed.length && styles.iconBtnDisabled]}
              onPress={undo}
              disabled={!placed.length}
              accessibilityLabel="Undo last placement"
            >
              <Feather name="corner-up-left" size={15} color={palette.text} />
            </Pressable>
            <Pressable
              style={[
                styles.iconBtn,
                styles.iconBtnDanger,
                !placed.length && styles.iconBtnDisabled,
              ]}
              onPress={clearAll}
              disabled={!placed.length}
              accessibilityLabel="Clear all placements"
            >
              <Feather name="trash-2" size={15} color={palette.danger} />
            </Pressable>
          </View>
        </View>

        <FlatList
          horizontal
          data={items}
          keyExtractor={(it) => it.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trayList}
          renderItem={({ item }) => {
            const active = selected?.id === item.id;
            const isLoading = loadingFurnitureId === item.id;
            return (
              <Pressable
                disabled={!!loadingFurnitureId}
                onPress={() => {
                  if (loadingFurnitureId) return;
                  setSelectedId(null);
                  setSelected((s) => (s?.id === item.id ? null : item));
                }}
                style={[
                  styles.trayItem,
                  active && styles.trayItemActive,
                  isLoading && styles.trayItemLoading,
                  loadingFurnitureId &&
                    !isLoading &&
                    styles.trayItemDimmed,
                ]}
              >
                <View style={styles.trayImgWrap}>
                  <Image
                    source={item.image ?? { uri: item.imageUrl }}
                    style={[styles.trayImg, isLoading && styles.trayImgDim]}
                    resizeMode="cover"
                  />
                  {isLoading ? (
                    <View style={styles.trayLoadingOverlay}>
                      <ActivityIndicator
                        size="small"
                        color={palette.white}
                      />
                    </View>
                  ) : null}
                </View>
                <Text style={styles.trayName} numberOfLines={1}>
                  {isLoading ? "Loading…" : item.name}
                </Text>
                {active && !isLoading ? (
                  <View style={styles.trayCheck}>
                    <Feather name="check" size={10} color={palette.white} />
                  </View>
                ) : null}
              </Pressable>
            );
          }}
        />
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.bg,
  },

  viro: {
    flex: 1,
  },

  topChrome: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: "rgba(250, 248, 244, 0.96)",
    paddingHorizontal: space.md,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.borderSubtle,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 12,
    borderRadius: radius.full,
    backgroundColor: palette.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
  },
  backLabel: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 13,
    color: palette.text,
    letterSpacing: -0.1,
  },
  topCopy: {
    flex: 1,
    minWidth: 0,
  },
  topEyebrow: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: palette.sageDeep,
    marginBottom: 1,
  },
  topTitle: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.3,
    color: palette.text,
  },
  topMeta: {
    fontFamily: fontFamily.sans,
    fontSize: 12,
    color: palette.textMuted,
  },
  topMetaSpacer: {
    width: 8,
  },
  saveRoomBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: palette.text,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radius.full,
    minWidth: 72,
    justifyContent: "center",
  },
  saveRoomBtnBusy: {
    opacity: 0.7,
  },
  saveRoomText: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 13,
    color: palette.bg,
  },

  tray: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.borderSubtle,
    paddingTop: 8,
  },
  trayToolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.md,
    marginBottom: 6,
    gap: 8,
  },
  hint: {
    flex: 1,
    fontFamily: fontFamily.sans,
    fontSize: 12,
    lineHeight: 16,
    color: palette.textSecondary,
  },
  trayActions: {
    flexDirection: "row",
    gap: 6,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnDanger: {
    borderColor: "rgba(184, 58, 50, 0.28)",
    backgroundColor: palette.dangerBg,
  },
  iconBtnDisabled: {
    opacity: 0.35,
  },

  trayList: {
    paddingHorizontal: space.md,
    paddingBottom: 4,
    gap: 8,
  },
  trayItem: {
    width: 76,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: palette.surface,
    borderWidth: 1.5,
    borderColor: "transparent",
    paddingBottom: 6,
  },
  trayItemActive: {
    borderColor: palette.text,
    backgroundColor: palette.elevated,
  },
  trayItemLoading: {
    borderColor: palette.sageDeep,
  },
  trayItemDimmed: {
    opacity: 0.45,
  },
  trayImgWrap: {
    height: 56,
    backgroundColor: palette.surface,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  trayImg: {
    width: "100%",
    height: "100%",
  },
  trayImgDim: {
    opacity: 0.35,
  },
  trayLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(28, 25, 22, 0.45)",
  },
  trayName: {
    fontFamily: fontFamily.sansMedium,
    color: palette.text,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: -0.1,
    paddingHorizontal: 4,
    textAlign: "center",
  },
  trayCheck: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: palette.text,
    alignItems: "center",
    justifyContent: "center",
  },
});
