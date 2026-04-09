import { create } from "zustand";

type AppState = {
  scanFilter: string | null;
  savedIds: string[];
  setScanFilter: (value: string | null) => void;
  setSavedIds: (ids: string[]) => void;
  addSavedId: (id: string) => void;
  removeSavedId: (id: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  scanFilter: null,
  savedIds: [],
  setScanFilter: (scanFilter) => set({ scanFilter }),
  setSavedIds: (savedIds) => set({ savedIds }),
  addSavedId: (id) =>
    set((s) => ({
      savedIds: s.savedIds.includes(id) ? s.savedIds : [...s.savedIds, id],
    })),
  removeSavedId: (id) =>
    set((s) => ({ savedIds: s.savedIds.filter((x) => x !== id) })),
}));
