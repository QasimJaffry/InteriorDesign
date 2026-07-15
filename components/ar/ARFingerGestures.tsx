import React, { useMemo, useRef } from "react";
import { PanResponder, StyleSheet, View } from "react-native";

type Pose = {
  position: [number, number, number];
  rotationY: number;
  scale: number;
};

type Props = {
  /** Screen region above the tray / below the chrome that receives finger gestures */
  topInset: number;
  bottomInset: number;
  /** Current selected piece pose — read via getters so responders stay stable */
  getPose: () => Pose | null;
  onPoseChange: (next: Partial<Pose>) => void;
  onTap: () => void;
};

function touchDistance(
  a: { pageX: number; pageY: number },
  b: { pageX: number; pageY: number },
) {
  const dx = a.pageX - b.pageX;
  const dy = a.pageY - b.pageY;
  return Math.hypot(dx, dy);
}

function touchAngle(
  a: { pageX: number; pageY: number },
  b: { pageX: number; pageY: number },
) {
  return (Math.atan2(b.pageY - a.pageY, b.pageX - a.pageX) * 180) / Math.PI;
}

const MIN_SCALE = 0.05;
const MAX_SCALE = 5;
const DRAG_SENS = 0.0025;

/**
 * Finger gestures for the selected AR piece.
 * Viro’s onPinch/onRotate are unreliable on many Android AR builds; this layer
 * handles one-finger drag and two-finger pinch/rotate with PanResponder
 * (same approach as community Viro guidance).
 */
export function ARFingerGestures({
  topInset,
  bottomInset,
  getPose,
  onPoseChange,
  onTap,
}: Props) {
  const startPoseRef = useRef<Pose | null>(null);
  const startDistRef = useRef(1);
  const startAngleRef = useRef(0);
  const modeRef = useRef<"none" | "drag" | "pinch">("none");
  const movedRef = useRef(false);
  const callbacksRef = useRef({ getPose, onPoseChange, onTap });
  callbacksRef.current = { getPose, onPoseChange, onTap };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderTerminationRequest: () => false,

        onPanResponderGrant: (evt) => {
          const pose = callbacksRef.current.getPose();
          if (!pose) return;
          startPoseRef.current = { ...pose, position: [...pose.position] };
          movedRef.current = false;
          const touches = evt.nativeEvent.touches;
          if (touches.length >= 2) {
            modeRef.current = "pinch";
            startDistRef.current = Math.max(
              1,
              touchDistance(touches[0], touches[1]),
            );
            startAngleRef.current = touchAngle(touches[0], touches[1]);
          } else {
            modeRef.current = "drag";
          }
        },

        onPanResponderMove: (evt, gesture) => {
          let start = startPoseRef.current;
          if (!start) return;
          const touches = evt.nativeEvent.touches;

          if (touches.length >= 2) {
            if (modeRef.current !== "pinch") {
              // Second finger joined — snapshot current pose for pinch/rotate.
              const live = callbacksRef.current.getPose() ?? start;
              start = {
                position: [...live.position],
                scale: live.scale,
                rotationY: live.rotationY,
              };
              startPoseRef.current = start;
              modeRef.current = "pinch";
              startDistRef.current = Math.max(
                1,
                touchDistance(touches[0], touches[1]),
              );
              startAngleRef.current = touchAngle(touches[0], touches[1]);
            }
            movedRef.current = true;
            const dist = Math.max(1, touchDistance(touches[0], touches[1]));
            const ang = touchAngle(touches[0], touches[1]);
            const scale = Math.max(
              MIN_SCALE,
              Math.min(MAX_SCALE, start.scale * (dist / startDistRef.current)),
            );
            const rotationY =
              start.rotationY - (ang - startAngleRef.current);
            callbacksRef.current.onPoseChange({ scale, rotationY });
            return;
          }

          if (modeRef.current === "pinch") {
            // Lost a finger — ignore until release (avoid a jump into drag)
            return;
          }

          if (Math.abs(gesture.dx) > 2 || Math.abs(gesture.dy) > 2) {
            movedRef.current = true;
          }
          // One-finger drag on XZ (screen X → world X, screen Y → world Z)
          callbacksRef.current.onPoseChange({
            position: [
              start.position[0] + gesture.dx * DRAG_SENS,
              start.position[1],
              start.position[2] + gesture.dy * DRAG_SENS,
            ],
          });
        },

        onPanResponderRelease: () => {
          if (!movedRef.current) {
            callbacksRef.current.onTap();
          }
          modeRef.current = "none";
          startPoseRef.current = null;
        },

        onPanResponderTerminate: () => {
          modeRef.current = "none";
          startPoseRef.current = null;
        },
      }),
    [],
  );

  return (
    <View
      style={[styles.pad, { top: topInset, bottom: bottomInset }]}
      {...panResponder.panHandlers}
    />
  );
}

const styles = StyleSheet.create({
  pad: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});
