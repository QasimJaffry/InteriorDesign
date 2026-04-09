import type { Timestamp } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import {
  loadLocalScan,
  saveLocalScan,
  type LocalScanPayload,
} from "@/lib/localUserStorage";
import type { ScanResultDoc } from "@/types/models";
import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { useAuthSession } from "@/contexts/AuthContext";

const SCAN_DOC_ID = "latest";

function toScanDoc(p: LocalScanPayload): ScanResultDoc {
  return {
    detectedType: p.detectedType,
    confidence: p.confidence,
    scannedAt: {
      toMillis: () => p.scannedAtMs,
    } as Timestamp,
  };
}

export function useScanResult() {
  const { user } = useAuthSession();
  const [scanResult, setScanResult] = useState<ScanResultDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      setScanResult(null);
      setLoading(false);
      return;
    }
    if (!isFirebaseConfigured()) {
      let cancelled = false;
      setLoading(true);
      void (async () => {
        const local = await loadLocalScan();
        if (!cancelled) {
          setScanResult(local ? toScanDoc(local) : null);
          setLoading(false);
          setError(null);
        }
      })();
      return () => {
        cancelled = true;
      };
    }
    setLoading(true);
    const ref = doc(getDb(), "users", user.uid, "scanResult", SCAN_DOC_ID);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setScanResult(null);
        } else {
          setScanResult(snap.data() as ScanResultDoc);
        }
        setLoading(false);
        setError(null);
      },
      (e) => {
        setError(e.message);
        setLoading(false);
      },
    );
    return unsub;
  }, [user]);

  const saveScanResult = useCallback(
    async (detectedType: string, confidence: number) => {
      if (!user) {
        throw new Error("Not signed in");
      }
      setSaving(true);
      setError(null);
      try {
        if (!isFirebaseConfigured()) {
          const scannedAtMs = Date.now();
          await saveLocalScan({ detectedType, confidence, scannedAtMs });
          setScanResult(toScanDoc({ detectedType, confidence, scannedAtMs }));
          return;
        }
        const ref = doc(
          getDb(),
          "users",
          user.uid,
          "scanResult",
          SCAN_DOC_ID,
        );
        await setDoc(ref, {
          detectedType,
          confidence,
          scannedAt: serverTimestamp(),
        });
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Could not save scan";
        setError(message);
        throw e;
      } finally {
        setSaving(false);
      }
    },
    [user],
  );

  return { scanResult, loading, error, saving, saveScanResult };
}
