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
      <View style={styles.accentLine} />
      <View style={styles.inner}>
        <Text style={styles.kicker}>Spatial interior studio</Text>
        <Text style={styles.title}>Interio</Text>
        <Text style={styles.sub}>Welcome back — pick up where you left off.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={palette.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={palette.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Pressable
          style={[styles.primary, busy && styles.disabled]}
          onPress={onSubmit}
          disabled={busy}
        >
          <Text style={styles.primaryText}>Sign in</Text>
        </Pressable>
        <Link href="/forgot-password" asChild>
          <Pressable>
            <Text style={styles.link}>Forgot password?</Text>
          </Pressable>
        </Link>
        <Link href="/signup" asChild>
          <Pressable style={styles.row}>
            <Text style={styles.muted}>No account? </Text>
            <Text style={styles.linkInline}>Sign up</Text>
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
  accentLine: {
    height: 3,
    backgroundColor: palette.sage,
    opacity: 0.85,
  },
  inner: {
    flex: 1,
    padding: space.lg,
    justifyContent: "center",
    gap: space.sm,
  },
  kicker: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: palette.textSecondary,
    marginBottom: space.xs,
  },
  title: {
    fontFamily: fontFamily.displayBold,
    fontSize: 44,
    color: palette.text,
    letterSpacing: -0.5,
    marginBottom: space.sm,
  },
  sub: {
    fontFamily: fontFamily.sans,
    fontSize: 16,
    lineHeight: 24,
    color: palette.textSecondary,
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
  link: {
    fontFamily: fontFamily.sansMedium,
    color: palette.link,
    fontSize: 15,
    marginTop: space.xs,
  },
  muted: {
    fontFamily: fontFamily.sans,
    color: palette.textMuted,
    fontSize: 15,
  },
  linkInline: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.link,
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    marginTop: space.md,
  },
});
