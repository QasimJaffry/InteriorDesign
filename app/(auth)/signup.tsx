import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { useAuth } from "@/hooks/useAuth";
import { fontFamily, palette, radius, space } from "@/constants/theme";

export default function SignupScreen() {
  const { signUp, busy } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    try {
      await signUp(name, email, password);
      Toast.show({
        type: "success",
        text1: "Account created",
        text2: "We sent a verification email. You can sign in now.",
      });
      router.replace("/login");
    } catch {
      Toast.show({
        type: "error",
        text1: "Sign up failed",
        text2: "Try a different email or stronger password.",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerKicker}>Create account</Text>
          <Text style={styles.headerTitle}>Join INTERIO</Text>
          <View style={styles.headerDivider} />
          <Text style={styles.headerSub}>
            Sync saved pieces and scans across all your devices.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor={palette.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>

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
              placeholder="6+ characters"
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
              {busy ? "Creating account…" : "Create account"}
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <Link href="/login" asChild>
          <Pressable style={styles.footer}>
            <Text style={styles.footerMuted}>Already have an account? </Text>
            <Text style={styles.footerLink}>Sign in</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  inner: {
    paddingHorizontal: space.lg,
    paddingTop: space.xl + space.lg,
    paddingBottom: space.xl * 2,
    gap: space.xl,
    flexGrow: 1,
    justifyContent: "center",
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
    fontSize: 40,
    color: palette.text,
    letterSpacing: 2,
    lineHeight: 46,
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
