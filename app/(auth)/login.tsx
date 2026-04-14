import { Link, router } from "expo-router";
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

export default function LoginScreen() {
  const { signIn, busy } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    try {
      await signIn(email, password);
      router.replace("/(tabs)");
    } catch {
      Toast.show({
        type: "error",
        text1: "Sign in failed",
        text2: "Check your email and password.",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Top accent bar */}
      <View style={styles.accentBar} />

      <View style={styles.inner}>
        {/* Brand mark */}
        <View style={styles.brand}>
          <Text style={styles.brandKicker}>Spatial interior studio</Text>
          <Text style={styles.brandTitle}>INTERIO</Text>
          <View style={styles.brandDivider} />
          <Text style={styles.brandSub}>
            Welcome back — pick up where you left off.
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

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={palette.textMuted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Pressable
            style={[styles.primary, busy && styles.disabled]}
            onPress={onSubmit}
            disabled={busy}
          >
            <Text style={styles.primaryText}>
              {busy ? "Signing in…" : "Sign in"}
            </Text>
          </Pressable>

          <Link href="/forgot-password" asChild>
            <Pressable style={styles.forgotRow}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
          </Link>
        </View>

        {/* Footer */}
        <Link href="/signup" asChild>
          <Pressable style={styles.footer}>
            <Text style={styles.footerMuted}>Don't have an account? </Text>
            <Text style={styles.footerLink}>Create one</Text>
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
  accentBar: {
    height: 2,
    backgroundColor: palette.sage,
    opacity: 0.75,
  },
  inner: {
    flex: 1,
    paddingHorizontal: space.lg,
    paddingVertical: space.xl,
    justifyContent: "center",
    gap: space.xl,
  },

  // Brand block
  brand: {
    gap: 4,
  },
  brandKicker: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 11,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: palette.sage,
    opacity: 0.85,
    marginBottom: space.xs,
  },
  brandTitle: {
    fontFamily: fontFamily.displayBold,
    fontSize: 48,
    color: palette.text,
    letterSpacing: 4,
    lineHeight: 52,
  },
  brandDivider: {
    width: 40,
    height: 2,
    backgroundColor: palette.sage,
    opacity: 0.5,
    borderRadius: 1,
    marginVertical: space.sm,
  },
  brandSub: {
    fontFamily: fontFamily.sans,
    fontSize: 16,
    lineHeight: 24,
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
    marginTop: space.sm,
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
  forgotRow: {
    alignItems: "center",
    paddingVertical: space.xs,
  },
  forgotText: {
    fontFamily: fontFamily.sansMedium,
    color: palette.link,
    fontSize: 14,
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: space.sm,
  },
  footerMuted: {
    fontFamily: fontFamily.sans,
    color: palette.textMuted,
    fontSize: 15,
  },
  footerLink: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.link,
    fontSize: 15,
  },
});
