import { Link } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { useAuth } from "@/hooks/useAuth";
import { fontFamily, palette, radius, space } from "@/constants/theme";

export default function ForgotPasswordScreen() {
  const { resetPassword, busy } = useAuth();
  const [email, setEmail] = useState("");

  const onSubmit = async () => {
    try {
      await resetPassword(email);
      Toast.show({
        type: "success",
        text1: "Email sent",
        text2: "Check your inbox for reset instructions.",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Request failed",
        text2: "Could not send reset email.",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.inner}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerKicker}>Account recovery</Text>
          <Text style={styles.headerTitle}>Reset password</Text>
          <View style={styles.headerDivider} />
          <Text style={styles.headerSub}>
            Enter your account email and we'll send a reset link to your inbox.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={palette.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Pressable
            style={[styles.primary, busy && styles.disabled]}
            onPress={onSubmit}
            disabled={busy}
          >
            <Text style={styles.primaryText}>
              {busy ? "Sending…" : "Send reset email"}
            </Text>
          </Pressable>
        </View>

        {/* Back link */}
        <Link href="/login" asChild>
          <Pressable style={styles.backRow}>
            <Text style={styles.backText}>← Back to sign in</Text>
          </Pressable>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  inner: {
    flex: 1,
    paddingHorizontal: space.lg,
    paddingVertical: space.xl,
    justifyContent: "center",
    gap: space.xl,
  },

  // Header
  header: {
    gap: 4,
  },
  headerKicker: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 11,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: palette.sage,
    opacity: 0.85,
    marginBottom: space.xs,
  },
  headerTitle: {
    fontFamily: fontFamily.displayBold,
    fontSize: 38,
    color: palette.text,
    letterSpacing: 0.5,
    lineHeight: 44,
  },
  headerDivider: {
    width: 32,
    height: 2,
    backgroundColor: palette.sage,
    opacity: 0.5,
    borderRadius: 1,
    marginVertical: space.sm,
  },
  headerSub: {
    fontFamily: fontFamily.sans,
    fontSize: 15,
    lineHeight: 23,
    color: palette.textSecondary,
  },

  // Form
  form: {
    gap: space.sm,
  },
  field: {
    gap: 6,
  },
  label: {
    fontFamily: fontFamily.sansMedium,
    color: palette.textMuted,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingLeft: 2,
  },
  input: {
    fontFamily: fontFamily.sans,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    paddingHorizontal: space.md,
    paddingVertical: 14,
    fontSize: 16,
    color: palette.text,
    borderWidth: 1,
    borderColor: palette.border,
  },
  primary: {
    backgroundColor: palette.sage,
    paddingVertical: 16,
    borderRadius: radius.full,
    alignItems: "center",
    marginTop: space.xs,
  },
  primaryText: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.bg,
    fontSize: 16,
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },

  // Back link
  backRow: {
    alignItems: "center",
    paddingVertical: space.sm,
  },
  backText: {
    fontFamily: fontFamily.sansMedium,
    color: palette.link,
    fontSize: 15,
  },
});
