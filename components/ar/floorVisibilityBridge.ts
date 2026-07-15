/** Bridge tray → AR scene (ViroARScene often does not re-render on React props). */

let showFloorPlanes = false;
const listeners = new Set<() => void>();

export function setShowFloorPlanes(next: boolean) {
  if (showFloorPlanes === next) return;
  showFloorPlanes = next;
  listeners.forEach((l) => l());
}

export function getShowFloorPlanes() {
  return showFloorPlanes;
}

export function subscribeShowFloorPlanes(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
