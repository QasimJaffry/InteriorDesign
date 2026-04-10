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
import { fontFamily, palette, radius, space } from "@/constants/theme";

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
        <ActivityIndicator size="large" color={palette.sage} />
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

      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>Account</Text>
        <Text style={styles.heroTitle}>{displayName}</Text>
        <Text style={styles.heroEmail}>{email}</Text>
      </View>

      {isOfflineMode ? null : (
        <>
          <Text style={styles.section}>Security</Text>
          <TextInput
            style={styles.input}
            placeholder="Current password"
            placeholderTextColor={palette.textMuted}
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="New password"
            placeholderTextColor={palette.textMuted}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            placeholderTextColor={palette.textMuted}
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
    backgroundColor: palette.bg,
    padding: space.lg,
  },
  offlineBanner: {
    backgroundColor: palette.infoBg,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.md,
    borderWidth: 1,
    borderColor: palette.infoBorder,
  },
  offlineBannerText: {
    fontFamily: fontFamily.sans,
    color: palette.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.bg,
  },
  hero: {
    marginBottom: space.lg,
    paddingBottom: space.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.border,
  },
  heroEyebrow: {
    fontFamily: fontFamily.sansMedium,
    color: palette.textMuted,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: space.sm,
  },
  heroTitle: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: 32,
    color: palette.text,
    marginBottom: 6,
  },
  heroEmail: {
    fontFamily: fontFamily.sans,
    fontSize: 15,
    color: palette.textSecondary,
  },
  section: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.text,
    fontSize: 15,
    marginBottom: space.md,
  },
  input: {
    fontFamily: fontFamily.sans,
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    padding: space.md,
    fontSize: 16,
    color: palette.text,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: space.sm,
  },
  primary: {
    backgroundColor: palette.sage,
    paddingVertical: 16,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: space.sm,
  },
  primaryText: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.bg,
    fontSize: 17,
  },
  disabled: {
    opacity: 0.55,
  },
  signOut: {
    marginTop: space.xl,
    paddingVertical: space.md,
    alignItems: "center",
  },
  signOutText: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.danger,
    fontSize: 16,
  },
});
