import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { useAuthSession } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function ProfileScreen() {
  const { isOfflineMode } = useAuthSession();
  const { user, logOut, changePassword, busy } = useAuth();
  const { profile, loading } = useUserProfile();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const displayName =
    profile?.name ?? user?.displayName ?? "—";
  const email = profile?.email ?? user?.email ?? "—";

  const onChangePassword = async () => {
    if (newPassword.length < 6) {
      Toast.show({
        type: "error",
        text1: "Password too short",
        text2: "Use at least 6 characters.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Mismatch",
        text2: "New passwords do not match.",
      });
      return;
    }
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      Toast.show({
        type: "success",
        text1: "Password updated",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Could not change password",
        text2: "Check your current password.",
      });
    }
  };

  const onSignOut = async () => {
    try {
      await logOut();
      if (isOfflineMode) {
        Toast.show({
          type: "success",
          text1: "Local data cleared",
          text2: "Saved items and last scan were removed from this device.",
        });
        return;
      }
      router.replace("/login");
    } catch {
      Toast.show({ type: "error", text1: "Sign out failed" });
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#c45c5c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isOfflineMode ? (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineBannerText}>
            Running without Firebase — add FIREBASE_* env vars and rebuild to
            enable accounts and cloud sync.
          </Text>
        </View>
      ) : null}
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{displayName}</Text>
        <Text style={[styles.label, styles.mt]}>Email</Text>
        <Text style={styles.value}>{email}</Text>
      </View>

      {isOfflineMode ? null : (
        <>
          <Text style={styles.section}>Change password</Text>
          <TextInput
            style={styles.input}
            placeholder="Current password"
            placeholderTextColor="#667"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="New password"
            placeholderTextColor="#667"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            placeholderTextColor="#667"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Pressable
            style={[styles.primary, busy && styles.disabled]}
            onPress={onChangePassword}
            disabled={busy}
          >
            <Text style={styles.primaryText}>Update password</Text>
          </Pressable>
        </>
      )}

      <Pressable
        style={styles.signOut}
        onPress={onSignOut}
        disabled={busy}
      >
        <Text style={styles.signOutText}>
          {isOfflineMode ? "Clear saved data" : "Sign out"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f12",
    padding: 20,
  },
  offlineBanner: {
    backgroundColor: "#1e2430",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2e3a52",
  },
  offlineBannerText: {
    color: "#aab6c9",
    fontSize: 14,
    lineHeight: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f12",
  },
  card: {
    backgroundColor: "#1a1a20",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#2e2e38",
  },
  label: {
    color: "#889",
    fontSize: 12,
    textTransform: "uppercase",
  },
  mt: {
    marginTop: 12,
  },
  value: {
    color: "#eef2f6",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },
  section: {
    color: "#ccd",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#1a1a20",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: "#eef2f6",
    borderWidth: 1,
    borderColor: "#2e2e38",
    marginBottom: 10,
  },
  primary: {
    backgroundColor: "#c45c5c",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  primaryText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.6,
  },
  signOut: {
    marginTop: 32,
    paddingVertical: 14,
    alignItems: "center",
  },
  signOutText: {
    color: "#f88",
    fontSize: 16,
    fontWeight: "600",
  },
});
