import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { fontFamily, palette, radius, space } from "@/constants/theme";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfileScreen() {
  const { user, logOut, changePassword, busy } = useAuth();
  const { profile, loading } = useUserProfile();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const displayName = profile?.name ?? user?.displayName ?? "—";
  const email = profile?.email ?? user?.email ?? "—";
  const initials = displayName !== "—" ? getInitials(displayName) : "?";

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
      Toast.show({ type: "success", text1: "Password updated" });
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar + user info */}
      <View style={styles.heroCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.heroInfo}>
          <Text style={styles.heroName}>{displayName}</Text>
          <Text style={styles.heroEmail}>{email}</Text>
        </View>
      </View>

      {/* Security section */}
      <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="lock" size={15} color={palette.textMuted} />
            <Text style={styles.sectionTitle}>Security</Text>
          </View>
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
        </View>

      {/* Sign out */}
      <Pressable style={styles.signOut} onPress={onSignOut} disabled={busy}>
        <Feather name="log-out" size={16} color={palette.danger} style={{ marginRight: 8 }} />
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  content: {
    padding: space.lg,
    paddingBottom: space.xl * 2,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.bg,
  },



  // Hero card
  heroCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.surface,
    borderRadius: radius.xl,
    padding: space.lg,
    marginBottom: space.md,
    borderWidth: 1,
    borderColor: palette.border,
    gap: space.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: palette.sageMuted,
    borderWidth: 2,
    borderColor: palette.sageBorder,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontFamily: fontFamily.displayBold,
    fontSize: 24,
    color: palette.sage,
    letterSpacing: 1,
  },
  heroInfo: {
    flex: 1,
  },
  heroName: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: 24,
    color: palette.text,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  heroEmail: {
    fontFamily: fontFamily.sans,
    fontSize: 14,
    color: palette.textSecondary,
  },

  // Section card
  section: {
    backgroundColor: palette.surface,
    borderRadius: radius.xl,
    padding: space.md,
    marginBottom: space.md,
    borderWidth: 1,
    borderColor: palette.border,
    gap: space.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    marginBottom: space.xs,
    paddingBottom: space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.border,
  },
  sectionTitle: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.textSecondary,
    fontSize: 13,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },

  // Inputs
  input: {
    fontFamily: fontFamily.sans,
    backgroundColor: palette.surface2,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: 13,
    fontSize: 15,
    color: palette.text,
    borderWidth: 1,
    borderColor: palette.border,
  },
  primary: {
    backgroundColor: palette.sage,
    paddingVertical: 15,
    borderRadius: radius.full,
    alignItems: "center",
    marginTop: space.xs,
  },
  primaryText: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.bg,
    fontSize: 15,
    letterSpacing: 0.2,
  },
  disabled: {
    opacity: 0.5,
  },

  // Sign out
  signOut: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: space.lg,
    paddingVertical: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(196, 122, 106, 0.25)",
    backgroundColor: palette.dangerBg,
  },
  signOutText: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.danger,
    fontSize: 15,
  },
});
