import { useEffect, useState } from "react";

import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import type { UserProfileDoc } from "@/types/models";
import { doc, onSnapshot } from "firebase/firestore";

import { useAuthSession } from "@/contexts/AuthContext";

export function useUserProfile() {
  const { user } = useAuthSession();
  const [profile, setProfile] = useState<UserProfileDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    if (!isFirebaseConfigured()) {
      setProfile({
        name: user.displayName ?? "Guest",
        email: "Offline (no Firebase)",
      });
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    const ref = doc(getDb(), "users", user.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setProfile(null);
        } else {
          setProfile(snap.data() as UserProfileDoc);
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

  return { profile, loading, error };
}
