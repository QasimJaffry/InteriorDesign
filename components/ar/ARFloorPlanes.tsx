// @ts-nocheck — Viro plane/quad props are loosely typed.
/**
 * Floor overlays — mirrors Viro’s ViroARPlaneSelector (2.43.x source):
 * fixed plane slots, always-on ViroQuad, onAnchorFound/Updated, onClickState === 3.
 * @see https://viro-community.readme.io/docs/viroarplane
 * @see node_modules/@reactvision/react-viro/.../ViroARPlaneSelector.js
 */
import React, { useEffect, useRef, useState } from "react";
import {
  ViroARPlane,
  ViroMaterials,
  ViroNode,
  ViroQuad,
} from "@reactvision/react-viro";

import {
  getShowFloorPlanes,
  subscribeShowFloorPlanes,
} from "@/components/ar/floorVisibilityBridge";

ViroMaterials.createMaterials({
  InterioFloorHint: {
    lightingModel: "Constant",
    // Same AA alpha pattern as ViroARPlaneSelector_Translucent ("#88888888")
    diffuseColor: "#6B8F7ACC",
  },
});

const SLOT_COUNT = 15;
const PLANE_PREFIX = "InterioFloor_";

type PlaneData = {
  width: number;
  height: number;
  center: [number, number, number];
  anchorId?: string;
};

type Props = {
  onFloorTap: (worldPos: [number, number, number]) => void;
  onFloorDetected?: (count: number) => void;
};

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

function normalizePlane(updateMap: any): PlaneData {
  const width = Math.max(0.25, Number(updateMap?.width) || 0.5);
  const height = Math.max(0.25, Number(updateMap?.height) || 0.5);
  const c = updateMap?.center;
  const center: [number, number, number] = isWorldPos(c)
    ? [c[0], c[1], c[2]]
    : [0, 0, 0];
  return {
    width,
    height,
    center,
    anchorId: updateMap?.anchorId,
  };
}

export function ARFloorPlanes({ onFloorTap, onFloorDetected }: Props) {
  // Same structure as ViroARPlaneSelector state.foundARPlanes
  const [foundARPlanes, setFoundARPlanes] = useState<(PlaneData | null)[]>(
    () => Array.from({ length: SLOT_COUNT }, () => null),
  );
  // Re-render when tray place-mode toggles (bridge), not only on anchor events.
  const [, setVisibilityTick] = useState(0);

  useEffect(() => subscribeShowFloorPlanes(() => setVisibilityTick((n) => n + 1)), []);

  const callbacksRef = useRef({ onFloorTap, onFloorDetected });
  callbacksRef.current = { onFloorTap, onFloorDetected };
  const countRef = useRef(0);

  const onARPlaneUpdated = (index: number) => (updateMap: any) => {
    if (!updateMap) return;
    const plane = normalizePlane(updateMap);
    setFoundARPlanes((prev) => {
      const next = [...prev];
      next[index] = plane;
      const count = next.filter(Boolean).length;
      if (count !== countRef.current) {
        countRef.current = count;
        callbacksRef.current.onFloorDetected?.(count);
      }
      return next;
    });
  };

  const onARPlaneRemoved = (index: number) => () => {
    setFoundARPlanes((prev) => {
      if (!prev[index]) return prev;
      const next = [...prev];
      next[index] = null;
      const count = next.filter(Boolean).length;
      countRef.current = count;
      callbacksRef.current.onFloorDetected?.(count);
      return next;
    });
  };

  const onClickSurface = (
    index: number,
    clickState: number,
    position: unknown,
  ) => {
    // Viro docs / selector: 1 start, 2 move, 3 end
    if (clickState < 3) return;
    if (!getShowFloorPlanes()) return;
    if (!foundARPlanes[index] && !isWorldPos(position)) return;

    if (isWorldPos(position)) {
      callbacksRef.current.onFloorTap([
        position[0],
        position[1],
        position[2],
      ]);
      return;
    }

    const plane = foundARPlanes[index];
    if (plane) {
      callbacksRef.current.onFloorTap(plane.center);
    }
  };

  // Live place-mode from bridge (updated whenever tray selection changes).
  const show = getShowFloorPlanes();

  return (
    <ViroNode>
      {foundARPlanes.map((foundARPlane, i) => {
        const hasPlaneData = !!foundARPlane;
        const surfaceWidth = hasPlaneData ? foundARPlane.width : 0.5;
        const surfaceHeight = hasPlaneData ? foundARPlane.height : 0.5;
        const surfacePosition = hasPlaneData
          ? foundARPlane.center
          : ([0, 0, 0] as [number, number, number]);
        const anchorId = hasPlaneData ? foundARPlane.anchorId : undefined;

        // Match selector: always mount Quad; opacity carries visibility.
        // Only bright when place-mode AND this slot has a real plane.
        const opacity = show && hasPlaneData ? 0.7 : 0;

        return (
          <ViroARPlane
            key={PLANE_PREFIX + i}
            minWidth={0.2}
            minHeight={0.2}
            alignment="Horizontal"
            anchorId={anchorId}
            onAnchorFound={onARPlaneUpdated(i)}
            onAnchorUpdated={onARPlaneUpdated(i)}
            onAnchorRemoved={onARPlaneRemoved(i)}
          >
            <ViroQuad
              materials={["InterioFloorHint"]}
              position={surfacePosition}
              width={surfaceWidth}
              height={surfaceHeight}
              rotation={[-90, 0, 0]}
              opacity={opacity}
              onClickState={(clickState, position) =>
                onClickSurface(i, clickState, position)
              }
            />
          </ViroARPlane>
        );
      })}
    </ViroNode>
  );
}
