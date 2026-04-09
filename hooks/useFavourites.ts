import { useCallback, useEffect, useState } from "react";

import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import {
  loadLocalFavouriteIds,
  saveLocalFavouriteIds,
} from "@/lib/localUserStorage";
import type { FavouriteDoc } from "@/types/models";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { useAuthSession } from "@/contexts/AuthContext";
import { useAppStore } from "@/store/appStore";

export function useFavouritesSync() {
  const { user } = useAuthSession();
  const setSavedIds = useAppStore((s) => s.setSavedIds);

  useEffect(() => {
    if (!user) {
      setSavedIds([]);
      return;
    }
    if (!isFirebaseConfigured()) {
      let cancelled = false;
      void (async () => {
        const ids = await loadLocalFavouriteIds();
        if (!cancelled) {
          setSavedIds(ids);
        }
      })();
      return () => {
        cancelled = true;
      };
    }
    const ref = collection(getDb(), "users", user.uid, "favourites");
    const unsub = onSnapshot(ref, (snap) => {
      setSavedIds(snap.docs.map((d) => d.id));
    });
    return unsub;
  }, [user, setSavedIds]);
}

export function useToggleFavourite() {
  const { user } = useAuthSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toggle = useCallback(
    async (furnitureId: string, isSaved: boolean) => {
      if (!user) {
        throw new Error("Not signed in");
      }
      setBusy(true);
      setError(null);
      try {
        if (!isFirebaseConfigured()) {
          const ids = useAppStore.getState().savedIds;
          const next = isSaved
            ? ids.filter((id) => id !== furnitureId)
            : ids.includes(furnitureId)
              ? ids
              : [...ids, furnitureId];
          await saveLocalFavouriteIds(next);
          useAppStore.getState().setSavedIds(next);
          return;
        }
        const ref = doc(
          getDb(),
          "users",
          user.uid,
          "favourites",
          furnitureId,
        );
        if (isSaved) {
          await deleteDoc(ref);
        } else {
          const payload: FavouriteDoc = {
            furnitureId,
            savedAt: serverTimestamp() as FavouriteDoc["savedAt"],
          };
          await setDoc(ref, payload);
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Could not update favourite";
        setError(message);
        throw e;
      } finally {
        setBusy(false);
      }
    },
    [user],
  );

  return { toggle, busy, error };
}
