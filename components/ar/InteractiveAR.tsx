// @ts-nocheck — ViroReact’s published typings omit gesture props (onTap, onDrag, etc.) present at runtime.
import {
  Viro3DObject,
  ViroARScene,
  ViroARSceneNavigator,
  ViroAmbientLight,
  ViroDirectionalLight,
  ViroNode,
} from "@reactvision/react-viro";
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
  // Returns true (and clears the flag) if a child node already handled this tap
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
  // Viro registers native gesture handlers ONCE at mount and never updates them
  // when the JS callback prop changes. All mutable values used inside gesture
  // handlers MUST be read from refs, not from the (stale) closure.
  const modelRef = useRef(model);
  modelRef.current = model;
  const appRef = useRef(app);
  appRef.current = app;

  // Drag plane Y is locked at placement so the plane never shifts mid-drag
  const dragPlaneY = useRef(model.position[1]);

  // Gesture base values — captured fresh at gesture start via refs
  const gestureBaseScaleRef = useRef(model.scale);
  const gestureBaseRotRef = useRef(model.rotationY);

  return (
    <ViroNode
      position={model.position}
      rotation={[0, model.rotationY, 0]}
      scale={[model.scale, model.scale, model.scale]}
      onTap={() => {
        // Mark this tap as consumed by a node BEFORE it bubbles to ViroARScene
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
          // Capture the real current scale at gesture start
          gestureBaseScaleRef.current = modelRef.current.scale;
          return;
        }
        // scaleFactor is cumulative from gesture start → multiply against base
        const next = Math.max(
          0.04,
          Math.min(2.0, gestureBaseScaleRef.current * scaleFactor),
        );
        appRef.current.onObjectPinch(modelRef.current.id, next);
      }}
      onRotate={(rotateState, rotationFactor) => {
        if (rotateState === 1) {
          // Capture the real current rotation at gesture start
          gestureBaseRotRef.current = modelRef.current.rotationY;
          return;
        }
        // rotationFactor is CUMULATIVE from gesture start (in radians) — do NOT
        // accumulate it again. Apply it directly against the frozen base angle.
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
  // Viro's onTap native handler is registered once — keep a ref so it always
  // reads the latest viroAppProps even as selected/pendingItem changes.
  const appRef = useRef(sceneNavigator.viroAppProps);
  appRef.current = sceneNavigator.viroAppProps;

  return (
    <ViroARScene
      onTap={(position) => {
        const app = appRef.current;
        // If a child ViroNode already handled this tap, don't also place a new object
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

// ─── Stable scene descriptor ─────────────────────────────────────────────────
const INITIAL_SCENE = {
  scene: ARScene as unknown as () => React.JSX.Element,
};

// ─── Main component ───────────────────────────────────────────────────────────

export function InteractiveAR() {
  const { items, loading, error } = useFurniture();
  const [selected, setSelected] = React.useState<Furniture | null>(null);
  const [placed, setPlaced] = React.useState<PlacedModel[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  // Debounce placement: Viro fires onTap twice per physical tap (touch-down +
  // touch-up). Without this you'd place two objects per tap.
  const lastPlacedAtRef = useRef(0);

  // Throttle drag state updates to ~30fps — onDrag fires at 60fps and each
  // setPlaced call re-renders every placed model.
  const dragThrottleRef = useRef<Record<string, number>>({});

  // Tap-bubbling suppression: ViroNode.onTap bubbles up to ViroARScene.onTap.
  // When a placed object is tapped, we set this flag so the scene handler
  // ignores the same event instead of also placing a new object.
  const nodeTappedRef = useRef(false);

  React.useEffect(() => {
    if (error) {
      Toast.show({ type: "error", text1: "Furniture list", text2: error });
    }
  }, [error]);

  // ── Tap-to-place ──────────────────────────────────────────────────────────

  const onSceneTap = useCallback(
    (position: [number, number, number]) => {
      if (!selected) return;
      const now = Date.now();
      if (now - lastPlacedAtRef.current < 600) return; // debounce double-fire
      lastPlacedAtRef.current = now;

      const newId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      setPlaced((prev) => [
        ...prev,
        {
          id: newId,
          position,
          rotationY: 0,
          scale: 0.2,
          modelUrl: selected.modelUrl,
          name: selected.name,
        },
      ]);
      setSelectedId(newId);
    },
    [selected],
  );

  // ── Object manipulation ────────────────────────────────────────────────────

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

  const onObjectDrag = useCallback(
    (id: string, pos: [number, number, number]) => {
      const now = Date.now();
      if ((now - (dragThrottleRef.current[id] ?? 0)) < 33) return;
      dragThrottleRef.current[id] = now;
      setPlaced((prev) =>
        prev.map((m) => (m.id === id ? { ...m, position: pos } : m)),
      );
    },
    [],
  );

  const onObjectPinch = useCallback((id: string, scale: number) => {
    setPlaced((prev) =>
      prev.map((m) => (m.id === id ? { ...m, scale } : m)),
    );
  }, []);

  const onObjectRotate = useCallback((id: string, rotY: number) => {
    setPlaced((prev) =>
      prev.map((m) => (m.id === id ? { ...m, rotationY: rotY } : m)),
    );
  }, []);

  // ── viroAppProps ───────────────────────────────────────────────────────────

  const viroAppProps = useMemo(
    () => ({
      placed,
      selectedId,
      pendingItem: selected,
      onSceneTap,
      onObjectTap,
      onObjectDrag,
      onObjectPinch,
      onObjectRotate,
      markNodeTapped,
      consumeNodeTap,
    }),
    [placed, selectedId, selected, onSceneTap, onObjectTap, onObjectDrag, onObjectPinch, onObjectRotate, markNodeTapped, consumeNodeTap],
  );

  // ── Helpers ────────────────────────────────────────────────────────────────

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

  // ── Render ────────────────────────────────────────────────────────────────

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
              <Text style={styles.statusTitle}>{selectedPlaced.name}</Text>
              <Text style={styles.statusHint}>
                Drag · Pinch to scale · Twist to rotate
              </Text>
            </>
          ) : (
            <Text style={styles.statusHint}>
              {selected
                ? `Tap anywhere to place "${selected.name}"`
                : "Select furniture below, then tap to place"}
            </Text>
          )}
        </View>

        {selectedPlaced && (
          <Pressable
            style={styles.doneBtn}
            onPress={() => setSelectedId(null)}
          >
            <Text style={styles.doneBtnText}>Done</Text>
          </Pressable>
        )}
      </View>

      {/* ── Furniture tray ── */}
      <View style={styles.tray}>
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
                onPress={() =>
                  setSelected((s) => (s?.id === item.id ? null : item))
                }
                style={[styles.trayItem, active && styles.trayItemActive]}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.trayImg} />
                <Text style={styles.trayName} numberOfLines={1}>
                  {item.name}
                </Text>
              </Pressable>
            );
          }}
        />

        <View style={styles.actions}>
          <Pressable
            style={[styles.actionBtn, !placed.length && styles.actionBtnDisabled]}
            onPress={undo}
            disabled={!placed.length}
          >
            <Text style={styles.actionText}>↩  Undo</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, !placed.length && styles.actionBtnDisabled]}
            onPress={clearAll}
            disabled={!placed.length}
          >
            <Text style={styles.actionText}>✕  Clear all</Text>
          </Pressable>
        </View>
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
    backgroundColor: palette.overlay,
    borderRadius: radius.lg,
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 2,
    alignItems: "center",
    borderWidth: 1,
    borderColor: palette.border,
  },
  statusTitle: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.white,
    fontSize: 14,
    marginBottom: 2,
  },
  statusHint: {
    fontFamily: fontFamily.sans,
    color: palette.textSecondary,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 17,
  },
  doneBtn: {
    backgroundColor: palette.sage,
    borderRadius: radius.lg,
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 2,
    justifyContent: "center",
  },
  doneBtnText: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.bg,
    fontSize: 14,
  },

  tray: {
    backgroundColor: palette.overlay,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.border,
    paddingTop: space.sm,
    paddingBottom: space.md,
  },
  trayList: {
    paddingHorizontal: space.md - 4,
    gap: space.sm,
  },
  trayItem: {
    width: 88,
    marginHorizontal: 4,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: "transparent",
  },
  trayItemActive: {
    borderColor: palette.sage,
  },
  trayImg: {
    width: "100%",
    height: 72,
    backgroundColor: palette.surface2,
  },
  trayName: {
    fontFamily: fontFamily.sans,
    color: palette.textSecondary,
    fontSize: 11,
    padding: 6,
  },

  actions: {
    flexDirection: "row",
    paddingHorizontal: space.md,
    marginTop: space.sm,
    gap: space.sm,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: space.md - 2,
    borderRadius: radius.md,
    backgroundColor: palette.surface2,
    alignItems: "center",
  },
  actionBtnDisabled: {
    opacity: 0.35,
  },
  actionText: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.text,
    fontSize: 14,
  },
});
