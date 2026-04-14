// @ts-nocheck — ViroReact's published typings omit gesture props (onTap, onDrag, etc.) present at runtime.
import {
  Viro3DObject,
  ViroARScene,
  ViroARSceneNavigator,
  ViroAmbientLight,
  ViroDirectionalLight,
  ViroNode,
} from "@reactvision/react-viro";
import Feather from "@expo/vector-icons/Feather";
import React, { useCallback, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { useFurniture } from "@/contexts/FurnitureContext";
import { fontFamily, palette, radius, space } from "@/constants/theme";
import type { Furniture } from "@/types/models";

// ─── Types ───────────────────────────────────────────────────────────────────

export type PlacedModel = {
  id: string;
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
  onSceneTap: (position: [number, number, number]) => void;
  onObjectTap: (id: string) => void;
  onObjectDrag: (id: string, pos: [number, number, number]) => void;
  onObjectPinch: (id: string, scale: number) => void;
  onObjectRotate: (id: string, rotY: number) => void;
  markNodeTapped: () => void;
  consumeNodeTap: () => boolean;
};

// ─── Per-object piece ────────────────────────────────────────────────────────

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

  const dragPlaneY = useRef(model.position[1]);
  const gestureBaseScaleRef = useRef(model.scale);
  const gestureBaseRotRef = useRef(model.rotationY);

  return (
    <ViroNode
      position={model.position}
      rotation={[0, model.rotationY, 0]}
      scale={[model.scale, model.scale, model.scale]}
      onTap={() => {
        appRef.current.markNodeTapped();
        appRef.current.onObjectTap(modelRef.current.id);
      }}
      dragType="FixedToPlane"
      dragPlane={{
        planePoint: [0, dragPlaneY.current, 0],
        planeNormal: [0, 1, 0],
        maxDistance: 20,
      }}
      onDrag={(dragToPos) =>
        appRef.current.onObjectDrag(
          modelRef.current.id,
          dragToPos as [number, number, number],
        )
      }
      onPinch={(pinchState, scaleFactor) => {
        if (pinchState === 1) {
          gestureBaseScaleRef.current = modelRef.current.scale;
          return;
        }
        const next = Math.max(
          0.04,
          Math.min(2.0, gestureBaseScaleRef.current * scaleFactor),
        );
        appRef.current.onObjectPinch(modelRef.current.id, next);
      }}
      onRotate={(rotateState, rotationFactor) => {
        if (rotateState === 1) {
          gestureBaseRotRef.current = modelRef.current.rotationY;
          return;
        }
        const deltaDeg = (rotationFactor * 180) / Math.PI;
        appRef.current.onObjectRotate(
          modelRef.current.id,
          gestureBaseRotRef.current - deltaDeg,
        );
      }}
    >
      <Viro3DObject
        source={{ uri: model.modelUrl }}
        type="GLB"
        scale={[1, 1, 1]}
        position={[0, 0, 0]}
        onError={(e) => {
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
    </ViroNode>
  );
}

// ─── AR Scene ────────────────────────────────────────────────────────────────

function ARScene({
  sceneNavigator,
}: {
  sceneNavigator: { viroAppProps: ARViroAppProps };
}) {
  const appRef = useRef(sceneNavigator.viroAppProps);
  appRef.current = sceneNavigator.viroAppProps;

  return (
    <ViroARScene
      onTap={(position) => {
        const app = appRef.current;
        if (app.consumeNodeTap()) return;
        if (!app.pendingItem) return;
        app.onSceneTap(position as [number, number, number]);
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
      {sceneNavigator.viroAppProps.placed.map((model) => (
        <FurniturePiece
          key={model.id}
          model={model}
          app={sceneNavigator.viroAppProps}
        />
      ))}
    </ViroARScene>
  );
}

const INITIAL_SCENE = {
  scene: ARScene as unknown as () => React.JSX.Element,
};

// ─── Main component ───────────────────────────────────────────────────────────

export function InteractiveAR() {
  const { items, loading, error } = useFurniture();
  const [selected, setSelected] = React.useState<Furniture | null>(null);
  const [placed, setPlaced] = React.useState<PlacedModel[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const lastPlacedAtRef = useRef(0);
  const dragThrottleRef = useRef<Record<string, number>>({});
  const nodeTappedRef = useRef(false);

  React.useEffect(() => {
    if (error) {
      Toast.show({ type: "error", text1: "Furniture list", text2: error });
    }
  }, [error]);

  const onSceneTap = useCallback(
    (position: [number, number, number]) => {
      if (!selected) return;
      const now = Date.now();
      if (now - lastPlacedAtRef.current < 600) return;
      lastPlacedAtRef.current = now;
      const newId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      setPlaced((prev) => [
        ...prev,
        { id: newId, position, rotationY: 0, scale: 0.2, modelUrl: selected.modelUrl, name: selected.name },
      ]);
      setSelectedId(newId);
    },
    [selected],
  );

  const markNodeTapped = useCallback(() => { nodeTappedRef.current = true; }, []);
  const consumeNodeTap = useCallback(() => {
    if (!nodeTappedRef.current) return false;
    nodeTappedRef.current = false;
    return true;
  }, []);

  const onObjectTap = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const onObjectDrag = useCallback((id: string, pos: [number, number, number]) => {
    const now = Date.now();
    if ((now - (dragThrottleRef.current[id] ?? 0)) < 33) return;
    dragThrottleRef.current[id] = now;
    setPlaced((prev) => prev.map((m) => (m.id === id ? { ...m, position: pos } : m)));
  }, []);

  const onObjectPinch = useCallback((id: string, scale: number) => {
    setPlaced((prev) => prev.map((m) => (m.id === id ? { ...m, scale } : m)));
  }, []);

  const onObjectRotate = useCallback((id: string, rotY: number) => {
    setPlaced((prev) => prev.map((m) => (m.id === id ? { ...m, rotationY: rotY } : m)));
  }, []);

  const viroAppProps = useMemo(
    () => ({ placed, selectedId, pendingItem: selected, onSceneTap, onObjectTap, onObjectDrag, onObjectPinch, onObjectRotate, markNodeTapped, consumeNodeTap }),
    [placed, selectedId, selected, onSceneTap, onObjectTap, onObjectDrag, onObjectPinch, onObjectRotate, markNodeTapped, consumeNodeTap],
  );

  const selectedPlaced = placed.find((p) => p.id === selectedId);

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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={palette.sage} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ViroARSceneNavigator
        style={styles.ar}
        initialScene={INITIAL_SCENE}
        viroAppProps={viroAppProps}
      />

      {/* ── Status bar ── */}
      <View style={styles.statusRow} pointerEvents="box-none">
        <View style={styles.statusPill} pointerEvents="none">
          {selectedPlaced ? (
            <>
              <View style={styles.statusDot} />
              <View>
                <Text style={styles.statusTitle}>{selectedPlaced.name}</Text>
                <Text style={styles.statusHint}>Drag · Pinch · Twist to rotate</Text>
              </View>
            </>
          ) : (
            <>
              <View style={[styles.statusDot, styles.statusDotIdle]} />
              <Text style={styles.statusHint}>
                {selected
                  ? `Tap anywhere to place "${selected.name}"`
                  : "Select furniture below, then tap to place"}
              </Text>
            </>
          )}
        </View>

        {selectedPlaced && (
          <Pressable style={styles.doneBtn} onPress={() => setSelectedId(null)}>
            <Text style={styles.doneBtnText}>Done</Text>
          </Pressable>
        )}
      </View>

      {/* ── Bottom tray ── */}
      <View style={styles.tray}>
        {/* Tray header: title + action icon buttons */}
        <View style={styles.trayHeader}>
          <Text style={styles.trayTitle}>
            {selected ? selected.name : "Choose furniture"}
          </Text>
          <View style={styles.trayActions}>
            <Pressable
              style={[styles.iconBtn, !placed.length && styles.iconBtnDisabled]}
              onPress={undo}
              disabled={!placed.length}
            >
              <Feather name="corner-up-left" size={18} color={palette.text} />
            </Pressable>
            <Pressable
              style={[styles.iconBtn, styles.iconBtnDanger, !placed.length && styles.iconBtnDisabled]}
              onPress={clearAll}
              disabled={!placed.length}
            >
              <Feather name="trash-2" size={18} color={palette.danger} />
            </Pressable>
          </View>
        </View>

        {/* Placed count badge */}
        {placed.length > 0 && (
          <View style={styles.placedBadge} pointerEvents="none">
            <Text style={styles.placedBadgeText}>
              {placed.length} {placed.length === 1 ? "item" : "items"} placed
            </Text>
          </View>
        )}

        {/* Horizontal furniture list */}
        <FlatList
          horizontal
          data={items}
          keyExtractor={(it) => it.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trayList}
          renderItem={({ item }) => {
            const active = selected?.id === item.id;
            return (
              <Pressable
                onPress={() => setSelected((s) => (s?.id === item.id ? null : item))}
                style={[styles.trayItem, active && styles.trayItemActive]}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.trayImg} />
                <View style={styles.trayMeta}>
                  <Text style={styles.trayType} numberOfLines={1}>
                    {item.type}
                  </Text>
                  <Text style={styles.trayName} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
                {active && (
                  <View style={styles.trayCheck}>
                    <Feather name="check" size={12} color={palette.white} />
                  </View>
                )}
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
  root: { flex: 1, backgroundColor: palette.black },
  ar: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.bg,
  },

  // ── Status bar ────────────────────────────────────────────────────────────
  statusRow: {
    position: "absolute",
    top: 52,
    left: space.md,
    right: space.md,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space.sm,
  },
  statusPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: palette.overlay,
    borderRadius: radius.xl,
    paddingHorizontal: space.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.sage,
    flexShrink: 0,
  },
  statusDotIdle: {
    backgroundColor: palette.ice,
  },
  statusTitle: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.white,
    fontSize: 14,
    marginBottom: 1,
  },
  statusHint: {
    fontFamily: fontFamily.sans,
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    lineHeight: 17,
  },
  doneBtn: {
    backgroundColor: palette.sage,
    borderRadius: radius.full,
    paddingHorizontal: space.md,
    paddingVertical: 12,
    justifyContent: "center",
  },
  doneBtnText: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.white,
    fontSize: 14,
  },

  // ── Bottom tray ───────────────────────────────────────────────────────────
  tray: {
    backgroundColor: palette.elevated,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    paddingTop: space.sm,
    paddingBottom: space.lg,
  },
  trayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.md,
    marginBottom: space.sm,
  },
  trayTitle: {
    fontFamily: fontFamily.displaySemibold,
    color: palette.text,
    fontSize: 18,
    flex: 1,
  },
  trayActions: {
    flexDirection: "row",
    gap: space.xs,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnDanger: {
    borderColor: "rgba(212, 56, 56, 0.3)",
    backgroundColor: "rgba(212, 56, 56, 0.08)",
  },
  iconBtnDisabled: {
    opacity: 0.3,
  },
  placedBadge: {
    alignSelf: "flex-start",
    marginHorizontal: space.md,
    marginBottom: space.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: palette.sageMuted,
    borderWidth: 1,
    borderColor: palette.sageBorder,
  },
  placedBadgeText: {
    fontFamily: fontFamily.sansMedium,
    color: palette.sage,
    fontSize: 12,
  },

  // Tray items
  trayList: {
    paddingHorizontal: space.md,
    gap: space.sm,
  },
  trayItem: {
    width: 96,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: "transparent",
  },
  trayItemActive: {
    borderColor: palette.sage,
    backgroundColor: palette.surface2,
  },
  trayImg: {
    width: "100%",
    height: 76,
    backgroundColor: palette.surface2,
  },
  trayMeta: {
    padding: 7,
    paddingBottom: 8,
  },
  trayType: {
    fontFamily: fontFamily.sansMedium,
    color: palette.sage,
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  trayName: {
    fontFamily: fontFamily.sansMedium,
    color: palette.text,
    fontSize: 11,
    lineHeight: 15,
  },
  trayCheck: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: palette.sage,
    alignItems: "center",
    justifyContent: "center",
  },
});
