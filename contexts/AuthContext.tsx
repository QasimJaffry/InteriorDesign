import type { User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { createLocalGuestUser } from "@/lib/localGuestUser";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  initializing: boolean;
  /** No Firebase env — single-device guest session, data in AsyncStorage only. */
  isOfflineMode: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const isOfflineMode = !isFirebaseConfigured();

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setUser(createLocalGuestUser());
      setInitializing(false);
      return;
    }
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (next) => {
      setUser(next);
      setInitializing(false);
    });
    return unsub;
  }, []);

  const value = useMemo(
    () => ({ user, initializing, isOfflineMode }),
    [user, initializing, isOfflineMode],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthSession() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthSession must be used within AuthProvider");
  }
  return ctx;
}
