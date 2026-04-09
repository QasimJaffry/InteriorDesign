import { BUNDLED_FURNITURE } from "@/constants/bundledFurniture";
import type { Furniture } from "@/types/models";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

type FurnitureContextValue = {
  items: Furniture[];
  loading: boolean;
  error: string | null;
  /** Bundled catalogue only (no Firestore, or empty collection / error). */
  isDemoCatalog: boolean;
};

const FurnitureContext = createContext<FurnitureContextValue | undefined>(
  undefined,
);

export function FurnitureProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Furniture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoCatalog, setIsDemoCatalog] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setItems(BUNDLED_FURNITURE);
      setIsDemoCatalog(true);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    const q = query(collection(getDb(), "furniture"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const next: Furniture[] = snap.docs.map((d) => {
          const data = d.data() as Omit<Furniture, "id">;
          return { id: d.id, ...data };
        });
        next.sort((a, b) => a.name.localeCompare(b.name));
        if (next.length === 0) {
          setItems(BUNDLED_FURNITURE);
          setIsDemoCatalog(true);
        } else {
          setItems(next);
          setIsDemoCatalog(false);
        }
        setLoading(false);
        setError(null);
      },
      (e) => {
        setError(e.message);
        setItems(BUNDLED_FURNITURE);
        setIsDemoCatalog(true);
        setLoading(false);
      },
    );
    return unsub;
  }, []);

  const value = useMemo(
    () => ({ items, loading, error, isDemoCatalog }),
    [items, loading, error, isDemoCatalog],
  );

  return (
    <FurnitureContext.Provider value={value}>
      {children}
    </FurnitureContext.Provider>
  );
}

export function useFurniture() {
  const ctx = useContext(FurnitureContext);
  if (!ctx) {
    throw new Error("useFurniture must be used within FurnitureProvider");
  }
  return ctx;
}
