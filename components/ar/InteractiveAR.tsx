import {
  Viro3DObject,
  ViroARPlaneSelector,
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
import type { Furniture } from "@/types/models";

// ─── Types ───────────────────────────────────────────────────────────────────

export type PlacedModel = {
  id: string;
  position: [number, number, number];
  rotationY: number; // degrees, Y-axis only
  scale: number;     // uniform scale
  modelUrl: string;
  name: string;
};

type ARPlanePayload = {
  position?: number[];  // world-space anchor [x, y, z]
  center?: number[];    // plane-local 2D [x, z] — not for placement
  width?: number;
  height?: number;
  anchorId?: string;
};

type ARViroAppProps = {
  placed: PlacedModel[];
  selectedId: string | null;
  onPlaneSelected: (plane: ARPlanePayload, reset: () => void) => void;
  onObjectTap: (id: string) => void;
  onObjectDrag: (id: string, pos: [number, number, number]) => void;
  onObjectPinch: (id: string, scale: number) => void;
  onObjectRotate: (id: string, rotY: number) => void;
};

// ─── Per-object piece (inside the Viro scene) ────────────────────────────────

function FurniturePiece({
  model,
  app,
}: {
  model: PlacedModel;
  app: ARViroAppProps;
}) {
  // Scale: Viro accumulates getScaleFactor() natively → scaleFactor is cumulative from
  // gesture start (e.g. 1.0 → 1.3 → 1.7). Capture the model scale at gesture start and
  // multiply by the cumulative factor. Do NOT apply at pinchState=1 (value ≈ 1.0 but can
  // cause a spurious state flush that disrupts the gesture).
  const gestureBaseScaleRef = useRef(model.scale);

  // Rotation: getRotateRadians() returns the per-frame angular delta in RADIANS between
  // the current and previous touch-vector positions (incremental, not cumulative).
  // We must accumulate these deltas ourselves and convert to degrees for ViroNode.rotation.
  const gestureBaseRotRef = useRef(model.rotationY);
  const rotAccDegRef = useRef(0);

  return (
    <ViroNode
      position={model.position}
      rotation={[0, model.rotationY, 0]}
      scale={[model.scale, model.scale, model.scale]}
      onTap={() => app.onObjectTap(model.id)}
      dragType="FixedToPlane"
      dragPlane={{
        planePoint: [0, model.position[1], 0],
        planeNormal: [0, 1, 0],
        maxDistance: 10,
      }}
      onDrag={(dragToPos) =>
        app.onObjectDrag(model.id, dragToPos as [number, number, number])
      }
      onPinch={(pinchState, scaleFactor) => {
        if (pinchState === 1) {
          // Capture scale at gesture start; skip applying — scaleFactor ≈ 1.0 here
          gestureBaseScaleRef.current = model.scale;
          return;
        }
        // scaleFactor is cumulative: apply against the frozen gesture-start base
        const next = Math.max(0.04, Math.min(2.0, gestureBaseScaleRef.current * scaleFactor));
        app.onObjectPinch(model.id, next);
      }}
      onRotate={(rotateState, rotationFactor) => {
        if (rotateState === 1) {
          // Capture rotation base and reset per-gesture accumulator
          gestureBaseRotRef.current = model.rotationY;
          rotAccDegRef.current = 0;
          return;
        }
        // rotationFactor is an incremental per-frame delta in RADIANS → convert + accumulate
        rotAccDegRef.current += (rotationFactor * 180) / Math.PI;
        app.onObjectRotate(model.id, gestureBaseRotRef.current - rotAccDegRef.current);
      }}
    >
      <Viro3DObject
        source={{ uri: model.modelUrl }}
        type="GLB"
        scale={[1, 1, 1]}
        position={[0, 0, 0]}
        onError={(e) =>
          Toast.show({
            type: "error",
            text1: "Model failed to load",
            text2: String((e as { nativeEvent?: { error?: string } }).nativeEvent?.error ?? model.modelUrl),
          })
        }
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
  const app = sceneNavigator.viroAppProps;
  const selectorRef = useRef<ViroARPlaneSelector | null>(null);

  return (
    <ViroARScene>
      {/* Soft fill light */}
      <ViroAmbientLight color="#ffffff" intensity={200} />
      {/* Key light from upper-front-right for depth */}
      <ViroDirectionalLight
        color="#fff8f0"
        direction={[0.3, -1, -0.4]}
        castsShadow
        shadowOpacity={0.45}
        shadowOrthographicSize={5}
      />
      {/* Weaker back/rim light to avoid pure-black undersides */}
      <ViroDirectionalLight
        color="#d0e8ff"
        direction={[-0.2, 0.5, 0.8]}
        castsShadow={false}
      />

      <ViroARPlaneSelector
        ref={selectorRef}
        alignment="Horizontal"
        onPlaneSelected={(plane: ARPlanePayload) => {
          app.onPlaneSelected(plane, () => selectorRef.current?.reset());
        }}
      />

      {app.placed.map((model) => (
        <FurniturePiece key={model.id} model={model} app={app} />
      ))}
    </ViroARScene>
  );
}

// ─── Stable scene descriptor ─────────────────────────────────────────────────
// Must live outside InteractiveAR so its reference never changes between renders.
// Viro treats a changed `initialScene` object as a brand-new scene and resets
// the entire AR context — wiping every placed object on each setState call.
const INITIAL_SCENE = {
  scene: ARScene as unknown as () => React.JSX.Element,
};

// ─── Main component ───────────────────────────────────────────────────────────

export function InteractiveAR() {
  const { items, loading, error } = useFurniture();
  const [selected, setSelected] = React.useState<Furniture | null>(null);
  const [placed, setPlaced] = React.useState<PlacedModel[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (error) {
      Toast.show({ type: "error", text1: "Furniture list", text2: error });
    }
  }, [error]);

  // ── Placement ──────────────────────────────────────────────────────────────

  const onPlaneSelected = useCallback(
    (plane: ARPlanePayload, resetSelector: () => void) => {
      if (!selected) {
        Toast.show({
          type: "info",
          text1: "Select furniture first",
          text2: "Pick an item from the tray, then tap a detected surface.",
        });
        resetSelector();
        return;
      }
      const pos = plane.position;
      if (!Array.isArray(pos) || pos.length < 3) {
        resetSelector();
        return;
      }
      const newId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      setPlaced((prev) => [
        ...prev,
        {
          id: newId,
          position: [pos[0], pos[1], pos[2]],
          rotationY: 0,
          scale: 0.2,
          modelUrl: selected.modelUrl,
          name: selected.name,
        },
      ]);
      // Auto-select the newly placed piece so user can immediately adjust it
      setSelectedId(newId);
      resetSelector();
    },
    [selected],
  );

  // ── Object manipulation ────────────────────────────────────────────────────

  const onObjectTap = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const onObjectDrag = useCallback(
    (id: string, pos: [number, number, number]) => {
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

  // ── viroAppProps (passed into the AR scene) ────────────────────────────────

  const viroAppProps = useMemo(
    () => ({
      placed,
      selectedId,
      onPlaneSelected,
      onObjectTap,
      onObjectDrag,
      onObjectPinch,
      onObjectRotate,
    }),
    [placed, selectedId, onPlaneSelected, onObjectTap, onObjectDrag, onObjectPinch, onObjectRotate],
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
        <ActivityIndicator size="large" color="#c45c5c" />
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

      {/* ── Floating status bar ── */}
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
                ? `Tap a surface to place "${selected.name}"`
                : "Select furniture below"}
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
  root: { flex: 1, backgroundColor: "#000" },
  ar: { flex: 1 },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f12",
  },

  // Status bar
  statusRow: {
    position: "absolute",
    top: 52,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  statusPill: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.58)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
  },
  statusTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 2,
  },
  statusHint: {
    color: "#bbc",
    fontSize: 12,
    textAlign: "center",
  },
  doneBtn: {
    backgroundColor: "#c45c5c",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 10,
    justifyContent: "center",
  },
  doneBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  // Tray
  tray: {
    backgroundColor: "rgba(15,15,18,0.96)",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#2e2e38",
    paddingTop: 10,
    paddingBottom: 16,
  },
  trayList: {
    paddingHorizontal: 12,
    gap: 8,
  },
  trayItem: {
    width: 88,
    marginHorizontal: 4,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#1a1a20",
    borderWidth: 2,
    borderColor: "transparent",
  },
  trayItemActive: {
    borderColor: "#c45c5c",
  },
  trayImg: {
    width: "100%",
    height: 72,
    backgroundColor: "#2a2a32",
  },
  trayName: {
    color: "#ccd",
    fontSize: 11,
    padding: 6,
  },

  // Action buttons
  actions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 10,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#252530",
    alignItems: "center",
  },
  actionBtnDisabled: {
    opacity: 0.3,
  },
  actionText: {
    color: "#eef2f6",
    fontWeight: "600",
    fontSize: 14,
  },
});
