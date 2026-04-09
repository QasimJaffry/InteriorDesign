import { useMemo } from "react";

import { useFurniture } from "@/contexts/FurnitureContext";
import { useAppStore } from "@/store/appStore";

export function useSavedFurniture() {
  const { items: allFurniture, loading: catLoading, error: catError } =
    useFurniture();
  const savedIds = useAppStore((s) => s.savedIds);

  const savedItems = useMemo(() => {
    const set = new Set(savedIds);
    return allFurniture.filter((f) => set.has(f.id));
  }, [allFurniture, savedIds]);

  return {
    savedItems,
    loading: catLoading,
    error: catError,
  };
}
