import type { User } from "firebase/auth";

/** Stable uid for the offline-only guest (no Firebase). */
export const LOCAL_OFFLINE_UID = "local-offline-guest";

/** Synthetic Firebase `User` so existing code can keep using `user.uid`, etc. */
export function createLocalGuestUser(): User {
  return {
    uid: LOCAL_OFFLINE_UID,
    email: null,
    emailVerified: false,
    isAnonymous: true,
    displayName: "Guest",
    phoneNumber: null,
    photoURL: null,
    providerId: "local",
    providerData: [],
    metadata: {} as User["metadata"],
    refreshToken: "",
    tenantId: null,
    delete: async () => undefined,
    getIdToken: async () => "",
    getIdTokenResult: async () => {
      throw new Error("Not available in offline mode");
    },
    reload: async () => undefined,
    toJSON: () => ({}),
  } as User;
}
