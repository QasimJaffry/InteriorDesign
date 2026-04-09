import { useCallback, useState } from "react";

import { getDb, getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { clearLocalUserData } from "@/lib/localUserStorage";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { useAuthSession } from "@/contexts/AuthContext";
import { useAppStore } from "@/store/appStore";

export function useAuth() {
  const { user, initializing } = useAuthSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      if (!isFirebaseConfigured()) {
        throw new Error("Firebase is not configured");
      }
      setBusy(true);
      setError(null);
      try {
        const auth = getFirebaseAuth();
        const cred = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password,
        );
        await updateProfile(cred.user, { displayName: name.trim() });
        await sendEmailVerification(cred.user);
        await setDoc(doc(getDb(), "users", cred.user.uid), {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          createdAt: serverTimestamp(),
        });
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Sign up failed";
        setError(message);
        throw e;
      } finally {
        setBusy(false);
      }
    },
    [],
  );

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isFirebaseConfigured()) {
      throw new Error("Firebase is not configured");
    }
    setBusy(true);
    setError(null);
    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Sign in failed";
      setError(message);
      throw e;
    } finally {
      setBusy(false);
    }
  }, []);

  const logOut = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      if (!isFirebaseConfigured()) {
        await clearLocalUserData();
        useAppStore.getState().setSavedIds([]);
        return;
      }
      await signOut(getFirebaseAuth());
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Sign out failed";
      setError(message);
      throw e;
    } finally {
      setBusy(false);
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (!isFirebaseConfigured()) {
      throw new Error("Firebase is not configured");
    }
    setBusy(true);
    setError(null);
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email.trim());
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Could not send reset email";
      setError(message);
      throw e;
    } finally {
      setBusy(false);
    }
  }, []);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!isFirebaseConfigured()) {
        throw new Error("Firebase is not configured");
      }
      const u = getFirebaseAuth().currentUser;
      if (!u?.email) {
        throw new Error("Not signed in");
      }
      setBusy(true);
      setError(null);
      try {
        const cred = EmailAuthProvider.credential(u.email, currentPassword);
        await reauthenticateWithCredential(u, cred);
        await updatePassword(u, newPassword);
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Could not update password";
        setError(message);
        throw e;
      } finally {
        setBusy(false);
      }
    },
    [],
  );

  return {
    user,
    initializing,
    busy,
    error,
    signUp,
    signIn,
    logOut,
    resetPassword,
    changePassword,
  };
}
